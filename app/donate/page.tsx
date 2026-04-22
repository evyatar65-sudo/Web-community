"use client";

import { useState } from "react";
import { Heart, Shield, Users, Star, CheckCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { createClient } from "@/lib/supabase/client";

const presetAmounts = [50, 100, 250, 500, 1000];

const uses = [
  { icon: Heart, text: "ליווי ותמיכה בפצועים ונכים" },
  { icon: Users, text: "תמיכה במשפחות הנופלים" },
  { icon: Shield, text: "חיזוק הסיירת הפעילה" },
  { icon: Star, text: "פעילות קהילתית ואירועים" },
];

export default function DonatePage() {
  const [selected, setSelected] = useState<number | null>(100);
  const [custom, setCustom] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donated, setDonated] = useState(false);
  const [error, setError] = useState("");

  const amount = custom ? Number(custom) : selected;

  async function handleDonate() {
    if (!amount || amount <= 0) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error: insertError } = await supabase.from("donations").insert({
        user_id: user?.id ?? null,
        amount,
        is_recurring: recurring,
        status: "pending",
      });
      if (insertError) throw insertError;
      setDonated(true);
    } catch {
      setError("אירעה שגיאה. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  }

  if (donated) {
    return (
      <>
        <PageHero title="תרומה לעמותה" subtitle="תרומתך משנה חיים ומחזקת קהילה" />
        <section className="section-padding bg-white min-h-[60vh] flex items-center">
          <div className="container-max w-full">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-24 h-24 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={48} className="text-green-dark" />
              </div>
              <h2 className="font-rubik font-black text-4xl text-gray-900 mb-4">
                תודה רבה! 💚
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                קיבלנו את בקשת התרומה שלך על סך{" "}
                <span className="font-bold text-green-dark">₪{amount}</span>
                {recurring ? " לחודש" : ""}.
              </p>
              <p className="text-gray-500 mb-8">
                נציג מהעמותה יצור איתך קשר בקרוב להשלמת התהליך ולשליחת קבלה מוכרת לצרכי מס.
              </p>
              <div className="bg-green-pale rounded-2xl p-6 text-right space-y-2 text-sm text-gray-700 mb-8">
                <p><span className="font-semibold">סכום: </span>₪{amount}{recurring ? " לחודש" : ""}</p>
                <p><span className="font-semibold">סוג תרומה: </span>{recurring ? "חודשית" : "חד פעמית"}</p>
                <p><span className="font-semibold">מספר אסמכתא: </span>
                  <span className="font-mono">{Date.now().toString(36).toUpperCase()}</span>
                </p>
              </div>
              <button
                onClick={() => { setDonated(false); setSelected(100); setCustom(""); setRecurring(false); }}
                className="text-green-dark font-semibold hover:underline"
              >
                בצע תרומה נוספת
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero title="תרומה לעמותה" subtitle="תרומתך משנה חיים ומחזקת קהילה" />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Donation Form */}
            <div>
              <SectionTitle title="בחר סכום לתרומה" centered={false} />

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setRecurring(false)}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    !recurring ? "border-green-dark bg-green-dark text-white" : "border-gray-200 text-gray-600 hover:border-green-light"
                  }`}
                >
                  תרומה חד פעמית
                </button>
                <button
                  onClick={() => setRecurring(true)}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    recurring ? "border-green-dark bg-green-dark text-white" : "border-gray-200 text-gray-600 hover:border-green-light"
                  }`}
                >
                  תרומה חודשית
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setSelected(amt); setCustom(""); }}
                    className={`py-4 rounded-xl text-lg font-rubik font-bold border-2 transition-colors ${
                      selected === amt && !custom
                        ? "border-green-dark bg-green-dark text-white shadow-lg"
                        : "border-gray-200 text-gray-700 hover:border-green-mid hover:text-green-dark"
                    }`}
                  >
                    ₪{amt}
                  </button>
                ))}
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₪</span>
                  <input
                    type="number"
                    placeholder="סכום אחר"
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                    className={`w-full py-4 pr-8 pl-3 rounded-xl text-base font-medium border-2 transition-colors text-center focus:outline-none focus:border-green-dark ${
                      custom ? "border-green-dark text-green-dark" : "border-gray-200 text-gray-500 hover:border-green-mid"
                    }`}
                    min="1"
                  />
                </div>
              </div>

              {amount && amount > 0 && (
                <div className="bg-green-pale rounded-xl p-4 mb-6">
                  <p className="text-green-dark font-semibold text-center">
                    סכום שנבחר: <span className="text-xl font-rubik font-bold">₪{amount}</span>
                    {recurring && " לחודש"}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>
              )}

              <button
                onClick={handleDonate}
                disabled={!amount || amount <= 0 || loading}
                className="w-full bg-gold text-white py-4 rounded-xl text-lg font-rubik font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Heart size={20} />
                    תרום עכשיו{amount && amount > 0 ? ` ₪${amount}` : ""}
                    {recurring ? " בחודש" : ""}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-400">
                {["תשלום מאובטח", "קבלה מוכרת לצרכי מס", "ניתן לביטול בכל עת"].map((t) => (
                  <div key={t} className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-mid" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <SectionTitle title="לאן הולכים הכספים?" centered={false} />
              <div className="space-y-4 mb-8">
                {uses.map((use) => {
                  const Icon = use.icon;
                  return (
                    <div key={use.text} className="flex items-center gap-4 p-4 bg-green-pale rounded-xl">
                      <div className="w-10 h-10 bg-green-dark rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-white" />
                      </div>
                      <p className="text-gray-700 font-medium">{use.text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-light rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-rubik font-bold text-gray-900">יעד גיוס שנתי</span>
                  <span className="text-green-dark font-bold">₪180,000 / ₪300,000</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-mid rounded-full" style={{ width: "60%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">60% הושג — עזרו לנו להגיע ל-100%</p>
              </div>

              <div className="mt-6 p-4 border border-gold/30 rounded-xl bg-gold/5">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold text-gold">פטור ממס: </span>
                  העמותה מוכרת לצרכי מס עפ&quot;י סעיף 46 לפקודת מס הכנסה.
                  תקבלו קבלה מוכרת לניכוי מס לכל תרומה.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
