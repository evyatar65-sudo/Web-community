"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Clock, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userStatus, setUserStatus] = useState<"pending" | "rejected" | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUserStatus(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error("לא ניתן להתחבר");

      const { data: profile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", data.user.id)
        .single();

      const status = (profile as Pick<Profile, "status"> | null)?.status;

      if (status === "pending") {
        setUserStatus("pending");
        await supabase.auth.signOut();
        return;
      }
      if (status === "rejected") {
        setUserStatus("rejected");
        await supabase.auth.signOut();
        return;
      }

      router.push("/members");
      router.refresh();
    } catch (err: unknown) {
      const message = (err as Error).message || "";
      if (message.includes("Invalid login credentials")) {
        setError("אימייל או סיסמה שגויים");
      } else {
        setError(message || "שגיאה בהתחברות");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center px-4" style={{ paddingTop: "64px" }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-dark flex items-center justify-center text-white font-rubik font-bold text-xl mx-auto mb-4">
            סנ
          </div>
          <h1 className="font-rubik font-black text-3xl text-gray-900 mb-2">כניסת חברים</h1>
          <p className="text-gray-500 text-sm">
            אין לך חשבון?{" "}
            <Link href="/register" className="text-green-dark font-semibold hover:underline">
              הצטרפות לעמותה
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {userStatus === "pending" && (
            <div className="mb-6 p-5 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
              <Clock size={20} className="text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-700 mb-1">החשבון ממתין לאישור</p>
                <p className="text-sm text-yellow-600">
                  בקשתך להצטרפות נמצאת בתהליך בדיקה. נחזור אליך בהקדם.
                </p>
              </div>
            </div>
          )}

          {userStatus === "rejected" && (
            <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700 mb-1">הבקשה נדחתה</p>
                <p className="text-sm text-red-600">
                  לפרטים נוספים, אנא{" "}
                  <Link href="/contact" className="font-medium underline">צור קשר</Link>{" "}
                  עם צוות העמותה.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                אימייל
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">סיסמה</label>
                <Link href="/forgot-password" className="text-xs text-green-dark hover:underline">
                  שכחת סיסמה?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark pl-10"
                  placeholder="הסיסמה שלך"
                  autoComplete="current-password"
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
                  מתחבר...
                </>
              ) : (
                "כניסה לחשבון"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
