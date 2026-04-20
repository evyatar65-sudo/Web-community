"use client";

import { useState } from "react";
import { Heart, Shield, Users, Star, CheckCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";

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

  const amount = custom ? Number(custom) : selected;

  function handleDonate() {
    // Placeholder: redirect to PayBox / Stripe
    alert(`בקרוב: ניתוב לדף תשלום — ₪${amount}${recurring ? " חודשי" : ""}`);
  }

  return (
    <>
      <PageHero
        title="תרומה לעמותה"
        subtitle="תרומתך משנה חיים ומחזקת קהילה"
      />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Donation Form */}
            <div>
              <SectionTitle title="בחר סכום לתרומה" centered={false} />

              {/* Recurring toggle */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setRecurring(false)}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    !recurring
                      ? "border-green-dark bg-green-dark text-white"
                      : "border-gray-200 text-gray-600 hover:border-green-light"
                  }`}
                >
                  תרומה חד פעמית
                </button>
                <button
                  onClick={() => setRecurring(true)}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    recurring
                      ? "border-green-dark bg-green-dark text-white"
                      : "border-gray-200 text-gray-600 hover:border-green-light"
                  }`}
                >
                  תרומה חודשית
                </button>
              </div>

              {/* Preset amounts */}
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
                    className={`w-full py-4 pr-8 pl-3 rounded-xl text-base font-medium border-2 transition-colors text-center ${
                      custom
                        ? "border-green-dark text-green-dark"
                        : "border-gray-200 text-gray-500 hover:border-green-mid"
                    } focus:outline-none focus:border-green-dark`}
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

              <button
                onClick={handleDonate}
                disabled={!amount || amount <= 0}
                className="w-full bg-gold text-white py-4 rounded-xl text-lg font-rubik font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <Heart size={20} />
                תרום עכשיו{amount && amount > 0 ? ` ₪${amount}` : ""}
                {recurring ? " בחודש" : ""}
              </button>

              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-mid" />
                  תשלום מאובטח
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-mid" />
                  קבלה מוכרת לצרכי מס
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-mid" />
                  ניתן לביטול בכל עת
                </div>
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

              {/* Goal progress */}
              <div className="bg-gray-light rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-rubik font-bold text-gray-900">יעד גיוס שנתי</span>
                  <span className="text-green-dark font-bold">₪180,000 / ₪300,000</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-mid rounded-full"
                    style={{ width: "60%" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">60% הושג — עזרו לנו להגיע ל-100%</p>
              </div>

              <div className="mt-6 p-4 border border-gold/30 rounded-xl bg-gold/5">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold text-gold">פטור ממס:</span> העמותה מוכרת לצרכי מס
                  עפ&quot;י סעיף 46 לפקודת מס הכנסה. תקבלו קבלה מוכרת לניכוי מס לכל תרומה.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
