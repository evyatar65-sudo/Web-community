"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("הסיסמאות אינן תואמות");
      return;
    }
    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      setError((err as Error).message || "שגיאה באיפוס הסיסמה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center px-4" style={{ paddingTop: "64px" }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-rubik font-black text-3xl text-gray-900 mb-2">סיסמה חדשה</h1>
          <p className="text-gray-500 text-sm">הזן סיסמה חדשה לחשבונך</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-dark" />
              </div>
              <h3 className="font-rubik font-bold text-xl text-gray-900 mb-2">הסיסמה עודכנה!</h3>
              <p className="text-gray-500 text-sm">מעביר אותך לדף הכניסה...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">סיסמה חדשה</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark pl-10"
                    placeholder="לפחות 8 תווים"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">אימות סיסמה</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  placeholder="חזור על הסיסמה"
                />
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
                  "שמור סיסמה חדשה"
                )}
              </button>
              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-400 hover:text-green-dark">
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
