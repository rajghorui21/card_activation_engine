from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, BenefitPolicy, Card, User
from models import BenefitEvaluationRequest, BenefitEvaluationResponse
from ml_engine import eligibility_engine

router = APIRouter(prefix="/api/benefits", tags=["Benefit Policies & Eligibility Engine"])

@router.get("/policies")
def get_policies(card_type: str = "Platinum", db: Session = Depends(get_db)):
    policies = db.query(BenefitPolicy).filter(
        BenefitPolicy.card_type.ilike(f"%{card_type}%"),
        BenefitPolicy.active == True
    ).all()
    if not policies:
        policies = db.query(BenefitPolicy).filter(BenefitPolicy.active == True).all()
    return policies

@router.post("/evaluate", response_model=BenefitEvaluationResponse)
def evaluate_eligibility(req: BenefitEvaluationRequest, db: Session = Depends(get_db)):
    is_eligible, code, name, confidence, explanation, max_limit = eligibility_engine.predict_eligibility(
        category=req.category,
        amount=req.amount,
        card_type=req.card_type
    )

    policy = db.query(BenefitPolicy).filter(
        BenefitPolicy.benefit_code == code,
        BenefitPolicy.card_type.ilike(f"%{req.card_type}%")
    ).first()

    coverage_days = policy.coverage_days if policy else 90
    deductible = policy.deductible if policy else 0.0

    return BenefitEvaluationResponse(
        is_eligible=is_eligible,
        benefit_code=code if is_eligible else None,
        benefit_name=name if is_eligible else None,
        confidence_score=confidence,
        explanation=explanation,
        coverage_limit=max_limit,
        remaining_days=coverage_days,
        deductible=deductible
    )
