"use client";

import { useEffect, useState } from "react";
import { Flame, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { createClient } from "@/lib/supabase/client";
import type { Fallen } from "@/lib/types";

const MOCK_FALLEN: Fallen[] = [
  { id: "1", name: "יונתן לוי", role: 'לוחם, מ"כ', year: 2006, bio: "יונתן נפל בשירות המדינה במהלך מלחמת לבנון השנייה. היה לוחם מסור וחבר לכולם.", created_at: "" },
  { id: "2", name: "אלי ברק", role: "לוחם", year: 2009, bio: "אלי שירת בסיירת ונהרג במהלך פעילות מבצעית. זכרו חי בלב חבריו.", created_at: "" },
  { id: "3", name: "נועם שחר", role: 'מ"כ בכיר', year: 2014, bio: "נועם נפל בחופה המערבית. היה מפקד דוגמא ואדם בעל ערכים עמוקים.", created_at: "" },
  { id: "4", name: "תומר כהן", role: "לוחם", year: 2023, bio: 'תומר נפל בחרבות ברזל ז"ל. בן 22 בלבד, חייל מסור ואדם יוצא מן הכלל.', created_at: "" },
  { id: "5", name: "דניאל אביב", role: 'לוחם, מ"כ', year: 2023, bio: "דניאל נפל בלחימה בדרום הארץ. היה גיבור שקט שאהב את חבריו ללחימה.", created_at: "" },
  { id: "6", name: "אריאל שלום", role: "לוחם", year: 2024, bio: "אריאל היה צעיר מוכשר עם עתיד מבהיק. נפל בשירות המולדת בשנת 2024.", created_at: "" },
];

const timeline = [
  { year: "1948", event: 'הקמת חטיבת הנח"ל ותחילת פעילות הסיירת' },
  { year: "1967", event: "השתתפות במלחמת ששת הימים — כיבוש יהודה ושומרון" },
  { year: "1973", event: "לחימה קשה במלחמת יום הכיפורים" },
  { year: "1982", event: "מלחמת לבנון הראשונה — פעילות עצימה בצפון" },
  { year: "2000", event: "נסיגה מלבנון — הסיירת בין האחרונות לצאת" },
  { year: "2006", event: "מלחמת לבנון השנייה — לחימה בשכם ובדרום לבנון" },
  { year: "2014", event: "מבצע צוק איתן — לחימה בעזה" },
  { year: "2023", event: "מלחמת חרבות ברזל — הסיירת בחוד החנית" },
];

function FallenAvatar({ person }: { person: Fallen }) {
  const initials = person.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  if (person.photo_url) {
    return (
      <Image
        src={person.photo_url}
        alt={person.name}
        width={64}
        height={64}
        className="rounded-full object-cover w-16 h-16 grayscale"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
      <span className="font-rubik font-bold text-gold text-lg">{initials}</span>
    </div>
  );
}

function FallenSkeleton() {
  return (
    <div className="bg-white border border-gold/20 rounded-xl p-6 border-r-4 border-r-gold/40 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 pt-1 space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-3.5 w-20 bg-gray-100 rounded" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-4/5 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export default function MemorialPage() {
  const [fallen, setFallen] = useState<Fallen[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("fallen")
          .select("*")
          .order("year", { ascending: true });
        setFallen(data && data.length > 0 ? data : MOCK_FALLEN);
      } catch {
        setFallen(MOCK_FALLEN);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PageHero
        title="הנצחה ומורשת"
        subtitle="זוכרים כל אחד. שומרים על הלהבה."
        gold
      />

      {/* Fallen */}
      <section className="section-padding bg-white" id="fallen">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Flame size={40} className="text-gold" />
            </div>
            <h2 className="font-rubik font-bold text-4xl text-gray-900 mb-3">
              נופלי סיירת נח&quot;ל
            </h2>
            <div className="h-1 w-16 rounded-full bg-gold mx-auto mb-4" />
            <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
              לזכרם של הגיבורים שנפלו בשירות המדינה. זכרם יהיה ברוך לעד.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <FallenSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallen.map((person) => (
                <div
                  key={person.id}
                  className="bg-white border border-gold/20 rounded-xl p-6 hover:shadow-lg transition-shadow border-r-4 border-r-gold"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <FallenAvatar person={person} />
                    <div>
                      <h3 className="font-rubik font-bold text-xl text-gray-900">{person.name}</h3>
                      {person.role && <p className="text-gold font-medium text-sm">{person.role}</p>}
                      <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        נפל: {person.year}
                      </p>
                    </div>
                  </div>
                  {person.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed">{person.bio}</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-gold/10">
                    <span className="text-xs text-gold font-medium">יהי זכרו ברוך</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Historical Timeline */}
      <section className="section-padding bg-green-darkest" id="archive" style={{ backgroundColor: "#1a2e1a" }}>
        <div className="container-max">
          <SectionTitle
            title="מורשת ותולדות הסיירת"
            subtitle={'ציוני דרך מרכזיים בתולדות סיירת נח"ל'}
            light
          />

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute top-0 bottom-0 right-8 w-px bg-green-mid/40 hidden sm:block" />

            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.year} className="flex items-start gap-6 sm:gap-10">
                  <div className="shrink-0 relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-green-dark border-2 border-green-mid flex items-center justify-center">
                      <span className="text-white font-rubik font-bold text-sm">{item.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-gray-300 text-base leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 bg-green-mid text-white px-8 py-3 rounded-lg font-bold hover:bg-green-light transition-colors"
            >
              לארכיון המלא (חברים בלבד)
              <ChevronLeft size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
