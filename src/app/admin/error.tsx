"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-red-100">
        <div className="text-6xl mb-6">🚨</div>
        <h2 className="text-2xl font-black text-[#0a1628] mb-4">Something went wrong</h2>
        <p className="text-[#4a5568] mb-8 text-sm leading-relaxed">
          The Admin Dashboard encountered an unexpected error. This usually happens due to missing environment variables or a database connection issue.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-[#0a1628] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#1e3a5f] transition-all"
          >
            Try again
          </button>
          <a
            href="/admin"
            className="block w-full text-[#9aa5b4] font-bold py-2 text-sm hover:text-[#0a1628] transition-colors"
          >
            Go back to Dashboard
          </a>
        </div>
        {process.env.NODE_ENV === "development" && (
           <div className="mt-8 p-4 bg-red-50 rounded-xl text-left overflow-auto max-h-40">
             <p className="text-xs font-mono text-red-700 whitespace-pre-wrap">{error.message}</p>
           </div>
        )}
      </div>
    </div>
  );
}
