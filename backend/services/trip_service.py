def calculate_daily_budget(budget: float, days: int) -> float:
    """Menghitung budget harian."""
    if days <= 0:
        return 0.0
    return round(budget / days, 2)

def calculate_total_cost(hotel: float, food: float, transport: float, misc: float) -> float:
    """Menghitung total estimasi biaya perjalanan."""
    return hotel + food + transport + misc

def get_trip_category(daily_budget: float) -> str:
    """Menentukan kategori trip berdasarkan budget harian (Kalkulasi AI)."""
    if daily_budget >= 150:
        return "Luxury"
    elif daily_budget >= 50:
        return "Standard"
    else:
        return "Backpacker"

def get_recommended_places(destinations: list) -> list:
    """Mengembalikan daftar tempat rekomendasi berdasarkan list destinasi pengguna."""
    recommended_places = []
    for dest in destinations:
        dest_clean = dest.strip().lower()
        if any(k in dest_clean for k in ["japan", "tokyo", "osaka", "kyoto"]):
            recommended_places.extend(["Tokyo Tower", "Shibuya Crossing", "Mount Fuji"])
        elif any(k in dest_clean for k in ["korea", "seoul"]):
            recommended_places.extend(["Namsan Tower", "Gyeongbokgung Palace", "Myeongdong"])
        elif any(k in dest_clean for k in ["thailand", "bangkok"]):
            recommended_places.extend(["Grand Palace", "Wat Arun", "Chatuchak Market"])
        elif any(k in dest_clean for k in ["france", "paris"]):
            recommended_places.extend(["Eiffel Tower", "Louvre Museum", "Arc de Triomphe"])
        elif any(k in dest_clean for k in ["london", "uk", "england"]):
            recommended_places.extend(["Big Ben", "London Eye", "Tower Bridge"])
        else:
            recommended_places.extend(["City Center", "Local Market", "Historical Museum"])
    return list(dict.fromkeys(recommended_places))

def get_travel_season(month: str) -> str:
    """Menentukan kategori season berdasarkan bulan perjalanan."""
    month_str = str(month.value if hasattr(month, 'value') else month).strip().lower()

    if month_str in ["december", "dec", "12"]:
        return "Peak Season"
    elif month_str in ["june", "jun", "6"]:
        return "Holiday Season"
    else:
        return "Regular Season"

def evaluate_travel_style(daily_budget: float, user_category_or_style: str) -> dict:
    """Mengevaluasi kesesuaian gaya perjalanan/kategori pilihan user dengan budget harian."""
    category = (user_category_or_style or "Standard").capitalize()
    
    # Batas minimum budget harian dalam USD
    min_budgets = {
        "Backpacker": 0,
        "Standard": 50,
        "Luxury": 150
    }
    
    # Ambil batas minimum berdasarkan kategori budget (default $50)
    min_required = min_budgets.get(category, 50)
    
    # Hitung mismatch jika daily budget kurang dari ambang minimum kategori pilihan
    is_mismatch = daily_budget < min_required if category in min_budgets else False
    
    # Pemetaan transportasi rekomendasi
    if daily_budget >= 150:
        recommended_transport = "Private Car & Express Bullet Train"
    elif daily_budget >= 50:
        recommended_transport = "Regular Train & Taxi Combination"
    else:
        recommended_transport = "Public Bus & MRT"

    advice = None
    if is_mismatch:
        advice = f"Anggaran harian Anda (${daily_budget:.1f}/hari) berada di bawah estimasi kategori {category} (min. ${min_required}/hari)."

    return {
        "transportation": recommended_transport,
        "is_mismatch": is_mismatch,
        "advice": advice
    }