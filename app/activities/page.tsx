import type { Metadata } from "next";
import { Shield, Heart, Users, Star, ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: `פעילויות — עמותת בוגרי סיירת נח"ל`,
  description: "תמיכה בפצועים, ליווי משפחות שכולות, חיזוק הסיירת הפעילה ופעילות קהילתית לאורך השנה.",
};

const activities = [
  {
    id: "active-unit",
    Icon: Shield,
    title: "תמיכה בסיירת הפעילה",
    subtitle: "חיבור בין עבר להווה",
    color: "from-green-darkest to-green-mid",
    description:
      "עמותת הבוגרים שומרת על קשר חי עם הסיירת הפעילה. אנו מממנים ציוד מיוחד, מסייעים בארגון פעילויות ואירועים ליחידה, ומאפשרים מפגשים בין חיילים פעילים לבוגרים ותיקים — חיבור שמחזק את תחושת המשכיות ושייכות לסיירת.",
    highlights: [
      "מימון ציוד ייחודי ליחידה",
      "פעילויות גיבוש לחיילים פעילים",
      "חונכות בוגרים לחיילים",
      "אירועי חיבור בין הדורות",
    ],
  },
  {
    id: "wounded",
    Icon: Heart,
    title: "ליווי פצועים",
    subtitle: "לא מפקירים אף אחד",
    color: "from-red-900 to-red-700",
    description:
      "בוגרים שנפצעו בשירותם זכאים לתמיכה מלאה מצד העמותה. צוות מסור של בוגרים ועובדים סוציאליים מלווה את הפצועים בתהליך השיקום — מהאשפוז ועד לחזרה לשגרה. התמיכה כוללת ממד רגשי, רפואי, משפטי וכלכלי.",
    highlights: [
      "ליווי אישי בתהליך השיקום",
      "סיוע בהתמודדות עם הבירוקרטיה",
      "תמיכה פסיכולוגית ורגשית",
      "סיוע כלכלי לפי צורך",
    ],
  },
  {
    id: "bereaved",
    Icon: Users,
    title: "ליווי משפחות שכולות",
    subtitle: "הנצחה וחיבוק מתמיד",
    color: "from-gray-800 to-gray-600",
    description:
      "משפחות הנופלים הן חלק בלתי נפרד מקהילת הסיירת. אנו שומרים על קשר שוטף לאורך כל השנה, נוכחים בטקסי האזכרה ובאירועים המשפחתיים, ומבטיחים שהנופלים ומשפחותיהם לא יישכחו לעולם.",
    highlights: [
      "קשר שוטף עם המשפחות",
      "נוכחות בטקסי אזכרה",
      "תמיכה בהנצחה אישית",
      "פעילויות חיבוק וזיכרון",
    ],
  },
  {
    id: "community",
    Icon: Star,
    title: "פעילות קהילתית",
    subtitle: "הסיירת לא נגמרת בשחרור",
    color: "from-green-mid to-green-light",
    description:
      "הקהילה היא ליבת הפעילות שלנו. אנו מארגנים מפגשים, כנסים, ריצות וסיורים שמחזקים את הקשרים בין הבוגרים. בין אם זה ערב בוגרים, טיול שנתי, או גיבוש ספורטיבי — כולם ממשיכים את רוח הסיירת בחיים האזרחיים.",
    highlights: [
      "מפגשי בוגרים תקופתיים",
      "טיולים וסיורים שנתיים",
      "פעילות ספורטיבית משותפת",
      "כנסים מקצועיים לבוגרים",
    ],
  },
];

export default function ActivitiesPage() {
  return (
    <>
      <PageHero
        title="פעילויות העמותה"
        subtitle="ארבעה ערוצי פעולה עיקריים — כולם עם מחויבות אחת: לעמוד לצד בוגרי הסיירת"
      />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="space-y-20">
            {activities.map((activity, index) => {
              const { Icon } = activity;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={activity.id}
                  id={activity.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-mt-24"
                >
                  {/* Text */}
                  <div className={isEven ? "" : "lg:order-2"}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center">
                        <Icon size={24} className="text-green-dark" />
                      </div>
                      <div>
                        <p className="text-sm text-green-mid font-medium">{activity.subtitle}</p>
                        <h2 className="font-rubik font-bold text-2xl text-gray-900">{activity.title}</h2>
                      </div>
                    </div>
                    <div className="h-1 w-12 bg-green-mid rounded-full mb-6" />
                    <p className="text-gray-600 leading-relaxed mb-6 text-base">{activity.description}</p>
                    <ul className="space-y-2">
                      {activity.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle size={15} className="text-green-mid shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual panel */}
                  <div className={isEven ? "" : "lg:order-1"}>
                    <div
                      className={`rounded-2xl shadow-lg h-72 lg:h-80 bg-gradient-to-br ${activity.color} flex flex-col items-center justify-center gap-6 p-8`}
                    >
                      <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/25 flex items-center justify-center">
                        <Icon size={36} className="text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-rubik font-bold text-xl">{activity.title}</p>
                        <p className="text-white/70 text-sm mt-1">{activity.subtitle}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-center">
                        {activity.highlights.slice(0, 2).map((h) => (
                          <span key={h} className="bg-white/15 text-white text-xs px-3 py-1 rounded-full">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-texture" style={{ backgroundColor: "#2d5a27" }}>
        <div className="container-max text-center">
          <h2 className="font-rubik font-black text-3xl text-white mb-4">רוצה לעזור?</h2>
          <p className="text-gray-200 mb-8 max-w-xl mx-auto">
            תרומתך מאפשרת לנו להמשיך ולפעול. כל תרומה, גדולה וקטנה, מגיעה ישירות לפעילות.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="bg-gold text-white px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-opacity">
              תרום לעמותה
            </Link>
            <Link href="/register" className="border-2 border-white/40 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors">
              הצטרף כחבר
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
