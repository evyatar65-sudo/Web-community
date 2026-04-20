"use client";

import { useEffect, useState } from "react";
import { Calendar, Users } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import EventCard from "@/components/ui/EventCard";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

type EventWithCount = Event & { rsvp_count: number };

const MOCK_EVENTS: EventWithCount[] = [
  {
    id: "1",
    title: "טקס יום הזיכרון השנתי",
    date: "2026-05-05T18:00:00",
    location: "הר הרצל, ירושלים",
    description: "טקס זיכרון חגיגי לנופלי סיירת נח\"ל. נוכחות המשפחות מבורכת.",
    is_public: true,
    created_at: new Date().toISOString(),
    rsvp_count: 87,
  },
  {
    id: "2",
    title: "מפגש בוגרים — מרכז",
    date: "2026-05-20T19:30:00",
    location: "רמת גן",
    description: "ערב בוגרים עם נאומים, הצגת פרויקטים חדשים ופגישות בין הדורות.",
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 43,
  },
  {
    id: "3",
    title: "ריצת בוגרים — תל אביב",
    date: "2026-06-01T07:00:00",
    location: "נמל תל אביב",
    description: "ריצה קבוצתית של 10 ק\"מ לכבוד יום ייסוד הסיירת.",
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 22,
  },
  {
    id: "4",
    title: "גיבוש קיץ שנתי",
    date: "2026-07-10T08:00:00",
    location: "כינרת",
    description: "סוף שבוע גיבוש לכל בוגרי הסיירת עם פעילויות ים, שיחות ובישולים.",
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 61,
  },
  {
    id: "5",
    title: "ניהול ואסטרטגיה — כנס מקצועי",
    date: "2026-08-05T09:00:00",
    location: "תל אביב",
    description: "כנס מקצועי לבוגרים בתחום הניהול והעסקים.",
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 15,
  },
  {
    id: "past1",
    title: "ערב חנוכה הבוגרים",
    date: "2024-12-15T19:00:00",
    location: "ירושלים",
    description: "ערב חנוכה חגיגי עם הדלקת נרות ומפגש משפחות.",
    is_public: false,
    created_at: new Date().toISOString(),
    rsvp_count: 68,
  },
];

function EventCardSkeleton() {
  return (
    <div className="card border-r-4 border-r-gray-200 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-100 rounded mb-1" />
          <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />
          <div className="flex gap-4">
            <div className="h-3 w-40 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="w-14 h-14 bg-gray-200 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

function EventsContent() {
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("events")
          .select("*, rsvps(count)")
          .order("date", { ascending: true });

        if (data && data.length > 0) {
          setEvents(
            data.map((e) => ({
              ...e,
              rsvp_count: Array.isArray(e.rsvps) ? e.rsvps[0]?.count ?? 0 : 0,
            }))
          );
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch {
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
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
              {!loading && (
                <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {upcoming.length} אירועים
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-16 bg-gray-light rounded-2xl">
                <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">אין אירועים קרובים</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} showRsvp rsvpCount={event.rsvp_count} />
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          {!loading && past.length > 0 && (
            <div>
              <h2 className="font-rubik font-bold text-2xl text-gray-900 flex items-center gap-2 mb-8">
                <Calendar size={24} className="text-gray-400" />
                אירועים שעברו
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-70">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} rsvpCount={event.rsvp_count} />
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
