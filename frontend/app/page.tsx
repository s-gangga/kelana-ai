"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    days: 3,
    budget: 500,
    currency: "USD",
    travel_month: "January",
    category: "Standard",      // Kategori Anggaran Pilihan User (Backpacker/Standard/Luxury)
    travel_style: "Solo",       // Tipe Perjalanan Rombongan (Solo/Couple/Family)
    hotel_cost: 0,
    food_cost: 0,
    transport_cost: 0,
    misc_cost: 0,
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "days" || name.includes("cost") || name === "budget" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // PERBAIKAN: Petakan formData.category menjadi user_category untuk backend FastAPI
    const payload = {
      ...formData,
      user_category: formData.category, // Memastikan pilihan user dikirim ke field user_category
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal memproses data trip");

      const data = await res.json();
      setResult(data);

      // Auto-redirect ke Dashboard setelah trip baru dibuat
      router.push("/trips");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      <main className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* 1. HERO SECTION & DESTINATION IMAGE */}
          <header className="text-center space-y-4">
            <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
                alt="Travel Hero Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-400 drop-shadow-md">
                  KelanaAI Travel Planner
                </h1>
                <p className="text-slate-300 text-sm md:text-base mt-1">
                  Rencanakan liburan impianmu secara cerdas dengan kalkulasi otomatis
                </p>
              </div>
            </div>
          </header>

          {/* 2. FORM INPUT */}
          <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Destinasi</label>
                <input
                  type="text"
                  name="destination"
                  required
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Contoh: Tokyo / Bali"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Negara</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Contoh: Japan / Indonesia"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Jumlah Hari</label>
                <input
                  type="number"
                  name="days"
                  min="1"
                  value={formData.days}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Total Anggaran (USD)</label>
                <input
                  type="number"
                  name="budget"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Bulan Perjalanan</label>
                <select
                  name="travel_month"
                  value={formData.travel_month}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Kategori Anggaran */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Kategori Anggaran</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Backpacker">Backpacker (≤$50/hari)</option>
                  <option value="Standard">Standard ($50-$150/hari)</option>
                  <option value="Luxury">Luxury (≥$150/hari)</option>
                </select>
              </div>
            </div>

            {/* FIELD: Tipe Perjalanan (Travel Style) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Tipe Perjalanan (Travel Style)</label>
              <select
                name="travel_style"
                value={formData.travel_style}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Solo">Solo Travel</option>
                <option value="Couple">Couple / Pasangan</option>
                <option value="Family">Family / Keluarga</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition shadow-md mt-2"
            >
              {loading ? "Memproses..." : "Hitung Rencana Perjalanan"}
            </button>
          </form>

          {/* 3. OUTPUT ERROR */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* 4. OUTPUT HASIL */}
          {result && (
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 shadow-lg">
              <h2 className="text-2xl font-bold text-green-400">Hasil Rencana: {result.destination}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <p><span className="text-slate-400">Kategori Trip:</span> {result.category}</p>
                <p><span className="text-slate-400">Tipe Perjalanan:</span> {result.travel_style}</p>
                <p><span className="text-slate-400">Anggaran Harian:</span> ${result.daily_budget}</p>
                <p><span className="text-slate-400">Musim Terprediksi:</span> {result.season}</p>
              </div>

              {result.is_mismatch && result.advice && (
                <div className="bg-amber-900/40 border border-amber-500/60 p-4 rounded-lg text-amber-200 text-sm space-y-2">
                  <p className="font-semibold flex items-center gap-1">
                    ⚠️ Penyesuaian Anggaran & Gaya Perjalanan
                  </p>
                  <p>{result.advice.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm py-6 text-center mt-12">
        <div className="max-w-3xl mx-auto space-y-2 px-4">
          <p>© 2026 KelanaAI Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}