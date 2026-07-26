import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from typing import Dict, Any, Tuple

class EligibilityMlEngine:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self._train_dummy_model()

    def _train_dummy_model(self):
        # Features: [category_code, amount, card_tier_code, is_weekend]
        # Categories: 0: Electronics, 1: Travel, 2: Apparel, 3: Cell Phone, 4: Home Appliance, 5: Grocery
        # Card Tiers: 0: Platinum, 1: Reserve, 2: VentureX, 3: Regalia
        X = [
            [0, 45000, 0, 0], [0, 120000, 0, 1], [1, 18000, 0, 0], [1, 35000, 1, 0],
            [2, 6500, 0, 1], [3, 75000, 0, 0], [4, 30000, 2, 0], [5, 1500, 0, 0],
            [0, 500, 0, 0], [1, 800, 3, 0], [2, 300, 0, 0], [5, 5000, 1, 1]
        ]
        # Target: 1 for eligible, 0 for not eligible
        y = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
        self.model.fit(X, y)

    def predict_eligibility(self, category: str, amount: float, card_type: str) -> Tuple[bool, str, str, float, str, float]:
        category_clean = category.strip().title()
        card_tier = card_type.strip().lower()

        # Rule Mapping Matrix
        category_map = {
            "Electronics": ("PURCHASE_PROTECTION", "Purchase Protection", 90, 100000.0, 0.0),
            "Gadgets": ("PURCHASE_PROTECTION", "Purchase Protection", 90, 100000.0, 0.0),
            "Travel": ("TRAVEL_DELAY", "Travel Delay Insurance", 30, 25000.0, 0.0),
            "Airlines": ("TRAVEL_DELAY", "Travel Delay Insurance", 30, 25000.0, 0.0),
            "Hotels": ("TRAVEL_DELAY", "Travel Delay Insurance", 30, 25000.0, 0.0),
            "Apparel": ("RETURN_PROTECTION", "Return Protection", 90, 15000.0, 0.0),
            "Clothing": ("RETURN_PROTECTION", "Return Protection", 90, 15000.0, 0.0),
            "Retail": ("RETURN_PROTECTION", "Return Protection", 90, 15000.0, 0.0),
            "Cell Phone": ("CELL_PHONE_PROTECTION", "Cell Phone Protection", 365, 50000.0, 500.0),
            "Mobile": ("CELL_PHONE_PROTECTION", "Cell Phone Protection", 365, 50000.0, 500.0),
            "Home Appliance": ("EXTENDED_WARRANTY", "Extended Warranty", 365, 150000.0, 0.0),
            "Appliances": ("EXTENDED_WARRANTY", "Extended Warranty", 365, 150000.0, 0.0)
        }

        # Check if amount is non-trivial (> ₹500 / $10)
        if amount < 500:
            return False, "", "", 0.1, "Transaction amount is below minimum protection threshold of ₹500.", 0.0

        if category_clean in category_map:
            code, name, days, max_limit, deductible = category_map[category_clean]
            
            # Card multiplier
            if "platinum" in card_tier or "reserve" in card_tier:
                max_limit *= 1.5
            
            confidence = 0.94 if amount <= max_limit else 0.72

            explanation = (
                f"Qualified for '{name}' under your {card_type} card terms. "
                f"Coverage active up to {days} days from purchase. "
                f"Maximum coverage limit: ₹{max_limit:,.2f} per claim."
            )
            return True, code, name, confidence, explanation, max_limit

        return False, "", "", 0.15, f"Category '{category}' is not covered under default card policy benefits.", 0.0

class FraudMlEngine:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        # Fit dummy data: [amount, frequency_30d, claim_ratio, receipt_mismatch]
        dummy_data = [
            [5000, 1, 0.05, 0], [18000, 2, 0.10, 0], [45000, 1, 0.08, 0],
            [120000, 8, 0.85, 1], [95000, 12, 0.90, 1], [3000, 1, 0.02, 0]
        ]
        self.model.fit(dummy_data)

    def evaluate_claim_risk(self, amount: float, user_claims_count: int, doc_verified: bool, merchant: str) -> Tuple[float, str, bool]:
        risk_score = 0.05

        # Check high claim frequency
        if user_claims_count > 5:
            risk_score += 0.35
        elif user_claims_count > 2:
            risk_score += 0.15

        # Check document verification status
        if not doc_verified:
            risk_score += 0.25

        # Check amount tier
        if amount > 100000:
            risk_score += 0.20
        elif amount > 50000:
            risk_score += 0.10

        # Cap risk score between 0.02 and 0.99
        risk_score = min(max(risk_score, 0.04), 0.98)

        if risk_score < 0.30:
            risk_level = "LOW"
            auto_approved = True
        elif risk_score < 0.65:
            risk_level = "MEDIUM"
            auto_approved = False
        else:
            risk_level = "HIGH"
            auto_approved = False

        return round(risk_score, 2), risk_level, auto_approved

eligibility_engine = EligibilityMlEngine()
fraud_engine = FraudMlEngine()
