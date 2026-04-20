"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle, Send } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "שגיאה בשליחה");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError((err as Error).message || "שגיאה בשליחה. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        title="צור קשר"
        subtitle="נשמח לשמוע מכם — בכל עניין"
      />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <SectionTitle title="שלח הודעה" centered={false} />
              {submitted ? (
                <div className="bg-green-pale rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 bg-green-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={28} className="text-white" />
                  </div>
                  <h3 className="font-rubik font-bold text-2xl text-green-dark mb-2">ההודעה נשלחה!</h3>
                  <p className="text-gray-600">נחזור אליך בהקדם האפשרי.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-green-dark font-medium hover:underline"
                  >
                    שלח הודעה נוספת
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        שם מלא <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark transition-colors"
                        placeholder="ישראל ישראלי"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        אימייל <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark transition-colors"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                      נושא <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark transition-colors"
                      placeholder="נושא הפנייה"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      הודעה <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark transition-colors resize-none"
                      placeholder="כתוב את הודעתך כאן..."
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-dark text-white py-4 rounded-lg font-bold text-base hover:bg-green-mid transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        שולח...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        שלח הודעה
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <SectionTitle title="פרטי התקשרות" centered={false} />
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4 p-5 bg-gray-light rounded-xl">
                  <div className="w-11 h-11 bg-green-dark rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-rubik font-bold text-gray-900 mb-1">כתובת</div>
                    <p className="text-gray-600 text-sm">רחוב הרצל 1, תל אביב</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-gray-light rounded-xl">
                  <div className="w-11 h-11 bg-green-dark rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-rubik font-bold text-gray-900 mb-1">טלפון</div>
                    <a href="tel:03-XXXXXXX" className="text-green-dark font-medium text-sm hover:underline">
                      03-XXXXXXX
                    </a>
                    <p className="text-gray-400 text-xs mt-0.5">ימים א׳–ה׳, 9:00–17:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-gray-light rounded-xl">
                  <div className="w-11 h-11 bg-green-dark rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-rubik font-bold text-gray-900 mb-1">אימייל</div>
                    <a href="mailto:info@sayeret-nachal.org.il" className="text-green-dark font-medium text-sm hover:underline">
                      info@sayeret-nachal.org.il
                    </a>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="mb-8">
                <h3 className="font-rubik font-bold text-gray-900 mb-4">עקבו אחרינו</h3>
                <div className="flex gap-3">
                  {[
                    { Icon: Facebook, label: "פייסבוק", color: "bg-blue-600" },
                    { Icon: Instagram, label: "אינסטגרם", color: "bg-pink-500" },
                    { Icon: MessageCircle, label: "וואטסאפ", color: "bg-green-500" },
                  ].map(({ Icon, label, color }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-sm`}
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl overflow-hidden bg-gray-200 h-52 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2 opacity-40" />
                  מפה תוצג כאן (Google Maps)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
