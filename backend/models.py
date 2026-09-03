from sqlalchemy import Column, Integer, String, Float, JSON, Text
from backend.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, index=True)
    country = Column(String)
    days = Column(Integer)
    budget = Column(Float)
    currency = Column(String)
    daily_budget = Column(Float)
    
    # PERBAIKAN: Pemisahan Kategori Input User vs Rekomendasi AI
    user_category = Column(String, nullable=True) # Pilihan awal dari dropdown user (Backpacker/Standard/Luxury)
    category = Column(String)                     # Rekomendasi/kalkulasi AI (Backpacker/Standard/Luxury)
    
    travel_month = Column(String)
    season = Column(String)
    recommended_places = Column(JSON)
    travel_style = Column(String)
    recommendation_transport = Column(String)
    total_cost = Column(Float)
    budget_exceeded_warning = Column(String)
    ai_recommendation = Column(Text, nullable=True) # Baris baru Sesi 5