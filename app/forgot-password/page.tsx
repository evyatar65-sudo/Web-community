"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      setError((err as Error).message || "שגיאה בשליחת הבקשה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center px-4" style={{ paddingTop: "64px" }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-rubik font-black text-3xl text-gray-900 mb-2">שחזור סיסמה</h1>
          <p className="text-gray-500 text-sm">נשלח לך קישור לאיפוס הסיסמה</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-dark" />
              </div>
              <h3 className="font-rubik font-bold text-xl text-gray-900 mb-2">נשלח!</h3>
              <p className="text-gray-600 text-sm mb-6">
                קישור לאיפוס הסיסמה נשלח ל-<strong>{email}</strong>
              </p>
              <Link href="/login" className="text-green-dark font-medium hover:underline text-sm">
                חזרה להתחברות
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  כתובת אימייל
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-dark text-white py-4 rounded-lg font-bold hover:bg-green-mid transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "שלח קישור לאיפוס"
                )}
              </button>
              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-green-dark">
                  חזרה להתחברות
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
