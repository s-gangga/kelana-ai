def calculate_daily_budget(budget, days):
    """Menhitung budget harian."""
    return budget / days

def get_trip_category(budget):
    """Menentukan kategori trip berdasarkan budget."""
    if budget < 1000:
        return "Backpacker"
    elif budget < 3000:
        return "Standard"
    else:
        return "Luxury"

def get_recommended_places(destination):
    """Mengembalikan daftar tempat rekomendasi berdasarkan destinasi."""
    # Contoh rekomendasi dasar
    if destination.lower() == "japan" or destination.lower() == "tokyo":
        return ["Tokyo Tower", "Shibuya Crossing", "Mount Fuji"]
    else:
        return ["City Center", "Local Market", "Historical Museum"]