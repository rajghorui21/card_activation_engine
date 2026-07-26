from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class TransactionCreate(BaseModel):
    user_id: int = 1
    card_id: int = 1
    merchant: str
    category: str  # Electronics, Travel, Apparel, Cell Phone, Home Appliance
    amount: float
    mcc: Optional[str] = "5732"
    location: Optional[str] = "Mumbai, IN"
    currency: Optional[str] = "INR"

class TransactionResponse(BaseModel):
    id: int
    txn_id: str
    user_id: int
    card_id: int
    merchant: str
    category: str
    amount: float
    currency: str
    location: str
    txn_date: datetime
    is_eligible: bool
    detected_benefit_code: Optional[str] = None
    confidence_score: float = 0.0
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class BenefitEvaluationRequest(BaseModel):
    merchant: str
    category: str
    amount: float
    card_type: str
    txn_date: Optional[str] = None

class BenefitEvaluationResponse(BaseModel):
    is_eligible: bool
    benefit_code: Optional[str] = None
    benefit_name: Optional[str] = None
    confidence_score: float
    explanation: str
    coverage_limit: float
    remaining_days: int
    deductible: float

class ClaimSubmitRequest(BaseModel):
    claim_id: str
    incident_description: Optional[str] = "Item damaged / delayed trip / return requested"
    requested_amount: float
    documents: Optional[List[str]] = []

class ClaimResponse(BaseModel):
    id: int
    claim_id: str
    user_id: int
    txn_id: str
    benefit_code: str
    benefit_name: str
    status: str
    requested_amount: float
    approved_amount: float
    merchant: str
    card_last4: str
    coverage_limit: float
    fraud_score: float
    risk_level: str
    auto_approved: bool
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OcrParseResponse(BaseModel):
    doc_id: str
    merchant: str
    amount: float
    date: str
    category: str
    item_description: str
    confidence: float
    match_status: str # MATCHED, DISCREPANCY, UNVERIFIED
    details: Dict[str, Any]

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = 1

class ChatResponse(BaseModel):
    response: str
    suggested_actions: Optional[List[str]] = []
