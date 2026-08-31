def calculate_daily_budget(budget: float, days: int) -> float:
    """Menghitung budget harian."""
    if days <= 0:
        return 0.0
    return round(budget / days, 2)

def calculate_total_cost(hotel: float, food: float, transport: float, misc: float) -> float:
    """Menghitung total estimasi biaya perjalanan."""
    return hotel + food + transport + misc

def get_trip_category(daily_budget: float) -> str:
    """Menentukan kategori trip berdasarkan budget harian."""
    if daily_budget >= 150:
        return "Luxury"
    elif daily_budget > 50:
        return "Standard"
    else:
        return "Backpacker"

def get_recommended_places(destinations: list) -> list:
    """Mengembalikan daftar tempat rekomendasi berdasarkan list destinasi pengguna."""
    recommended_places = []
    for dest in destinations:
        dest_clean = dest.strip().lower()
        if dest_clean in ["japan", "tokyo"]:
            recommended_places.extend(["Tokyo Tower", "Shibuya Crossing", "Mount Fuji"])
        elif dest_clean in ["korea", "seoul"]:
            recommended_places.extend(["Namsan Tower", "Gyeongbokgung Palace", "Myeongdong"])
        else:
            recommended_places.extend(["City Center", "Local Market", "Historical Museum"])
    return list(dict.fromkeys(recommended_places))

def get_travel_season(month: str) -> str:
    """Menentukan kategori season berdasarkan bulan perjalanan."""
    # Ekstrak string murni jika bulan dikirim dalam format objek / Enum
    month_str = str(month.value if hasattr(month, 'value') else month).strip().lower()

    # Menangani nama bulan lengkap maupun format 3 huruf
    if month_str in ["december", "dec", "12"]:
        return "Peak Season"
    elif month_str in ["june", "jun", "6"]:
        return "Holiday Season"
    else:
        return "Regular Season"

def evaluate_travel_style(daily_budget: float, travel_style: str) -> dict:
    """Mengevaluasi kesesuaian gaya perjalanan dengan budget harian dan memberikan saran transportasi."""
    style = travel_style.capitalize()
    
    # Batas minimum budget harian dalam USD untuk tiap gaya
    min_budgets = {
        "Backpacker": 0,
        "Standard": 50,
        "Luxury": 150
    }
    
    min_required = min_budgets.get(style, 50)
    is_mismatch = daily_budget < min_required
    
    # Pemetaan transportasi standar berbasis gaya pilihan
    transport_map = {
        "Backpacker": "Bus & Public MRT",
        "Standard": "Regular Train & Taxi Combination",
        "Luxury": "Private Car & Express Bullet Train"
    }
    
    if is_mismatch:
        recommended_transport = "Public Bus / MRT (Disesuaikan karena batasan anggaran)"
        advice = {
            "needed_daily_budget": min_required,
            "message": f"Anggaran harian Anda (${daily_budget}/hari) berada di bawah estimasi gaya {style} (min. ${min_required}/hari)."
        }
    else:
        recommended_transport = transport_map.get(style, "Regular Train")
        advice = None
        
    return {
        "transportation": recommended_transport,
        "is_mismatch": is_mismatch,
        "advice": advice
    }