from services.trip_service import (
    calculate_daily_budget,
    calculate_total_cost,
    get_trip_category,
    get_recommended_places,
    get_recommended_transportation,
    get_travel_season
)

def print_trip_summary(destinations, country, days, budget, currency, travel_month, daily_budget, category, places, transport, season, total_cost):
    print("==============================")
    print("KelanaAI - Trip Summary")
    print("==============================")
    
    if len(destinations) == 1:
        print(f"Destination : {destinations[0]}")
    else:
        dest_str = " ".join([f"{i+1}. {d}" for i, d in enumerate(destinations)])
        print(f"Your Destinations : {dest_str}")
        
    print(f"Country           : {country}")
    print(f"Days              : {days}")
    print(f"Budget            : {budget} {currency}")
    print(f"Daily Budget      : {daily_budget:.2f} {currency}")
    print(f"Total Est. Cost   : {total_cost:.2f} {currency}")
    print(f"Category          : {category}")
    print(f"Transport         : {transport}")
    print(f"Travel Month      : {travel_month}")
    print(f"Season            : {season}")
    
    # [SESI 1 BONUS CHALLENGE] Alert jika total estimasi biaya melebihi budget
    if total_cost > budget:
        print("⚠️ Warning: Budget exceeded!")
        
    print("------------------------------")
    print("Recommended Places to Visit:")
    for place in places:
        print(f"- {place}")
    print("==============================")

def main():
    destinations = []
    
    print("--- Input Destinasi (Ketik 'selesai' atau tekan Enter jika sudah) ---")
    while True:
        dest = input("Masukkan Destinasi: ").strip()
        if dest.lower() == 'selesai' or dest == "":
            if not destinations:
                print("Minimal masukkan 1 destinasi!")
                continue
            break
        destinations.append(dest)
        
    country = input("Masukkan Negara: ")
    days = int(input("Masukkan Jumlah Hari: "))
    budget = float(input("Masukkan Total Budget: "))
    currency = input("Masukkan Mata Uang: ")
    travel_month = input("Masukkan Bulan Perjalanan: ")
    
    # [SESI 1 CORE CHALLENGE] Input Breakdown Biaya
    print("\n--- Input Rincian Biaya (Cost Breakdown) ---")
    hotel_cost = float(input("Masukkan Biaya Hotel: "))
    food_cost = float(input("Masukkan Biaya Makanan: "))
    transport_cost = float(input("Masukkan Biaya Transportasi: "))
    misc_cost = float(input("Masukkan Biaya Lain-lain (Misc): "))
    
    # Kalkulasi Logika Bisnis
    daily_budget = calculate_daily_budget(budget, days)
    total_cost = calculate_total_cost(hotel_cost, food_cost, transport_cost, misc_cost)
    category = get_trip_category(budget)
    places = get_recommended_places(destinations)
    transport = get_recommended_transportation(category)
    season = get_travel_season(travel_month)
    
    print()
    print_trip_summary(
        destinations, country, days, budget, currency, travel_month,
        daily_budget, category, places, transport, season, total_cost
    )

if __name__ == "__main__":
    main()