import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  showRsvp?: boolean;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

export default function EventCard({ event, showRsvp = false }: EventCardProps) {
  const isPast = new Date(event.date) < new Date();

  return (
    <div className={`card border-r-4 ${isPast ? "border-r-gray-300" : "border-r-green-dark"} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {!isPast && (
              <span className="text-xs bg-green-pale text-green-dark font-medium px-2 py-0.5 rounded-full">
                קרוב
              </span>
            )}
            {!event.is_public && (
              <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                חברים בלבד
              </span>
            )}
          </div>
          <h3 className="font-rubik font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
          {event.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
          )}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} className="text-green-mid shrink-0" />
              <span>{formatDate(event.date)} | {formatTime(event.date)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={14} className="text-green-mid shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 text-center">
          <div className="bg-green-darkest text-white rounded-lg p-2 min-w-[52px]" style={{ backgroundColor: "#1a2e1a" }}>
            <div className="text-xl font-bold font-rubik">
              {new Date(event.date).getDate()}
            </div>
            <div className="text-xs text-green-light">
              {new Date(event.date).toLocaleDateString("he-IL", { month: "short" })}
            </div>
          </div>
        </div>
      </div>
      {showRsvp && !isPast && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-2 bg-green-dark text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-mid transition-colors"
          >
            <Users size={14} />
            אישור הגעה
          </Link>
        </div>
      )}
    </div>
  );
}
