def calculate_daily_budget(budget, days):
    """Menghitung budget harian."""
    return budget / days

def calculate_total_cost(hotel, food, transport, misc):
    """[SESI 1 CORE CHALLENGE] Menghitung total estimasi biaya perjalanan."""
    return hotel + food + transport + misc

def get_trip_category(budget):
    """Menentukan kategori trip berdasarkan budget total."""
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"

def get_recommended_places(destinations):
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

def get_recommended_transportation(category):
    """[SESI 2 CORE CHALLENGE] Menentukan rekomendasi transportasi berdasarkan kategori trip."""
    if category == "Backpacker":
        return "Bus"
    elif category == "Standard":
        return "Train"
    else:
        return "Flight"

def get_travel_season(month):
    """[SESI 2 TUGAS] Menentukan kategori season berdasarkan bulan perjalanan."""
    month_lower = month.strip().lower()
    if month_lower == "december":
        return "Peak Season"
    elif month_lower == "june":
        return "Holiday Season"
    else:
        return "Regular Season"