import type { Metadata } from "next";
import Image from "next/image";
import { Shield, Heart, Users, Star, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: `פעילויות — עמותת בוגרי סיירת נח"ל`,
  description: "תמיכה בפצועים, ליווי משפחות שכולות, חיזוק הסיירת הפעילה ופעילות קהילתית לאורך השנה.",
};

const activities = [
  {
    id: "active-unit",
    icon: Shield,
    title: "תמיכה בסיירת הפעילה",
    subtitle: "חיבור בין עבר להווה",
    description: `עמותת הבוגרים שומרת על קשר חי עם הסיירת הפעילה. אנו מממנים ציוד
    מיוחד, מסייעים בארגון פעילויות ואירועים ליחידה, ומאפשרים מפגשים בין
    חיילים פעילים לבוגרים ותיקים — חיבור שמחזק את תחושת המשכיות ושייכות לסיירת.`,
    image: "https://picsum.photos/seed/activity1/700/400",
    highlights: [
      "מימון ציוד ייחודי ליחידה",
      "פעילויות גיבוש לחיילים פעילים",
      "חונכות בוגרים לחיילים",
      "אירועי חיבור בין הדורות",
    ],
  },
  {
    id: "wounded",
    icon: Heart,
    title: "ליווי פצועים",
    subtitle: "לא מפקירים אף אחד",
    description: `בוגרים שנפצעו בשירותם זכאים לתמיכה מלאה מצד העמותה. צוות מסור
    של בוגרים ועובדים סוציאליים מלווה את הפצועים בתהליך השיקום — מהאשפוז
    ועד לחזרה לשגרה. התמיכה כוללת ממד רגשי, רפואי, משפטי וכלכלי.`,
    image: "https://picsum.photos/seed/activity2/700/400",
    highlights: [
      "ליווי אישי בתהליך השיקום",
      "סיוע בהתמודדות עם הבירוקרטיה",
      "תמיכה פסיכולוגית ורגשית",
      "סיוע כלכלי לפי צורך",
    ],
  },
  {
    id: "bereaved",
    icon: Users,
    title: "ליווי משפחות שכולות",
    subtitle: "הנצחה וחיבוק מתמיד",
    description: `משפחות הנופלים הן חלק בלתי נפרד מקהילת הסיירת. אנו שומרים על
    קשר שוטף לאורך כל השנה, נוכחים בטקסי האזכרה ובאירועים המשפחתיים,
    ומבטיחים שהנופלים ומשפחותיהם לא יישכחו לעולם.`,
    image: "https://picsum.photos/seed/activity3/700/400",
    highlights: [
      "קשר שוטף עם המשפחות",
      "נוכחות בטקסי אזכרה",
      "תמיכה בהנצחה אישית",
      "פעילויות חיבוק וזיכרון",
    ],
  },
  {
    id: "community",
    icon: Star,
    title: "פעילות קהילתית",
    subtitle: "הסיירת לא נגמרת בשחרור",
    description: `הקהילה היא ליבת הפעילות שלנו. אנו מארגנים מפגשים, כנסים, ריצות
    וסיורים שמחזקים את הקשרים בין הבוגרים. בין אם זה ערב בוגרים, טיול
    שנתי, או גיבוש ספורטיבי — כולם ממשיכים את רוח הסיירת בחיים האזרחיים.`,
    image: "https://picsum.photos/seed/activity4/700/400",
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
              const Icon = activity.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={activity.id}
                  id={activity.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-mt-24"
                >
                  <div className={`${isEven ? "" : "lg:order-2"}`}>
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
                    <p className="text-gray-600 leading-relaxed mb-6 text-base whitespace-pre-line">
                      {activity.description}
                    </p>
                    <ul className="space-y-2">
                      {activity.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-mid shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${isEven ? "" : "lg:order-1"}`}>
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      width={700}
                      height={400}
                      className="rounded-2xl shadow-lg object-cover w-full h-72 lg:h-80"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-padding hero-texture"
        style={{ backgroundColor: "#2d5a27" }}
      >
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
