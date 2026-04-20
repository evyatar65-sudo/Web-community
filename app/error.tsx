"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 hero-texture"
      style={{ backgroundColor: "#1a2e1a" }}
    >
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-400" />
        </div>
        <h1 className="font-rubik font-black text-3xl text-white mb-3">שגיאה בלתי צפויה</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          משהו השתבש. אנו מתנצלים על אי הנוחות. נסה לרענן את הדף או חזור לדף הבית.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-green-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-mid transition-colors"
          >
            <RefreshCw size={16} />
            נסה שוב
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            דף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
