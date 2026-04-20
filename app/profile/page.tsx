"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Camera, AlertCircle, CheckCircle, Lock } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

function ProfileContent() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [changingPw, setChangingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("לא מחובר");
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          current_city: profile.current_city,
          profession: profile.profession,
          service_years: profile.service_years,
          role_in_unit: profile.role_in_unit,
          show_in_directory: profile.show_in_directory,
        })
        .eq("id", user.id);
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError((err as Error).message || "שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const ext = file.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("uploads").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
      setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    } catch {
      setError("שגיאה בהעלאת תמונה");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.newPw !== passwords.confirm) {
      setPwError("הסיסמאות אינן תואמות");
      return;
    }
    if (passwords.newPw.length < 8) {
      setPwError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    setChangingPw(true);
    setPwError("");
    setPwSuccess(false);
    try {
      const { error: pwErr } = await supabase.auth.updateUser({ password: passwords.newPw });
      if (pwErr) throw pwErr;
      setPwSuccess(true);
      setPasswords({ current: "", newPw: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: unknown) {
      setPwError((err as Error).message || "שגיאה בשינוי סיסמה");
    } finally {
      setChangingPw(false);
    }
  }

  function set(field: keyof Profile, value: unknown) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "64px" }}>
        <div className="w-10 h-10 border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHero title="הפרופיל שלי" subtitle="עדכן את פרטיך ואפשרויות הפרטיות שלך" />

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-green-pale flex items-center justify-center text-green-dark font-rubik font-bold text-3xl overflow-hidden">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name?.[0] || "מ"
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute bottom-0 left-0 w-8 h-8 bg-green-dark rounded-full flex items-center justify-center text-white hover:bg-green-mid transition-colors disabled:opacity-60"
                  aria-label="שנה תמונה"
                >
                  {avatarUploading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={14} />
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <h3 className="font-rubik font-bold text-xl text-gray-900">{profile.full_name}</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {profile.status === "approved" ? "חבר מאושר" : "ממתין לאישור"}
                </p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-rubik font-bold text-lg text-gray-900 mb-5">פרטים אישיים</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">שם מלא</label>
                  <input
                    type="text"
                    value={profile.full_name || ""}
                    onChange={(e) => set("full_name", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">טלפון</label>
                  <input
                    type="tel"
                    value={profile.phone || ""}
                    onChange={(e) => set("phone", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                    placeholder="05X-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">עיר מגורים</label>
                  <input
                    type="text"
                    value={profile.current_city || ""}
                    onChange={(e) => set("current_city", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                    placeholder="תל אביב"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">עיסוק נוכחי</label>
                  <input
                    type="text"
                    value={profile.profession || ""}
                    onChange={(e) => set("profession", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                    placeholder="מהנדס / יזם / ..."
                  />
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-rubik font-bold text-lg text-gray-900 mb-5">פרטי שירות</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">שנות שירות</label>
                  <input
                    type="text"
                    value={profile.service_years || ""}
                    onChange={(e) => set("service_years", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                    placeholder="2015–2018"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">תפקיד ביחידה</label>
                  <input
                    type="text"
                    value={profile.role_in_unit || ""}
                    onChange={(e) => set("role_in_unit", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                    placeholder='לוחם / מ"כ / ...'
                  />
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-rubik font-bold text-lg text-gray-900 mb-5">הגדרות פרטיות</h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="directory"
                  checked={profile.show_in_directory ?? true}
                  onChange={(e) => set("show_in_directory", e.target.checked)}
                  className="w-4 h-4 accent-green-dark"
                />
                <label htmlFor="directory" className="text-sm text-gray-700 cursor-pointer">
                  הצג את הפרופיל שלי במאגר הבוגרים (גלוי לחברים מאושרים בלבד)
                </label>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-rubik font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <Lock size={18} className="text-gray-600" />
                שינוי סיסמה
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סיסמה חדשה</label>
                    <input
                      type="password"
                      value={passwords.newPw}
                      onChange={(e) => setPasswords((p) => ({ ...p, newPw: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                      placeholder="לפחות 8 תווים"
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">אימות סיסמה</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                      placeholder="חזור על הסיסמה"
                    />
                  </div>
                </div>
                {pwError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
                    <AlertCircle size={15} className="shrink-0" />
                    {pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div className="flex items-center gap-2 text-green-dark bg-green-pale rounded-lg p-3 text-sm">
                    <CheckCircle size={15} className="shrink-0" />
                    הסיסמה שונתה בהצלחה
                  </div>
                )}
                <button
                  type="submit"
                  disabled={changingPw || !passwords.newPw || !passwords.confirm}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {changingPw ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}
                  שנה סיסמה
                </button>
              </form>
            </div>

            {/* Messages */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-dark bg-green-pale rounded-lg p-3 text-sm">
                <CheckCircle size={16} className="shrink-0" />
                הפרטים נשמרו בהצלחה
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center gap-2 bg-green-dark text-white px-8 py-4 rounded-lg font-rubik font-bold hover:bg-green-mid transition-colors disabled:opacity-60"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              שמור שינויים
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}
