import datetime
import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Transaction, User, Card, Claim, Notification, AuditLog, BenefitPolicy
from models import TransactionCreate
from ml_engine import eligibility_engine, fraud_engine

router = APIRouter(prefix="/api/transactions", tags=["Transactions & Real-Time Monitor"])

@router.get("")
def list_transactions(user_id: int = 1, db: Session = Depends(get_db)):
    txns = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.txn_date.desc()).all()
    return txns

@router.post("")
def ingest_transaction(txn_in: TransactionCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == txn_in.user_id).first()
    if not user:
        user = db.query(User).first()
    
    card = db.query(Card).filter(Card.id == txn_in.card_id).first()
    if not card:
        card = db.query(Card).filter(Card.user_id == user.id).first()

    card_type = card.card_type if card else "Platinum"
    card_last4 = card.card_number_last4 if card else "4092"

    # Evaluate eligibility using AI ML Engine
    is_eligible, benefit_code, benefit_name, confidence, explanation, max_limit = eligibility_engine.predict_eligibility(
        category=txn_in.category,
        amount=txn_in.amount,
        card_type=card_type
    )

    txn_code = f"TXN_{random.randint(10000, 99999)}"
    new_txn = Transaction(
        txn_id=txn_code,
        user_id=user.id,
        card_id=card.id if card else 1,
        merchant=txn_in.merchant,
        category=txn_in.category,
        mcc=txn_in.mcc or "5732",
        amount=txn_in.amount,
        currency=txn_in.currency or "INR",
        location=txn_in.location or "Mumbai, IN",
        txn_date=datetime.datetime.utcnow(),
        is_eligible=is_eligible,
        detected_benefit_code=benefit_code if is_eligible else None,
        confidence_score=confidence,
        explanation=explanation
    )
    db.add(new_txn)
    db.commit()

    claim_draft = None
    notification = None

    if is_eligible:
        # Check user historical claim count for fraud model
        existing_claims_count = db.query(Claim).filter(Claim.user_id == user.id).count()
        fraud_score, risk_level, auto_approved = fraud_engine.evaluate_claim_risk(
            amount=txn_in.amount,
            user_claims_count=existing_claims_count,
            doc_verified=True,
            merchant=txn_in.merchant
        )

        claim_code = f"CLM_{random.randint(10000, 99999)}"
        # Automatically transmit claim to Admin Console for Approve / Reject review
        claim_draft = Claim(
            claim_id=claim_code,
            user_id=user.id,
            txn_id=txn_code,
            benefit_code=benefit_code,
            benefit_name=benefit_name,
            status="VERIFICATION",  # Sent directly to Admin Console for Review
            requested_amount=txn_in.amount,
            approved_amount=min(txn_in.amount, max_limit),
            merchant=txn_in.merchant,
            purchase_date=datetime.datetime.utcnow(),
            card_last4=card_last4,
            coverage_limit=max_limit,
            incident_description=f"Automated benefit claim for {benefit_name} following purchase at {txn_in.merchant}. Transmitted to Admin Console for decision.",
            fraud_score=fraud_score,
            risk_level=risk_level,
            auto_approved=False
        )
        db.add(claim_draft)
        db.commit()

        # Send Real-Time Notification
        notif_title = f"📩 Transmitted to Admin: {benefit_name}"
        notif_msg = f"Your claim {claim_code} for ₹{txn_in.amount:,.2f} at {txn_in.merchant} has been automatically sent to the Admin Console for Approve/Reject review!"
        
        notification = Notification(
            user_id=user.id,
            title=notif_title,
            message=notif_msg,
            benefit_code=benefit_code,
            txn_id=txn_code,
            claim_id=claim_code
        )
        db.add(notification)
        db.commit()

        # Audit Log
        log = AuditLog(
            event_type="CLAIM_SENT_TO_ADMIN",
            description=f"Transaction claim {claim_code} automatically sent to Admin Console for Approve/Reject decision",
            metadata_json={
                "txn_id": txn_code,
                "benefit_code": benefit_code,
                "confidence": confidence,
                "auto_claim_id": claim_code,
                "status": "VERIFICATION"
            }
        )
        db.add(log)
        db.commit()

    return {
        "status": "SUCCESS",
        "transaction": {
            "txn_id": new_txn.txn_id,
            "merchant": new_txn.merchant,
            "category": new_txn.category,
            "amount": new_txn.amount,
            "is_eligible": new_txn.is_eligible,
            "detected_benefit_code": new_txn.detected_benefit_code,
            "confidence_score": new_txn.confidence_score,
            "explanation": new_txn.explanation
        },
        "auto_claim_draft": {
            "claim_id": claim_draft.claim_id,
            "benefit_name": claim_draft.benefit_name,
            "coverage_limit": claim_draft.coverage_limit,
            "status": claim_draft.status,
            "fraud_score": claim_draft.fraud_score,
            "risk_level": claim_draft.risk_level
        } if claim_draft else None,
        "notification": {
            "title": notification.title,
            "message": notification.message
        } if notification else None
    }
