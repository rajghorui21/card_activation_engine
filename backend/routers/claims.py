import datetime
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db, Claim, Transaction, Document, User, AuditLog, Notification
from models import ClaimSubmitRequest
from ml_engine import fraud_engine

router = APIRouter(prefix="/api/claims", tags=["Claims & Lifecycle Workflow"])

@router.get("")
def list_claims(user_id: Optional[int] = 1, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Claim)
    if user_id:
        query = query.filter(Claim.user_id == user_id)
    if status:
        query = query.filter(Claim.status == status)
    
    # Sort claims Newest First (Latest submitted claim first)
    claims = query.order_by(Claim.created_at.desc(), Claim.id.desc()).all()
    
    # Return formatted payload including document counts
    res = []
    for c in claims:
        docs = db.query(Document).filter(Document.claim_id == c.id).all()
        res.append({
            "id": c.id,
            "claim_id": c.claim_id,
            "user_id": c.user_id,
            "txn_id": c.txn_id,
            "benefit_code": c.benefit_code,
            "benefit_name": c.benefit_name,
            "status": c.status,
            "requested_amount": c.requested_amount,
            "approved_amount": c.approved_amount,
            "merchant": c.merchant,
            "card_last4": c.card_last4,
            "coverage_limit": c.coverage_limit,
            "incident_description": c.incident_description,
            "fraud_score": c.fraud_score,
            "risk_level": c.risk_level,
            "auto_approved": c.auto_approved,
            "rejection_reason": c.rejection_reason,
            "documents_count": len(docs),
            "created_at": c.created_at,
            "updated_at": c.updated_at
        })
    return res

@router.get("/{claim_id}")
def get_claim_details(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    txn = db.query(Transaction).filter(Transaction.txn_id == claim.txn_id).first()
    docs = db.query(Document).filter(Document.claim_id == claim.id).all()
    
    return {
        "claim": claim,
        "transaction": txn,
        "documents": docs
    }

@router.post("/{claim_id}/submit")
def submit_claim(claim_id: str, payload: ClaimSubmitRequest, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # State transition: DRAFT -> SUBMITTED -> VERIFICATION -> FRAUD_CHECK -> (APPROVED/REJECTED)
    claim.status = "SUBMITTED"
    if payload.incident_description:
        claim.incident_description = payload.incident_description
    if payload.requested_amount > 0:
        claim.requested_amount = payload.requested_amount
        
    claim.updated_at = datetime.datetime.utcnow()
    db.commit()

    # Automatic Verification & Fraud check step
    claim.status = "VERIFICATION"
    db.commit()

    # Re-evaluate fraud engine
    existing_claims = db.query(Claim).filter(Claim.user_id == claim.user_id).count()
    fraud_score, risk_level, auto_app = fraud_engine.evaluate_claim_risk(
        amount=claim.requested_amount,
        user_claims_count=existing_claims,
        doc_verified=True,
        merchant=claim.merchant or "Store"
    )
    claim.fraud_score = fraud_score
    claim.risk_level = risk_level
    claim.status = "FRAUD_CHECK"
    db.commit()

    if auto_app and fraud_score < 0.25:
        claim.status = "APPROVED"
        claim.approved_amount = min(claim.requested_amount, claim.coverage_limit)
        claim.auto_approved = True
        
        # Add notification
        n = Notification(
            user_id=claim.user_id,
            title="Claim Auto-Approved Instant Payout!",
            message=f"Claim {claim.claim_id} for {claim.merchant} has been approved for ₹{claim.approved_amount:,.2f}. Funds dispatched.",
            benefit_code=claim.benefit_code,
            claim_id=claim.claim_id
        )
        db.add(n)
    else:
        claim.status = "VERIFICATION" # Kept for manual underwriter review

    db.commit()

    # Audit log
    audit = AuditLog(
        event_type="CLAIM_SUBMITTED",
        description=f"Claim {claim.claim_id} submitted and processed. Final status: {claim.status}",
        metadata_json={"claim_id": claim.claim_id, "status": claim.status, "fraud_score": fraud_score}
    )
    db.add(audit)
    db.commit()

    return {
        "status": "SUCCESS",
        "claim_id": claim.claim_id,
        "current_status": claim.status,
        "approved_amount": claim.approved_amount,
        "risk_level": claim.risk_level,
        "fraud_score": claim.fraud_score,
        "auto_approved": claim.auto_approved
    }

@router.patch("/{claim_id}/review")
def review_claim(
    claim_id: str,
    action: str = Body(..., embed=True), # APPROVE or REJECT
    reason: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db)
):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    if action.upper() == "APPROVE":
        claim.status = "APPROVED"
        claim.approved_amount = min(claim.requested_amount, claim.coverage_limit)
        claim.rejection_reason = None
        message = f"Underwriter approved claim {claim.claim_id} for ₹{claim.approved_amount:,.2f}."
    else:
        claim.status = "REJECTED"
        claim.approved_amount = 0.0
        claim.rejection_reason = reason or "Documentation insufficient or policy condition unfulfilled."
        message = f"Claim {claim.claim_id} rejected. Reason: {claim.rejection_reason}"

    claim.updated_at = datetime.datetime.utcnow()
    db.commit()

    # Add notification
    n = Notification(
        user_id=claim.user_id,
        title=f"Claim Status Update: {claim.status}",
        message=message,
        benefit_code=claim.benefit_code,
        claim_id=claim.claim_id
    )
    db.add(n)
    db.commit()

    return {
        "status": "SUCCESS",
        "claim_id": claim.claim_id,
        "new_status": claim.status,
        "approved_amount": claim.approved_amount,
        "rejection_reason": claim.rejection_reason
    }
