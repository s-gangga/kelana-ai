"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrips, Trip } from "@/services/tripService";
import { TripCard } from "@/components/TripCard";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("latest");

  // State Paginasi: Diatur 10 item per halaman
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // [PERBAIKAN 1]: Mengubah batas dari 6 menjadi 9 item per halaman

  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      const data = await getTrips();
      setTrips(data);
      setLoading(false);
    }
    loadTrips();
  }, []);

  // Reset halaman paginasi jika pencarian atau pengurutan berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Logika Fitur Search (Mendukung pencarian user_category maupun category)
  const filteredTrips = trips.filter((trip) => {
    const query = searchQuery.toLowerCase();
    const matchesDest = trip.destination.toLowerCase().includes(query);
    const matchesStyle = trip.travel_style?.toLowerCase().includes(query) || false;
    const matchesUserCat = trip.user_category?.toLowerCase().includes(query) || false;
    const matchesAICat = trip.category?.toLowerCase().includes(query) || false;
    return matchesDest || matchesStyle || matchesUserCat || matchesAICat;
  });

  // Logika Fitur Sort
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "oldest") {
      return (a.id || 0) - (b.id || 0);
    } else if (sortBy === "highest_budget") {
      return b.budget - a.budget;
    } else {
      return (b.id || 0) - (a.id || 0);
    }
  });

  // Logika Kalkulasi Paginasi
  const totalItems = sortedTrips.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTrips = sortedTrips.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link href="/" className="text-sm text-blue-400 hover:underline mb-2 inline-block">
              ← Kembali ke Form Utama
            </Link>
            <h1 className="text-3xl font-extrabold text-white">Trip History Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Jelajahi kembali seluruh rencana perjalanan yang tersimpan di database.
            </p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl text-center text-sm transition"
          >
            + Buat Rencana Baru
          </Link>
        </div>

        {/* Control Bar: Search & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Cari berdasarkan destinasi, gaya, atau kategori (cth: Seoul, Luxury)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="latest">Urutkan: Terbaru (Latest)</option>
              <option value="oldest">Urutkan: Terlama (Oldest)</option>
              <option value="highest_budget">Urutkan: Budget Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <p className="animate-pulse text-lg">Memuat riwayat perjalanan dari database...</p>
          </div>
        ) : sortedTrips.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-2xl p-8 space-y-4">
            <div className="text-5xl">🗺️</div>
            <h3 className="text-xl font-bold text-white">Tidak ada riwayat perjalanan ditemukan</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              {searchQuery
                ? `Tidak ada perjalanan yang cocok dengan kata kunci "${searchQuery}".`
                : "Anda belum memiliki rencana perjalanan yang tersimpan."}
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Buat Rencana Pertama Anda →
            </Link>
          </div>
        ) : (
          <>
            {/* Grid Card Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>

            {/* [PERBAIKAN 2]: Kontrol Paginasi Aktif Jika Total Halaman > 1 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 pt-6 border-t border-slate-800">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border border-slate-700 text-white transition"
                >
                  ← Previous
                </button>
                <span className="text-sm text-slate-400">
                  Halaman <strong className="text-white">{currentPage}</strong> dari <strong className="text-white">{totalPages}</strong> (Total: {totalItems} Trip)
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg border border-slate-700 text-white transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}