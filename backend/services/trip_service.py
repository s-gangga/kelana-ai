def calculate_daily_budget(budget, days):
    """Menghitung budget harian."""
    return budget / days

def get_trip_category(budget):
    """Menentukan kategori trip berdasarkan total budget."""
    if budget < 1000:
        return "Backpacker"
    elif budget < 3000:
        return "Standard"
    else:
        return "Luxury"

def get_recommended_places(destination):
    """Mengembalikan daftar tempat rekomendasi berdasarkan destinasi."""
    if destination.lower() in ["japan", "tokyo"]:
        return ["Tokyo Tower", "Shibuya Crossing", "Mount Fuji"]
    else:
        return ["City Center", "Local Market", "Historical Museum"]

def get_recommended_transportation(category):
    """[CHALLENGE] Menentukan rekomendasi transportasi berdasarkan kategori trip."""
    if category == "Backpacker":
        return "Public Transit / Walking"
    elif category == "Standard":
        return "Trains / Rideshare"
    else:
        return "Private Car / Express Flight"

def calculate_total_estimated_cost(hotel_cost, food_cost, transport_cost):
    """[CHALLENGE] Menhitung total estimasi biaya perjalanan."""
    return hotel_cost + food_cost + transport_cost