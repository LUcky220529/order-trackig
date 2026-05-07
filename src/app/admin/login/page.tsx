"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden float-anim">
        <div className="p-8 text-center bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] text-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b8963e] via-[#d4af5a] to-[#b8963e]"></div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg pulse-ring">M</div>
          <h1 className="text-3xl font-black mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Login</h1>
          <p className="text-[#9aa5b4] text-sm">Mercury Dry Cleaners Dashboard</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#4a5568] mb-1.5 uppercase tracking-wider">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e8edf3] rounded-xl px-4 py-3 text-[#0a1628] text-sm focus:outline-none transition-all duration-200 focus:border-[#b8963e] focus:ring-2 focus:ring-[#b8963e]/20"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-3 rounded-lg border border-red-100 slide-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-[#b8963e] to-[#d4af5a] text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#b8963e]/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Verifying...</>
              ) : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
