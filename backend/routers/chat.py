from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, BenefitPolicy, User, Card, Claim
from models import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["AI Benefit Assistant Chatbot"])

@router.post("/query", response_model=ChatResponse)
def query_ai_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    msg_lower = req.message.lower()

    if "purchase protection" in msg_lower or "electronics" in msg_lower or "laptop" in msg_lower or "macbook" in msg_lower or "tv" in msg_lower:
        response = (
            "🛡️ **Purchase Protection Insight:**\n\n"
            "Eligible purchases made on your **AMEX Platinum** card are automatically covered against theft, accidental damage, or loss for **90 days** from purchase date.\n"
            "• **Coverage Limit:** Up to ₹1,00,000 per claim.\n"
            "• **Required Document:** Store Receipt or Repair Quote.\n"
            "• **Auto-fill Status:** BenefitGuard pre-fills your claim form instantly upon swiping!"
        )
        actions = ["View Purchase Protection Policy", "Simulate Electronics Purchase", "View Draft Claims"]

    elif "travel" in msg_lower or "flight" in msg_lower or "delay" in msg_lower or "indigo" in msg_lower or "airline" in msg_lower:
        response = (
            "✈️ **Travel Delay Insurance Insight:**\n\n"
            "When your flight ticket or travel booking is charged to your card, you qualify for delay reimbursement if your trip is delayed by **4+ hours**.\n"
            "• **Reimbursement Cap:** Up to ₹25,000 for unexpected hotel stays, meals, and essential toiletries.\n"
            "• **Instant Upload:** Upload your Boarding Pass or Delay Certificate for 10-second OCR extraction."
        )
        actions = ["Scan Flight Delay Certificate", "Simulate Flight Purchase", "View Active Protections"]

    elif "return" in msg_lower or "clothing" in msg_lower or "zara" in msg_lower or "apparel" in msg_lower:
        response = (
            "🛍️ **Return Protection Insight:**\n\n"
            "If a merchant refuses to accept a return for an item purchased on your card within **90 days**, BenefitGuard steps in to refund your full purchase cost up to **₹15,000 per item**."
        )
        actions = ["Submit Return Claim", "View Retail Policy Limits"]

    elif "health" in msg_lower or "score" in msg_lower or "utilization" in msg_lower:
        response = (
            "📊 **Your Benefit Health Score is 88/100 (EXCELLENT)!**\n\n"
            "You have claimed **₹60,900** out of **₹67,000** in total eligible card protections this year, recovering 91% of your card insurance perks."
        )
        actions = ["View Health Score Details", "Check Remaining Coverage"]

    else:
        response = (
            "🤖 **BenefitGuard AI Assistant:**\n\n"
            "I continuously monitor your card swiping real-time streams and automatically match purchases to 5 core card protection benefits:\n"
            "1. **Purchase Protection** (Electronics, Gadgets, TV)\n"
            "2. **Travel Delay Insurance** (Flights, Trains, Hotels)\n"
            "3. **Return Protection** (Apparel, Footwear, Retail)\n"
            "4. **Cell Phone Protection** (Mobile screen/theft)\n"
            "5. **Extended Warranty** (Appliances, Tech)\n\n"
            "Ask me anything about policy limits, claim pre-fills, or document requirements!"
        )
        actions = ["Why am I eligible?", "How do auto-claims work?", "Show my active card benefits"]

    return ChatResponse(response=response, suggested_actions=actions)
