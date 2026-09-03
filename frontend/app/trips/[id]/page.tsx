"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown"; // [PERBAIKAN]: Mengimpor ReactMarkdown
import { getTrip, Trip } from "@/services/tripService";

export default function TripDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false); // State untuk loading trigger AI Bedrock

  useEffect(() => {
    async function loadTripDetail() {
      if (!id) return;
      setLoading(true);
      const data = await getTrip(id);
      setTrip(data);
      setLoading(false);
    }
    loadTripDetail();
  }, [id]);

  // Fungsi Pemicu (Handler) untuk memanggil API Bedrock AI Generation
  const handleGenerateAI = async () => {
    if (!id) return;
    setGenerating(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/trips/${id}/generate`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Gagal meng-generate AI recommendation");

      const data = await res.json();
      // Perbarui state trip dengan teks rekomendasi AI baru
      setTrip((prev) => (prev ? { ...prev, ai_recommendation: data.recommendation } : null));
    } catch (err) {
      console.error("Error generating AI itinerary:", err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex justify-center items-center">
        <p className="animate-pulse text-slate-400">Memuat detail rencana perjalanan...</p>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col justify-center items-center space-y-4">
        <h2 className="text-2xl font-bold text-rose-400">Rencana Perjalanan Tidak Ditemukan</h2>
        <Link href="/trips" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-xl">
          ← Kembali ke Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Link */}
        <Link href="/trips" className="text-sm text-blue-400 hover:underline inline-block">
          ← Kembali ke Dashboard Riwayat
        </Link>

        {/* Header Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Detail Itinerari</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white capitalize mt-1">
                {trip.destination}
              </h1>
              <p className="text-slate-400 text-sm mt-1">Negara: {trip.country || "Utama"}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-sm font-semibold rounded-lg bg-blue-900/50 text-blue-300 border border-blue-500/30">
                {trip.category || "Standard"}
              </span>
              <span className="px-3 py-1 text-sm font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                {trip.travel_style || "Solo"}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400">Durasi</p>
              <p className="text-xl font-bold text-white mt-1">{trip.days} Hari</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400">Total Budget</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">USD {trip.budget.toLocaleString("en-US")}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400">Budget Harian</p>
              <p className="text-xl font-bold text-blue-400 mt-1">USD {trip.daily_budget || Math.round(trip.budget / trip.days)}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400">Musim Prediksi</p>
              <p className="text-xl font-bold text-amber-300 mt-1">{trip.season || "Regular"}</p>
            </div>
          </div>
        </div>

        {/* Transport Recommendation Section */}
        {trip.recommendation_transport && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
            <h3 className="text-lg font-bold text-white">Rekomendasi Transportasi</h3>
            <p className="text-slate-300 text-sm">{trip.recommendation_transport}</p>
          </div>
        )}

        {/* AI Itinerary Recommendation (Amazon Bedrock Result & Trigger Button) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">✨</span>
              <h2 className="text-xl font-bold text-white">Rekomendasi AI Itinerari</h2>
            </div>
            {!trip.ai_recommendation && (
              <button
                onClick={handleGenerateAI}
                disabled={generating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {generating ? "Memproses AI..." : "⚡ Generate AI Itinerary"}
              </button>
            )}
          </div>

          {trip.ai_recommendation ? (
            /* [PERBAIKAN]: Menggunakan elemen ReactMarkdown untuk merender teks itinerary */
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed bg-slate-950 p-4 md:p-6 rounded-xl border border-slate-800">
              <ReactMarkdown>{trip.ai_recommendation}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic">
              Rekomendasi AI terperinci belum di-generate untuk trip ini. Klik tombol di atas untuk membuat itinerary secara otomatis.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}