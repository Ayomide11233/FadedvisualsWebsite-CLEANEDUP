from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import stripe
from app.config import get_settings

settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter(prefix="/stripe", tags=["Stripe"])

# Currencies where Stripe expects whole units (no cents)
ZERO_DECIMAL_CURRENCIES = {
    "JPY", "KRW", "VND", "IDR", "BIF", "GNF",
    "MGA", "PYG", "RWF", "UGX", "XAF", "XOF"
}

class CheckoutItem(BaseModel):
    product_id: Optional[str] = None
    title: str
    price: Optional[float] = None        # Original USD price (fallback)
    quantity: int = 1
    size: Optional[str] = None
    frame: Optional[str] = None
    unit_amount: int                     # Frontend now sends this (e.g., 87290 for NAD)
    currency: str                        # Frontend now sends this (e.g., "nad")

class CreateCheckoutSession(BaseModel):
    items: List[CheckoutItem]
    success_url: str
    cancel_url: str
    currency: str                        # Top-level currency (e.g., "nad")

@router.post("/create-checkout-session")
async def create_checkout_session(data: CreateCheckoutSession):
    """
    Creates a Stripe Session using the pre-calculated amounts 
    and currency sent from the JS stripeService.
    """
    try:
        session_currency = data.currency.lower()
        line_items = []

        for item in data.items:
            # Build the description for the Stripe UI
            parts = []
            if item.size: parts.append(f"Size: {item.size}")
            if item.frame and item.frame != "No Frame": parts.append(f"Frame: {item.frame}")
            description = " | ".join(parts) if parts else "Digital Visuals"

            line_items.append({
                "price_data": {
                    "currency": session_currency,
                    "product_data": {
                        "name": item.title,
                        "description": description,
                    },
                    # We trust the unit_amount calculated by our JS service
                    "unit_amount": item.unit_amount,
                },
                "quantity": item.quantity,
            })

        # Create the session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=data.success_url,
            cancel_url=data.cancel_url,
            # Expanded list to ensure Namibia and others are supported
            shipping_address_collection={
                "allowed_countries": [
                    "US", "CA", "GB", "AU", "NA", "ZA", 
                    "NG", "KE", "GH", "DE", "FR", "IT", 
                    "ES", "NL", "IN"
                ],
            },
            billing_address_collection="required",
        )

        return {
            "success": True,
            "session_id": session.id,
            "url": session.url,
            "currency": session_currency,
        }

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/config")
async def get_stripe_config():
    return {
        "publishable_key": settings.STRIPE_PUBLISHABLE_KEY
    }