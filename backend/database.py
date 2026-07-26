import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./benefitguard.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="customer")  # customer, underwriter, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    cards = relationship("Card", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    claims = relationship("Claim", back_populates="user")

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    card_name = Column(String(100), nullable=False)  # e.g., "American Express Platinum Reserve"
    card_type = Column(String(50), nullable=False)   # Platinum, Reserve, VentureX
    card_number_prefix = Column(String(6), default="3782") # e.g. 3782, 4111, 4532
    card_number_last4 = Column(String(4), nullable=False) # e.g. 4092, 7812, 1104
    card_holder_name = Column(String(100), default="Sayan Rudra")
    issuer = Column(String(50), nullable=False)
    expiry_date = Column(String(10), nullable=False)
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="cards")
    transactions = relationship("Transaction", back_populates="card")

class BenefitPolicy(Base):
    __tablename__ = "benefit_policies"

    id = Column(Integer, primary_key=True, index=True)
    card_type = Column(String(50), nullable=False, index=True)
    benefit_code = Column(String(50), nullable=False) # PURCHASE_PROTECTION, RETURN_PROTECTION, TRAVEL_DELAY, EXTENDED_WARRANTY, CELL_PHONE_PROTECTION
    benefit_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    coverage_days = Column(Integer, default=90) # e.g. 90 days from purchase
    max_coverage_per_item = Column(Float, default=1000.0)
    max_coverage_per_year = Column(Float, default=10000.0)
    deductible = Column(Float, default=0.0)
    qualifying_mccs = Column(JSON, default=list) # List of categories/MCCs
    min_amount = Column(Float, default=0.0)
    required_docs = Column(JSON, default=list) # e.g. ["Receipt", "Incident Report", "Repair Quote"]
    active = Column(Boolean, default=True)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    txn_id = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    merchant = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False) # Electronics, Travel, Apparel, Cell Phone, Home Appliance
    mcc = Column(String(10), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    location = Column(String(100), default="Mumbai, IN")
    txn_date = Column(DateTime, default=datetime.datetime.utcnow)
    is_eligible = Column(Boolean, default=False)
    detected_benefit_code = Column(String(50), nullable=True)
    confidence_score = Column(Float, default=0.0)
    explanation = Column(Text, nullable=True)

    user = relationship("User", back_populates="transactions")
    card = relationship("Card", back_populates="transactions")
    claim = relationship("Claim", back_populates="transaction", uselist=False)

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    txn_id = Column(String(50), ForeignKey("transactions.txn_id"))
    benefit_code = Column(String(50), nullable=False)
    benefit_name = Column(String(100), nullable=False)
    status = Column(String(50), default="DRAFT") # DRAFT, SUBMITTED, VERIFICATION, FRAUD_CHECK, APPROVED, REJECTED, PAID
    requested_amount = Column(Float, nullable=False)
    approved_amount = Column(Float, default=0.0)
    incident_date = Column(DateTime, default=datetime.datetime.utcnow)
    incident_description = Column(Text, nullable=True)
    
    # Auto-filled fields
    merchant = Column(String(100))
    purchase_date = Column(DateTime)
    card_last4 = Column(String(4))
    coverage_limit = Column(Float)
    
    # ML & Risk
    fraud_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH
    auto_approved = Column(Boolean, default=False)
    rejection_reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="claims")
    transaction = relationship("Transaction", back_populates="claim")
    documents = relationship("Document", back_populates="claim")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(String(50), unique=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"))
    file_name = Column(String(255), nullable=False)
    doc_type = Column(String(50), nullable=False) # Receipt, Boarding Pass, Repair Quote, Police Report
    file_path = Column(Text, nullable=True)
    parsed_json = Column(JSON, nullable=True)
    is_verified = Column(Boolean, default=False)
    ocr_confidence = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    claim = relationship("Claim", back_populates="documents")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    benefit_code = Column(String(50), nullable=True)
    txn_id = Column(String(50), nullable=True)
    claim_id = Column(String(50), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
