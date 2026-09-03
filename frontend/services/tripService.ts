// Membaca URL dari .env agar tidak hardcode
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Interface tipe data Trip
export interface Trip {
  id?: number;
  destination: string;
  country?: string;
  days: number;
  budget: number;
  currency?: string;
  daily_budget?: number;
  user_category?: string; // [PERBAIKAN SANGAT PENTING]: Untuk menampung kategori pilihan dropdown user
  category?: string;      // Kategori hasil kalkulasi AI
  travel_month: string;
  season?: string;
  recommended_places?: string[];
  travel_style?: string;  // Solo / Couple / Family
  recommendation_transport?: string;
  is_mismatch?: boolean;
  advice?: any;
  total_cost?: number;
  budget_exceeded_warning?: boolean;
  ai_recommendation?: string;
}

// 1. Mengambil seluruh daftar riwayat trip dari PostgreSQL (bekerja via FastAPI)
export async function getTrips(): Promise<Trip[]> {
  try {
    const res = await fetch(`${API_URL}/trips`, {
      cache: "no-store", // Selalu fetch data segar dari database
    });
    if (!res.ok) throw new Error("Gagal mengambil daftar trip");
    return await res.json();
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
}

// 2. Mengambil detail satu trip spesifik berdasarkan ID
export async function getTrip(id: string | number): Promise<Trip | null> {
  try {
    const res = await fetch(`${API_URL}/trips/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal mengambil detail trip");
    return await res.json();
  } catch (error) {
    console.error(`Error fetching trip ${id}:`, error);
    return null;
  }
}

// 3. Mengirim formulir pembuatan trip baru
export async function createTrip(data: Trip): Promise<any> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Gagal menyimpan rencana perjalanan");
  }

  return await res.json();
}