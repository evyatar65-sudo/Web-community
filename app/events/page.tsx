"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import EventCard from "@/components/ui/EventCard";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "טקס יום הזיכרון השנתי",
    date: "2025-05-05T18:00:00",
    location: "הר הרצל, ירושלים",
    description: "טקס זיכרון חגיגי לנופלי סיירת נח\"ל. נוכחות המשפחות מבורכת.",
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "מפגש בוגרים — מרכז",
    date: "2025-05-20T19:30:00",
    location: "רמת גן",
    description: "ערב בוגרים עם נאומים, הצגת פרויקטים חדשים ופגישות בין הדורות.",
    is_public: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "ריצת בוגרים — תל אביב",
    date: "2025-06-01T07:00:00",
    location: "נמל תל אביב",
    description: "ריצה קבוצתית של 10 ק\"מ לכבוד יום ייסוד הסיירת.",
    is_public: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "גיבוש קיץ שנתי",
    date: "2025-07-10T08:00:00",
    location: "כינרת",
    description: "סוף שבוע גיבוש לכל בוגרי הסיירת עם פעילויות ים, שיחות ובישולים.",
    is_public: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "ניהול ואסטרטגיה — כנס מקצועי",
    date: "2025-08-05T09:00:00",
    location: "תל אביב",
    description: "כנס מקצועי לבוגרים בתחום הניהול והעסקים.",
    is_public: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "past1",
    title: "ערב חנוכה הבוגרים",
    date: "2024-12-15T19:00:00",
    location: "ירושלים",
    description: "ערב חנוכה חגיגי עם הדלקת נרות ומפגש משפחות.",
    is_public: false,
    created_at: new Date().toISOString(),
  },
];

function EventsContent() {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (data && data.length > 0) setEvents(data);
    }
    load();
  }, []);

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  return (
    <>
      <PageHero
        title="לוח אירועים"
        subtitle="כל האירועים, הכנסים והמפגשים של עמותת הבוגרים"
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Upcoming */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-rubik font-bold text-2xl text-gray-900 flex items-center gap-2">
                <Calendar size={24} className="text-green-mid" />
                אירועים קרובים
              </h2>
              <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {upcoming.length} אירועים
              </span>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-16 bg-gray-light rounded-2xl">
                <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">אין אירועים קרובים</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} showRsvp />
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 className="font-rubik font-bold text-2xl text-gray-900 flex items-center gap-2 mb-8">
                <Calendar size={24} className="text-gray-400" />
                אירועים שעברו
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-70">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function EventsPage() {
  return (
    <PrivateRoute>
      <EventsContent />
    </PrivateRoute>
  );
}
