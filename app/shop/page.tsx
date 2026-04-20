"use client";

import { useState } from "react";
import { ShoppingBag, Bell, CheckCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export default function ShopPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubscribed(true);
  }

  return (
    <>
      <PageHero
        title="חנות העמותה"
        subtitle="מוצרי מותג ומזכרות בוגרים"
      />

      <section className="section-padding bg-white min-h-[60vh] flex items-center">
        <div className="container-max w-full">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={44} className="text-green-dark" />
            </div>
            <h2 className="font-rubik font-black text-4xl text-gray-900 mb-4">
              החנות בקרוב
            </h2>
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
              <form onSubmit={handleSubscribe} className="flex gap-3 max-w-sm mx-auto">
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
                  className="flex items-center gap-2 bg-green-dark text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-mid transition-colors text-sm whitespace-nowrap"
                >
                  <Bell size={15} />
                  עדכנו אותי
                </button>
              </form>
            )}

            {/* Preview items */}
            <div className="mt-16">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-6 font-medium">
                מה יהיה בחנות
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["חולצות וטישרטים", "כובעים ומצחיות", "מדבקות ותגים", "ציוד שטח"].map((item) => (
                  <div key={item} className="bg-gray-light rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2" />
                    <p className="text-xs text-gray-500">{item}</p>
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
