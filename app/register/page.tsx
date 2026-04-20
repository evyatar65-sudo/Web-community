"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    personalId: "",
    serviceYears: "",
    roleInUnit: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function passwordStrength(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: "", color: "bg-gray-200" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: "חלשה", color: "bg-red-400" };
    if (score === 2) return { score, label: "בינונית", color: "bg-orange-400" };
    if (score === 3) return { score, label: "טובה", color: "bg-yellow-400" };
    return { score, label: "חזקה", color: "bg-green-mid" };
  }

  const strength = passwordStrength(form.password);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }
    if (form.password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    if (!form.agreed) {
      setError("יש לאשר את ההצהרה");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("לא ניתן ליצור משתמש");

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: form.fullName,
        personal_id: form.personalId,
        service_years: form.serviceYears,
        role_in_unit: form.roleInUnit,
        phone: form.phone,
        status: "pending",
        role: "member",
      });

      if (profileError) throw profileError;
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "שגיאה בהרשמה, נסה שוב");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-light px-4" style={{ paddingTop: "64px" }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="w-20 h-20 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-dark" />
          </div>
          <h1 className="font-rubik font-black text-2xl text-gray-900 mb-3">הבקשה התקבלה!</h1>
          <p className="text-gray-600 leading-relaxed">
            בקשתך להצטרפות לעמותה התקבלה ותועבר לאישור מנהל.
            נחזור אליך בהקדם לאחר אימות הפרטים.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block bg-green-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-green-mid transition-colors"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light px-4 py-10" style={{ paddingTop: "100px" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-dark flex items-center justify-center text-white font-rubik font-bold text-xl mx-auto mb-4">
            סנ
          </div>
          <h1 className="font-rubik font-black text-3xl text-gray-900 mb-2">הצטרפות לעמותה</h1>
          <p className="text-gray-500 text-sm">
            כבר חבר?{" "}
            <Link href="/login" className="text-green-dark font-semibold hover:underline">
              כניסה כאן
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  שם מלא <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  placeholder="ישראל ישראלי"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  מספר אישי (צבאי) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.personalId}
                  onChange={(e) => setForm({ ...form, personalId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  placeholder="XXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  שנות שירות <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.serviceYears}
                  onChange={(e) => setForm({ ...form, serviceYears: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  placeholder="לדוגמה: 2015–2018"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  תפקיד ביחידה
                </label>
                <input
                  type="text"
                  value={form.roleInUnit}
                  onChange={(e) => setForm({ ...form, roleInUnit: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  placeholder='לוחם / מ"כ / ...'
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  אימייל <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  טלפון
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  placeholder="05X-XXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  סיסמה <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            strength.score >= i ? strength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      חוזק סיסמה: <span className="font-medium">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  אישור סיסמה <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark pl-10"
                    placeholder="חזור על הסיסמה"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-pale rounded-xl">
              <input
                type="checkbox"
                id="agreed"
                checked={form.agreed}
                onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                className="mt-0.5 shrink-0 w-4 h-4 accent-green-dark"
              />
              <label htmlFor="agreed" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                אני מאשר/ת שהנני בוגר/ת סיירת נח&quot;ל ושכל הפרטים שמסרתי הם נכונים ומדויקים.
                הבנתי שהעמותה תבצע אימות לפני אישור הגישה.
              </label>
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
              className="w-full bg-green-dark text-white py-4 rounded-lg font-rubik font-bold text-base hover:bg-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  שולח בקשה...
                </>
              ) : (
                "הגשת בקשת הצטרפות"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
