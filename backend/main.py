from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_recommended_places,
    get_recommended_transportation
)

def print_trip_summary(destination, country, days, budget, currency, travel_month, daily_budget, category, places, transport):
    print("==============================")
    print("KelanaAI - Trip Summary")
    print("==============================")
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    print(f"Daily Budget: {daily_budget:.2f} {currency}")
    print(f"Category    : {category}")
    print(f"Transport   : {transport}")
    print(f"Travel Month: {travel_month}")
    print("------------------------------")
    print("Recommended Places to Visit:")
    for place in places:
        print(f"- {place}")
    print("==============================")

def main():
    destination = input("Masukkan Destinasi: ")
    country = input("Masukkan Negara: ")
    days = int(input("Masukkan Jumlah Hari: "))
    budget = float(input("Masukkan Budget: "))
    currency = input("Masukkan Mata Uang: ")
    travel_month = input("Masukkan Bulan Perjalanan: ")
    
    # Memanggil fungsi-fungsi logika bisnis dari trip_service.py
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)
    places = get_recommended_places(destination)
    transport = get_recommended_transportation(category)
    
    print()
    print_trip_summary(
        destination, country, days, budget, currency, travel_month,
        daily_budget, category, places, transport
    )

if __name__ == "__main__":
    main()