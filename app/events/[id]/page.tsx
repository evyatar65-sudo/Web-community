"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, CheckCircle, Clock } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

const MOCK_EVENTS: Record<string, Event & { rsvp_count?: number }> = {
  "1": {
    id: "1",
    title: "טקס יום הזיכרון השנתי",
    date: "2025-05-05T18:00:00",
    location: "הר הרצל, ירושלים",
    description: `טקס הזיכרון השנתי לנופלי סיירת נח"ל נערך מדי שנה לציון זכרם של חיילינו שנפלו בשירות המדינה.

הטקס יכלול הדלקת נרות, קריאת שמות הנופלים, נאומים מרגשים ומוזיקה חיה.
כניסה חופשית לכלל הציבור. ההורים, בני המשפחה וחברים — כולם מוזמנים.`,
    is_public: true,
    created_at: new Date().toISOString(),
    rsvp_count: 87,
  },
  "2": {
    id: "2",
    title: "מפגש בוגרים — מרכז",
    date: "2025-05-20T19:30:00",
    location: "רמת גן",
    description: `ערב בוגרים מיוחד לחברי העמותה המאושרים.

הערב יכלול:
- נאומים ועדכוני העמותה
- הצגת פרויקטים חדשים לשנה הקרובה
- פגישת חברים בין הדורות
- כיבוד קל

לחברי העמותה המאושרים בלבד.`,
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 43,
  },
  "3": {
    id: "3",
    title: "ריצת בוגרים — תל אביב",
    date: "2025-06-01T07:00:00",
    location: "נמל תל אביב",
    description: `ריצה קבוצתית של 10 ק"מ לכבוד יום ייסוד הסיירת.

נתכנס בנמל תל אביב בשעה 6:45 לחימום, הריצה תצא ב-7:00 בדיוק.
המסלול: נמל ת"א → ירקון → חזרה.
לאחר הריצה: ארוחת בוקר קלה יחד.`,
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 22,
  },
  "4": {
    id: "4",
    title: "גיבוש קיץ שנתי",
    date: "2025-07-10T08:00:00",
    location: "כינרת",
    description: `סוף שבוע גיבוש שנתי לכל בוגרי הסיירת ומשפחותיהם.

התוכנית:
יום שישי: הגעה, ארוחת ערב משותפת, שיחות חברים
שבת: פעילות ים, ספורט, בישול יחד, ערב מדורה

הרישום כולל אוכל ולינה. ילדים עד גיל 5 חינם.`,
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 61,
  },
};

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    time: date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    day: date.getDate(),
    month: date.toLocaleDateString("he-IL", { month: "short" }),
    isPast: date < new Date(),
  };
}

function EventDetailContent() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<(Event & { rsvp_count?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRsvp, setHasRsvp] = useState(false);
  const [rsvping, setRsvping] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const id = params.id as string;

      // Try Supabase first, fall back to mock
      const { data: dbEvent } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      const eventData = dbEvent || MOCK_EVENTS[id] || null;
      if (!eventData) {
        router.replace("/events");
        return;
      }

      setEvent(eventData);

      // Load real RSVP count and user's own RSVP in parallel
      const [{ count: rsvpTotal }, { data: { user } }] = await Promise.all([
        supabase.from("rsvps").select("*", { count: "exact", head: true }).eq("event_id", id),
        supabase.auth.getUser(),
      ]);
      setRsvpCount(rsvpTotal ?? (eventData as Event & { rsvp_count?: number }).rsvp_count ?? 0);

      if (user) {
        const { data: rsvp } = await supabase
          .from("rsvps")
          .select("id")
          .eq("event_id", id)
          .eq("user_id", user.id)
          .single();
        setHasRsvp(!!rsvp);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleRsvp() {
    setRsvping(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (hasRsvp) {
        await supabase.from("rsvps").delete().eq("event_id", event!.id).eq("user_id", user.id);
        setHasRsvp(false);
        setRsvpCount((c) => c - 1);
      } else {
        await supabase.from("rsvps").insert({ event_id: event!.id, user_id: user.id });
        setHasRsvp(true);
        setRsvpCount((c) => c + 1);
      }
    } finally {
      setRsvping(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "64px" }}>
        <div className="w-10 h-10 border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  const dt = formatDateTime(event.date);

  return (
    <div className="min-h-screen bg-gray-light" style={{ paddingTop: "64px" }}>
      {/* Hero */}
      <div style={{ backgroundColor: "#1a2e1a" }} className="hero-texture py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/events" className="inline-flex items-center gap-1 text-gray-400 hover:text-green-light text-sm mb-6 transition-colors">
            <ArrowRight size={14} />
            חזרה לכל האירועים
          </Link>
          <div className="flex items-start gap-6">
            <div className="shrink-0 bg-green-dark border-2 border-green-mid rounded-2xl p-4 text-center min-w-[80px]">
              <div className="text-4xl font-rubik font-black text-white leading-none">{dt.day}</div>
              <div className="text-green-light text-sm font-medium mt-1">{dt.month}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                {!event.is_public && (
                  <span className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-full">חברים בלבד</span>
                )}
                {dt.isPast && (
                  <span className="text-xs bg-white/10 text-gray-400 px-2.5 py-1 rounded-full">אירוע שעבר</span>
                )}
              </div>
              <h1 className="font-rubik font-black text-3xl sm:text-4xl text-white mb-3">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-green-light" />
                  {dt.date} | {dt.time}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-green-light" />
                    {event.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-green-light" />
                  {rsvpCount} אישרו הגעה
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Description */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
              <h2 className="font-rubik font-bold text-xl text-gray-900 mb-4">פרטי האירוע</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
                {event.description}
              </div>
            </div>

            {/* Location card */}
            {event.location && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-rubik font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-green-mid" />
                  מיקום
                </h2>
                <p className="text-gray-700 mb-3">{event.location}</p>
                <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                  <div className="text-center">
                    <MapPin size={28} className="mx-auto mb-2 opacity-30" />
                    מפה תוצג כאן
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RSVP sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-5">
                <div className="text-3xl font-rubik font-black text-green-dark mb-0.5">{rsvpCount}</div>
                <div className="text-sm text-gray-400">אישרו הגעה</div>
              </div>

              {!dt.isPast ? (
                <>
                  {hasRsvp ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-green-dark bg-green-pale rounded-xl p-3 text-sm font-medium justify-center mb-3">
                        <CheckCircle size={16} />
                        אישרתי הגעה
                      </div>
                      <button
                        onClick={handleRsvp}
                        disabled={rsvping}
                        className="w-full border border-gray-200 text-gray-500 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        ביטול אישור הגעה
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRsvp}
                      disabled={rsvping}
                      className="w-full bg-green-dark text-white py-4 rounded-xl font-rubik font-bold text-base hover:bg-green-mid transition-colors disabled:opacity-60 mb-3 flex items-center justify-center gap-2"
                    >
                      {rsvping ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Users size={18} />
                          אישור הגעה
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 bg-gray-50 rounded-xl p-3 text-sm justify-center">
                  <Clock size={14} />
                  האירוע הסתיים
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mt-4 space-y-3 text-sm text-gray-500">
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>{dt.date}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>{dt.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <PrivateRoute>
      <EventDetailContent />
    </PrivateRoute>
  );
}
