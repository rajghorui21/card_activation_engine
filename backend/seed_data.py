import datetime
from database import engine, Base, SessionLocal, User, Card, BenefitPolicy, Transaction, Claim, Notification, AuditLog

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing if any
    if db.query(User).count() > 0:
        db.close()
        return

    print("Seeding database...")

    # 1. Users
    user1 = User(
        name="Sayan Rudra",
        email="sayan@benefitguard.ai",
        phone="+91 9876543210",
        role="customer"
    )
    user2 = User(
        name="Sarah Jenkins",
        email="sarah@example.com",
        phone="+1 555-0199",
        role="customer"
    )
    admin_user = User(
        name="Underwriter Admin",
        email="admin@benefitguard.ai",
        phone="+91 9900011223",
        role="underwriter"
    )
    db.add_all([user1, user2, admin_user])
    db.commit()

    # 2. Cards
    card1 = Card(
        user_id=user1.id,
        card_name="American Express Platinum Reserve",
        card_type="Platinum",
        card_number_prefix="3782",
        card_number_last4="4092",
        card_holder_name="Sayan Rudra",
        issuer="American Express",
        expiry_date="08/28"
    )
    card2 = Card(
        user_id=user1.id,
        card_name="Chase Sapphire Reserve Metal",
        card_type="Reserve",
        card_number_prefix="4111",
        card_number_last4="7812",
        card_holder_name="Sayan Rudra",
        issuer="Chase Visa Signature",
        expiry_date="11/27"
    )
    card3 = Card(
        user_id=user2.id,
        card_name="Capital One Venture X World Elite",
        card_type="VentureX",
        card_number_prefix="4532",
        card_number_last4="1104",
        card_holder_name="Sarah Jenkins",
        issuer="Capital One Mastercard",
        expiry_date="04/29"
    )
    db.add_all([card1, card2, card3])
    db.commit()

    # 3. Benefit Policies
    policies = [
        BenefitPolicy(
            card_type="Platinum",
            benefit_code="PURCHASE_PROTECTION",
            benefit_name="Purchase Protection",
            description="Covers eligible purchases against theft, accidental damage, or loss within 90 days from the purchase date.",
            coverage_days=90,
            max_coverage_per_item=100000.0,
            max_coverage_per_year=500000.0,
            deductible=0.0,
            qualifying_mccs=["Electronics", "Gadgets", "Home Appliance", "Luxury"],
            min_amount=1000.0,
            required_docs=["Store Invoice", "Receipt", "Damage Photo / Police Report"]
        ),
        BenefitPolicy(
            card_type="Platinum",
            benefit_code="TRAVEL_DELAY",
            benefit_name="Travel Delay Insurance",
            description="Reimburses unexpected lodging, meals, and essentials if your flight or train is delayed by more than 4 hours.",
            coverage_days=30,
            max_coverage_per_item=25000.0,
            max_coverage_per_year=100000.0,
            deductible=0.0,
            qualifying_mccs=["Travel", "Airlines", "Railways", "Hotels"],
            min_amount=2000.0,
            required_docs=["Airline Delay Certificate", "Boarding Pass", "Expense Receipts"]
        ),
        BenefitPolicy(
            card_type="Platinum",
            benefit_code="RETURN_PROTECTION",
            benefit_name="Return Protection",
            description="Reimburses item cost if the merchant refuses a return within 90 days of purchase.",
            coverage_days=90,
            max_coverage_per_item=15000.0,
            max_coverage_per_year=60000.0,
            deductible=0.0,
            qualifying_mccs=["Apparel", "Clothing", "Retail", "Footwear"],
            min_amount=500.0,
            required_docs=["Original Store Invoice", "Merchant Return Rejection Proof"]
        ),
        BenefitPolicy(
            card_type="Platinum",
            benefit_code="CELL_PHONE_PROTECTION",
            benefit_name="Cell Phone Protection",
            description="Covers stolen or damaged mobile phones when monthly phone bills or phone purchases are paid on the card.",
            coverage_days=365,
            max_coverage_per_item=50000.0,
            max_coverage_per_year=100000.0,
            deductible=500.0,
            qualifying_mccs=["Cell Phone", "Mobile", "Telecom"],
            min_amount=2000.0,
            required_docs=["Repair Estimate", "Cell Phone Bill Copy", "Purchase Receipt"]
        ),
        BenefitPolicy(
            card_type="Platinum",
            benefit_code="EXTENDED_WARRANTY",
            benefit_name="Extended Warranty",
            description="Doubles the manufacturer's original warranty period up to 1 extra year for eligible purchases.",
            coverage_days=365,
            max_coverage_per_item=150000.0,
            max_coverage_per_year=500000.0,
            deductible=0.0,
            qualifying_mccs=["Home Appliance", "Electronics", "Appliances"],
            min_amount=5000.0,
            required_docs=["Original Warranty Card", "Purchase Receipt", "Repair Invoice"]
        )
    ]
    db.add_all(policies)
    db.commit()

    # 4. Seed Historical Transactions
    txns = [
        Transaction(
            txn_id="TXN_9901",
            user_id=user1.id,
            card_id=card1.id,
            merchant="Croma Electronics",
            category="Electronics",
            amount=48500.0,
            currency="INR",
            location="Mumbai, IN",
            txn_date=datetime.datetime.utcnow() - datetime.timedelta(days=12),
            is_eligible=True,
            detected_benefit_code="PURCHASE_PROTECTION",
            confidence_score=0.96,
            explanation="Qualified for Purchase Protection (Electronics category, amount under ₹1,00,000 limit)."
        ),
        Transaction(
            txn_id="TXN_9902",
            user_id=user1.id,
            card_id=card1.id,
            merchant="IndiGo Airlines",
            category="Travel",
            amount=18500.0,
            currency="INR",
            location="New Delhi, IN",
            txn_date=datetime.datetime.utcnow() - datetime.timedelta(days=5),
            is_eligible=True,
            detected_benefit_code="TRAVEL_DELAY",
            confidence_score=0.94,
            explanation="Qualified for Travel Delay Insurance (Airlines transaction, potential flight delay reimbursement up to ₹25,000)."
        ),
        Transaction(
            txn_id="TXN_9903",
            user_id=user1.id,
            card_id=card1.id,
            merchant="Zara Retail",
            category="Apparel",
            amount=6490.0,
            currency="INR",
            location="Bengaluru, IN",
            txn_date=datetime.datetime.utcnow() - datetime.timedelta(days=2),
            is_eligible=True,
            detected_benefit_code="RETURN_PROTECTION",
            confidence_score=0.91,
            explanation="Qualified for Return Protection (Apparel category, 90-day coverage)."
        )
    ]
    db.add_all(txns)
    db.commit()

    # 5. Seed Claims (Auto-generated drafts & historical approved)
    claim1 = Claim(
        claim_id="CLM_8001",
        user_id=user1.id,
        txn_id="TXN_9901",
        benefit_code="PURCHASE_PROTECTION",
        benefit_name="Purchase Protection",
        status="DRAFT",
        requested_amount=48500.0,
        approved_amount=0.0,
        merchant="Croma Electronics",
        card_last4="4092",
        coverage_limit=100000.0,
        incident_description="Smart OLED TV screen cracked accidentally during home movement within 14 days of purchase.",
        fraud_score=0.08,
        risk_level="LOW",
        auto_approved=True
    )
    claim2 = Claim(
        claim_id="CLM_8002",
        user_id=user1.id,
        txn_id="TXN_9902",
        benefit_code="TRAVEL_DELAY",
        benefit_name="Travel Delay Insurance",
        status="APPROVED",
        requested_amount=12400.0,
        approved_amount=12400.0,
        merchant="IndiGo Airlines",
        card_last4="4092",
        coverage_limit=25000.0,
        incident_description="Flight 6E-532 delayed by 5.5 hours at IGI Delhi due to foggy weather. Reimbursed hotel stay & meals.",
        fraud_score=0.05,
        risk_level="LOW",
        auto_approved=True
    )
    db.add_all([claim1, claim2])
    db.commit()

    # 6. Notifications
    n1 = Notification(
        user_id=user1.id,
        title="Benefit Activated: Purchase Protection",
        message="Your ₹48,500 purchase at Croma Electronics is automatically protected against damage or theft until Oct 20, 2026. Claim draft prepared!",
        benefit_code="PURCHASE_PROTECTION",
        txn_id="TXN_9901",
        claim_id="CLM_8001"
    )
    n2 = Notification(
        user_id=user1.id,
        title="Travel Protection Active",
        message="IndiGo flight ₹18,500 qualifies for Travel Delay Insurance up to ₹25,000.",
        benefit_code="TRAVEL_DELAY",
        txn_id="TXN_9902",
        claim_id="CLM_8002"
    )
    db.add_all([n1, n2])
    db.commit()

    # 7. Audit Log
    log = AuditLog(
        event_type="SYSTEM_INIT",
        description="BenefitGuard AI engine initialized with active policies and ML eligibility models.",
        metadata_json={"engine_version": "v1.0.4", "policies_count": 5}
    )
    db.add(log)
    db.commit()

    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
