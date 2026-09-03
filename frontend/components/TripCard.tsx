import Link from "next/link";
import { Trip } from "@/services/tripService";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  // 1. Logika Pemetaan Ikon Bendera/Destinasi Menggunakan FlagCDN
  const renderDestinationFlag = (dest: string) => {
    const d = dest.toLowerCase();
    let countryCode = "";

    if (d.includes("japan") || d.includes("tokyo") || d.includes("osaka") || d.includes("kyoto") || d.includes("jp")) countryCode = "jp";
    else if (d.includes("thailand") || d.includes("bangkok") || d.includes("th")) countryCode = "th";
    else if (d.includes("korea") || d.includes("seoul") || d.includes("jeju") || d.includes("kr")) countryCode = "kr";
    else if (d.includes("bali") || d.includes("bandung") || d.includes("indonesia") || d.includes("id")) countryCode = "id";
    else if (d.includes("singapore") || d.includes("sg")) countryCode = "sg";
    else if (d.includes("france") || d.includes("paris") || d.includes("nice") || d.includes("fr")) countryCode = "fr";
    else if (d.includes("london") || d.includes("uk") || d.includes("england") || d.includes("gb")) countryCode = "gb";

    if (countryCode) {
      return (
        <img
          src={`https://flagcdn.com/w40/${countryCode}.png`}
          alt="Flag"
          className="w-6 h-4 inline-block object-cover rounded-sm shadow-sm"
        />
      );
    }

    return <span className="text-xl">✈️</span>;
  };

  // Bersihkan prefix kode negara mentah (JP, TH, KR, ID, SG, FR, GB) agar judul kota tampil rapi
  const cleanDestinationName = trip.destination.replace(/^(jp|th|kr|id|sg|fr|gb)\s+/i, "");

  // 2. Formatting Anggaran Uang
  const formatBudget = (amount: number, currency: string = "USD") => {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  };

  // 3. Logika Warna Category Badge (AI Recommendation)
  const getCategoryBadgeClass = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "luxury":
        return "bg-purple-900/80 text-purple-200 border-purple-500/50";
      case "standard":
        return "bg-blue-900/80 text-blue-200 border-blue-500/50";
      case "backpacker":
      default:
        return "bg-emerald-900/80 text-emerald-200 border-emerald-500/50";
    }
  };

  // Helper untuk menghitung kategori AI berdasarkan daily budget ($/hari)
  const getCalculatedAICategory = (budget: number, days: number) => {
    const daily = days > 0 ? budget / days : 0;
    if (daily <= 50) return "Backpacker";
    if (daily <= 150) return "Standard";
    return "Luxury";
  };

  // Evaluasi Logika Dual-Badge (PERBAIKAN UTAMA DI SINI)
  const userStyle = trip.travel_style || "Solo"; // Metadata tipe rombongan (Solo/Couple/Family)
  
  // Ambil pilihan asli user dari user_category, atau fallback ke 'category' jika data lama
  const userCategory = trip.user_category || trip.category || "Standard"; 
  
  // Hitung rekomendasi AI secara otomatis
  const aiCategory = getCalculatedAICategory(trip.budget, trip.days);

  // Status Verified HANYA terpicu jika pilihan user SAMA PERSI3 dengan kalkulasi AI
  const isMatch = userCategory.toLowerCase() === aiCategory.toLowerCase();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition duration-200 flex flex-col justify-between shadow-lg">
      <div>
        {/* Header Kartu: Ikon & Nama Destinasi */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {renderDestinationFlag(trip.destination)}
            <h3 className="text-xl font-bold text-white capitalize">{cleanDestinationName}</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">#{trip.id}</span>
        </div>

        {/* Badges: Travel Style vs AI Category Result */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Badge 1: User Travel Style */}
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md border bg-slate-800 text-slate-300 border-slate-700 flex items-center gap-1">
            👤 {userStyle}
          </span>

          {/* Badge 2: AI Recommendation / Verified Status */}
          {isMatch ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md border bg-emerald-950/80 text-emerald-300 border-emerald-500/50 flex items-center gap-1">
              ✨ Verified: {aiCategory} ✅
            </span>
          ) : (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${getCategoryBadgeClass(aiCategory)}`}>
              ✨ AI Rec: {aiCategory}
            </span>
          )}
        </div>

        {/* Kotak AI Advice Box */}
        {trip.ai_advice && (
          <div className="mb-4 p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-xs text-indigo-200 italic">
            💡 {trip.ai_advice}
          </div>
        )}

        {/* Detail Informasi Durasi & Anggaran */}
        <div className="space-y-1 text-sm text-slate-300 mb-5">
          <p className="flex justify-between">
            <span className="text-slate-400">Durasi:</span>
            <span className="font-medium text-slate-200">{trip.days} Hari</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Total Anggaran:</span>
            <span className="font-bold text-emerald-400">{formatBudget(trip.budget, trip.currency)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Bulan:</span>
            <span className="text-slate-200">{trip.travel_month}</span>
          </p>
        </div>
      </div>

      {/* Tombol Navigasi Detail */}
      <Link
        href={`/trips/${trip.id}`}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg text-center transition duration-150 inline-block"
      >
        View Details →
      </Link>
    </div>
  );
}