from enum import Enum
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

import backend.models as models
from backend.database import engine, get_db

# Perintah untuk membuat semua tabel di PostgreSQL secara otomatis
models.Base.metadata.create_all(bind=engine)

# Mengimpor seluruh fungsi logika bisnis dari Sesi 2 TANPA MENGUBAH trip_service.py
from backend.services.trip_service import (
    calculate_daily_budget,
    calculate_total_cost,
    get_trip_category,
    get_recommended_places,
    get_recommended_transportation,
    get_travel_season
)

from backend.services.bedrock_service import generate_trip_recommendation

# Inisialisasi Aplikasi FastAPI
app = FastAPI(
    title="KelanaAI API",
    description="REST API Service for KelanaAI Travel Planner",
    version="0.3.0"
)

# =====================================================================
# 1. SCHEMAS / PYDANTIC MODELS (Model Validasi Request Body)
# =====================================================================

class MonthEnum(str, Enum):
    january = "January"
    february = "February"
    march = "March"
    april = "April"
    may = "May"
    june = "June"
    july = "July"
    august = "August"
    september = "September"
    october = "October"
    november = "November"
    december = "December"

class TripRequest(BaseModel):
    destination: str
    country: Optional[str] = "Unknown"
    days: int
    budget: float
    currency: Optional[str] = "USD"
    travel_month: MonthEnum
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
    
    season = get_travel_season(request.travel_month.value)
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

# =========================================================
# 3. ENDPOINTS DENGAN DATABASE POSTGRESQL (SESI 4)
# =========================================================

@app.post("/trips")
def create_trip_db(request: TripRequest, db: Session = Depends(get_db)):
    # 1. Jalankan Logika Bisnis
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    season = get_travel_season(request.travel_month.value)

    # Membungkus string menjadi List -> ["Bandung"]
    places = get_recommended_places([request.destination])

    # Mengirimkan hasil kategori durasi perjalanan
    transport = get_recommended_transportation(category)

    # Kirim 4 argumen lengkap ke calculate_total_cost
    total_cost = calculate_total_cost(
        request.hotel_cost,
        request.food_cost,
        request.transport_cost,
        request.misc_cost
    )
    is_budget_exceeded = "Ya" if total_cost > request.budget else "Tidak"

    # 2. Buat Objek Model ORM
    new_trip = models.Trip(
        destination=request.destination,
        country=request.country,
        days=request.days,
        budget=request.budget,
        currency=request.currency,
        daily_budget=daily_budget,
        category=category,
        travel_month=request.travel_month.value,
        season=season,
        recommended_places=places,
        travel_style=request.travel_style,
        recommendation_transport=transport,
        total_cost=total_cost,
        budget_exceeded_warning=is_budget_exceeded
    )

    # 3. Simpan ke Database PostgreSQL
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


@app.get("/trips")
def get_all_trips(db: Session = Depends(get_db)):
    trips = db.query(models.Trip).all()
    return trips

# # =======================================================
# # 4. ENDPOINT AI GENERATION AMAZON BEDROCK (SESI 5)
# # =======================================================

@app.post("/api/v1/trips/{id}/generate")
def generate_ai_recommendation(id: int, db: Session = Depends(get_db)):
    # 1. Cari data trip berdasarkan ID di PostgreSQL
    trip = db.query(models.Trip).filter(models.Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # 2. Panggil Bedrock Service untuk membuat rekomendasi AI
    ai_result = generate_trip_recommendation(
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        travel_style=trip.travel_style or "Standard"
    )

    # 3. Simpan hasil rekomendasi ke database PostgreSQL
    trip.ai_recommendation = ai_result
    db.commit()
    db.refresh(trip)

    # 4. Kembalikan balasan JSON
    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "recommendation": trip.ai_recommendation
    }