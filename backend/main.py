from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

# Mengimpor seluruh fungsi logika bisnis dari Sesi 2 TANPA MENGUBAH trip_service.py
from backend.services.trip_service import (
    calculate_daily_budget,
    calculate_total_cost,
    get_trip_category,
    get_recommended_places,
    get_recommended_transportation,
    get_travel_season
)

# Inisialisasi Aplikasi FastAPI
app = FastAPI(
    title="KelanaAI API",
    description="REST API Service for KelanaAI Travel Planner",
    version="0.3.0"
)

# =====================================================================
# 1. SCHEMAS / PYDANTIC MODELS (Model Validasi Request Body)
# =====================================================================

class TripRequest(BaseModel):
    destination: str
    country: Optional[str] = "Unknown"
    days: int
    budget: float
    currency: Optional[str] = "USD"
    travel_month: Optional[str] = "Regular"
    travel_style: Optional[str] = "Standard"  # [CORE CHALLENGE]
    hotel_cost: Optional[float] = 0.0
    food_cost: Optional[float] = 0.0
    transport_cost: Optional[float] = 0.0
    misc_cost: Optional[float] = 0.0

# =====================================================================
# 2. ENDPOINTS IMPLEMENTATION
# =====================================================================

# [HANDS-ON LAB] Endpoint 1 — GET /
@app.get("/")
def home():
    return {"message": "Welcome to KelanaAI"}

# [HANDS-ON LAB] Endpoint 2 — GET /health
@app.get("/health")
def health_check():
    return {"status": "OK"}

# [BONUS CHALLENGE] Endpoint — GET /api/v1/trip-categories
@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return ["Backpacker", "Standard", "Luxury"]

# [HOMEWORK] Endpoint 1 — GET /api/v1/recommendations
@app.get("/api/v1/recommendations")
def get_all_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]

# [HOMEWORK] Endpoint 2 — GET /api/v1/transportations
@app.get("/api/v1/transportations")
def get_all_transportations():
    return ["Bus", "Train", "Flight"]

# [HANDS-ON LAB & CORE CHALLENGE] Endpoint 3 — POST /api/v1/trips
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    # Memanggil fungsi logika bisnis dari trip_service.py
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    
    # Mengolah list destinasi
    destinations_list = [request.destination]
    places = get_recommended_places(destinations_list)
    
    # [CORE CHALLENGE] Transport Recommendation
    recommendation_transport = get_recommended_transportation(category)
    
    season = get_travel_season(request.travel_month)
    total_cost = calculate_total_cost(
        request.hotel_cost, request.food_cost, request.transport_cost, request.misc_cost
    )
    
    is_budget_exceeded = total_cost > request.budget

    # Mengembalikan JSON Response
    return {
        "destination": request.destination,
        "country": request.country,
        "days": request.days,
        "budget": request.budget,
        "currency": request.currency,
        "daily_budget": daily_budget,
        "category": category,
        "travel_month": request.travel_month,
        "season": season,
        "recommended_places": places,
        "travel_style": request.travel_style,
        "recommendation_transport": recommendation_transport,  # [CORE CHALLENGE]
        "total_cost": total_cost,
        "budget_exceeded_warning": is_budget_exceeded
    }