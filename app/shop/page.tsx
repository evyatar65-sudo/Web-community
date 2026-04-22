"use client";

import { useState } from "react";
import { ShoppingBag, Bell, CheckCircle, Shirt, HardHat, Tag, Package } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";

const previewItems = [
  { label: "חולצות וטישרטים", Icon: Shirt },
  { label: "כובעים ומצחיות", Icon: HardHat },
  { label: "מדבקות ותגים", Icon: Tag },
  { label: "ציוד שטח", Icon: Package },
];

export default function ShopPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });
      if (dbError && dbError.code !== "23505") throw dbError;
      setSubscribed(true);
    } catch {
      setError("אירעה שגיאה. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero title="חנות העמותה" subtitle="מוצרי מותג ומזכרות בוגרים" />

      <section className="section-padding bg-white min-h-[60vh] flex items-center">
        <div className="container-max w-full">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={44} className="text-green-dark" />
            </div>
            <h2 className="font-rubik font-black text-4xl text-gray-900 mb-4">החנות בקרוב</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              אנו עובדים על חנות העמותה שתציע מוצרים, ביגוד ומזכרות לבוגרי הסיירת ולתומכיה.
              הירשמו לקבלת עדכון כשהחנות תיפתח.
            </p>

            {subscribed ? (
              <div className="bg-green-pale rounded-2xl p-8 text-center">
                <CheckCircle size={40} className="text-green-dark mx-auto mb-3" />
                <h3 className="font-rubik font-bold text-xl text-green-dark mb-2">נרשמתם בהצלחה!</h3>
                <p className="text-gray-600 text-sm">נעדכן אותך כשהחנות תיפתח.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3 max-w-sm mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="האימייל שלך"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-dark text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-mid transition-colors text-sm whitespace-nowrap disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Bell size={15} />
                    )}
                    עדכנו אותי
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </form>
            )}

            <div className="mt-16">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-6 font-medium">מה יהיה בחנות</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previewItems.map(({ label, Icon }) => (
                  <div key={label} className="bg-gray-light rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center shadow-sm">
                      <Icon size={20} className="text-green-dark" />
                    </div>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
