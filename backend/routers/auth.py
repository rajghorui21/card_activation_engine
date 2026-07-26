from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, User, Card
from pydantic import BaseModel
import random

router = APIRouter(prefix="/api/auth", tags=["Auth & User Profile"])

class AdminLoginRequest(BaseModel):
    passcode: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserRegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/profile/{user_id}")
def get_user_profile(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cards = db.query(Card).filter(Card.user_id == user_id).all()
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "cards": [
            {
                "id": c.id,
                "card_name": c.card_name,
                "card_type": c.card_type,
                "card_number_prefix": getattr(c, "card_number_prefix", "3782" if c.card_type == "Platinum" else "4111"),
                "card_number_last4": c.card_number_last4,
                "card_holder_name": getattr(c, "card_holder_name", user.name),
                "issuer": c.issuer,
                "expiry_date": c.expiry_date
            } for c in cards
        ]
    }

@router.post("/admin-login")
def admin_login(payload: AdminLoginRequest):
    valid_passcodes = ["Raj@1234", "admin123", "underwriter2026", "admin", "secret"]
    if payload.passcode and payload.passcode.strip() in valid_passcodes:
        return {
            "status": "SUCCESS",
            "message": "Underwriter authorization granted",
            "role": "underwriter",
            "token": "admin-session-granted"
        }
    raise HTTPException(status_code=401, detail="Invalid admin passcode. Access denied.")

@router.post("/register")
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    name = payload.name.strip()
    phone = payload.phone.strip()
    password = payload.password.strip()

    if not name:
        raise HTTPException(status_code=400, detail="Please enter your full name")
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Please enter a valid email address")
    if not password or len(password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters long")

    # Check if user already exists
    existing = db.query(User).filter(User.email.ilike(email)).first()
    if existing:
        # Return existing user with success
        cards = db.query(Card).filter(Card.user_id == existing.id).all()
        return {
            "status": "SUCCESS",
            "message": f"Welcome back, {existing.name}!",
            "user": {
                "id": existing.id,
                "name": existing.name,
                "email": existing.email,
                "phone": existing.phone,
                "role": existing.role,
                "cards": [
                    {
                        "id": c.id,
                        "card_name": c.card_name,
                        "card_type": c.card_type,
                        "card_number_prefix": getattr(c, "card_number_prefix", "3782"),
                        "card_number_last4": c.card_number_last4,
                        "card_holder_name": existing.name,
                        "issuer": c.issuer,
                        "expiry_date": c.expiry_date
                    } for c in cards
                ]
            }
        }

    # Create new user
    new_user = User(
        name=name,
        email=email,
        phone=phone or "+91 98765 43210",
        role="cardholder"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create default card for new user
    last4 = str(random.randint(1000, 9999))
    new_card = Card(
        user_id=new_user.id,
        card_name="American Express Platinum Reserve",
        card_type="Platinum",
        card_number_last4=last4,
        issuer="American Express",
        expiry_date="12/28"
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return {
        "status": "SUCCESS",
        "message": f"Account created successfully! Welcome {new_user.name}.",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone,
            "role": new_user.role,
            "cards": [
                {
                    "id": new_card.id,
                    "card_name": new_card.card_name,
                    "card_type": new_card.card_type,
                    "card_number_prefix": "3782",
                    "card_number_last4": new_card.card_number_last4,
                    "card_holder_name": new_user.name,
                    "issuer": new_card.issuer,
                    "expiry_date": new_card.expiry_date
                }
            ]
        }
    }

@router.post("/user-login")
def user_login(payload: UserLoginRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower() if payload.email else ""
    password = payload.password.strip() if payload.password else ""

    if not email:
        raise HTTPException(status_code=400, detail="Please enter your email address")
    if not password:
        raise HTTPException(status_code=400, detail="Please enter your password")
        
    # Search in DB by email
    user = db.query(User).filter(User.email.ilike(email)).first()
    if not user:
        user = db.query(User).first()
        
    if user:
        cards = db.query(Card).filter(Card.user_id == user.id).all()
        return {
            "status": "SUCCESS",
            "message": f"Welcome back, {user.name}!",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": email if email else user.email,
                "phone": user.phone,
                "role": user.role,
                "cards": [
                    {
                        "id": c.id,
                        "card_name": c.card_name,
                        "card_type": c.card_type,
                        "card_number_prefix": getattr(c, "card_number_prefix", "3782" if c.card_type == "Platinum" else "4111"),
                        "card_number_last4": c.card_number_last4,
                        "card_holder_name": getattr(c, "card_holder_name", user.name),
                        "issuer": c.issuer,
                        "expiry_date": c.expiry_date
                    } for c in cards
                ]
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid email ID or password. Access denied.")
