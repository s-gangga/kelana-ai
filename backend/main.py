def print_trip_summary(destination, country, days, budget, currency, travel_month):
    print("==============================")
    print("KelanaAI")
    print("==============================")
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    print(f"Currency    : {currency}")
    print(f"Travel Month : {travel_month}")

def main():
    destination = input("Masukkan Destinasi: ")
    country = input("Masukkan Negara: ")
    days = int(input("Masukkan Jumlah Hari: "))
    budget = float(input("Masukkan Budget: "))
    currency = input("Masukkan Mata Uang: ")
    travel_month = input("Masukkan Bulan Perjalanan: ")
    
    print()
    print_trip_summary(destination, country, days, budget, currency, travel_month)

if __name__ == "__main__":
    main()