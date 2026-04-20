import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Users,
  Shield,
  Star,
  Calendar,
  BookOpen,
  ChevronLeft,
  Award,
  Handshake,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const stats = [
  { value: "14+", label: "שנות פעילות" },
  { value: "500+", label: "בוגרים רשומים" },
  { value: "30+", label: "מבצעי זיכרון" },
];

const activities = [
  {
    icon: Shield,
    title: "תמיכה ביחידה הפעילה",
    description: "סיוע ביצירת קשר בין בוגרים לחיילים פעילים, ציוד, מימון פעילויות ועוד.",
  },
  {
    icon: Heart,
    title: "ליווי פצועים",
    description: "מערך תמיכה אישי לפצועים ונכים: ליווי רפואי, נפשי וסיוע בשיקום.",
  },
  {
    icon: Users,
    title: "ליווי משפחות שכולות",
    description: "קשר רציף עם משפחות הנופלים, נוכחות בטקסים ותמיכה לאורך השנה.",
  },
  {
    icon: Star,
    title: "פעילות קהילתית",
    description: "מפגשים, כנסים, ועוד — כי הסיירת לא נגמרת בשחרור.",
  },
];

const partners = [
  { seed: "partner1", name: "שותף 1" },
  { seed: "partner2", name: "שותף 2" },
  { seed: "partner3", name: "שותף 3" },
  { seed: "partner4", name: "שותף 4" },
  { seed: "partner5", name: "שותף 5" },
];

const mockEvents = [
  {
    id: "1",
    title: "טקס יום הזיכרון השנתי",
    date: "2025-05-05T18:00:00",
    location: "הר הרצל, ירושלים",
    description: "טקס זיכרון שנתי לנופלי סיירת נח\"ל. הכניסה חופשית לכלל הציבור.",
    is_public: true,
  },
  {
    id: "2",
    title: "מפגש בוגרים — תל אביב",
    date: "2025-05-20T19:30:00",
    location: "תל אביב",
    description: "ערב בוגרים עם נאומים, הצגת פרויקטים חדשים והתחדשות.",
    is_public: false,
  },
  {
    id: "3",
    title: "ריצת סיום מחזור — ירושלים",
    date: "2025-06-12T08:00:00",
    location: "ירושלים",
    description: "ריצה משותפת לציון סיום מחזור בצבא, פתוחה לכל הבוגרים.",
    is_public: true,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center hero-texture"
        style={{ backgroundColor: "#1a2e1a" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(45,90,39,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-32">
          {/* Emblem */}
          <div className="mb-8 flex justify-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-green-dark border-4 border-green-light/30 flex items-center justify-center shadow-2xl">
              <span className="text-white font-rubik font-black text-3xl sm:text-4xl">
                סנ
              </span>
            </div>
          </div>

          <div className="mb-3">
            <span className="text-green-light font-medium text-sm sm:text-base tracking-widest uppercase">
              קהילת בוגרי סיירת נח&quot;ל
            </span>
          </div>

          <h1 className="text-white font-rubik font-black text-5xl sm:text-6xl lg:text-7xl mb-4 leading-tight">
            עמותת בוגרי
            <br />
            <span className="text-green-light">סיירת נח&quot;ל</span>
          </h1>

          <p className="text-gray-300 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            חברה, מורשת, שייכות.
            <br />
            יחד מחוץ לשדה הקרב, כפי שהיינו בו.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-green-dark text-white px-8 py-4 rounded-lg text-base font-bold hover:bg-green-mid transition-colors shadow-lg"
            >
              הצטרפות לעמותה
            </Link>
            <Link
              href="/donate"
              className="w-full sm:w-auto border-2 border-gold text-gold px-8 py-4 rounded-lg text-base font-bold hover:bg-gold hover:text-white transition-colors"
            >
              <Heart className="inline ml-2" size={18} />
              לתרומה
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-green-light" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-rubik font-black text-4xl sm:text-5xl text-green-dark mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section-padding bg-gray-light">
        <div className="container-max">
          <SectionTitle
            title="פעילויות העמותה"
            subtitle="אנו פועלים במספר ערוצים לטובת בוגרינו, חיילי הסיירת הפעילה ומשפחות הנופלים"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.title}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-lg bg-green-pale flex items-center justify-center mb-4 group-hover:bg-green-dark transition-colors">
                    <Icon
                      size={22}
                      className="text-green-dark group-hover:text-white transition-colors"
                    />
                  </div>
                  <h3 className="font-rubik font-bold text-gray-900 text-lg mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 text-green-dark font-semibold hover:text-green-mid transition-colors"
            >
              לכל הפעילויות
              <ChevronLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionTitle
            title="אירועים קרובים"
            subtitle="הישארו מעודכנים בפעילות העמותה והקהילה"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockEvents.map((event) => {
              const date = new Date(event.date);
              return (
                <div
                  key={event.id}
                  className="card border-r-4 border-r-green-dark p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-green-darkest text-white rounded-lg p-2 text-center min-w-[52px]" style={{ backgroundColor: "#1a2e1a" }}>
                      <div className="text-xl font-bold font-rubik">{date.getDate()}</div>
                      <div className="text-xs text-green-light">
                        {date.toLocaleDateString("he-IL", { month: "short" })}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {!event.is_public && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            חברים בלבד
                          </span>
                        )}
                      </div>
                      <h3 className="font-rubik font-bold text-gray-900 text-base mb-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={11} />
                        {event.location}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-green-dark font-semibold hover:text-green-mid transition-colors"
            >
              לכל האירועים
              <ChevronLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section
        className="section-padding hero-texture"
        style={{ backgroundColor: "#2d5a27" }}
      >
        <div className="container-max text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-gold" />
          </div>
          <h2 className="font-rubik font-black text-3xl sm:text-4xl text-white mb-4">
            תרומתך מחזקת את הקהילה
          </h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            כספי התרומות מאפשרים לנו לתמוך בפצועים, לסייע למשפחות שכולות, לקיים אירועי קהילה
            ולשמר את מורשת הסיירת לדורות הבאים.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-gold text-white px-8 py-4 rounded-lg text-base font-bold hover:opacity-90 transition-opacity shadow-lg"
            >
              תרום עכשיו
            </Link>
            <Link
              href="/about"
              className="border-2 border-white/40 text-white px-8 py-4 rounded-lg text-base font-bold hover:bg-white/10 transition-colors"
            >
              קרא עוד על העמותה
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access for Members */}
      <section className="section-padding bg-green-pale">
        <div className="container-max">
          <SectionTitle
            title="אזור הבוגרים"
            subtitle="מגוון שירותים ותכנים בלעדיים לחברי העמותה המאושרים"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, title: "מאגר בוגרים", desc: "חפש ותתחבר עם בוגרים אחרים", href: "/members" },
              { icon: BookOpen, title: "ארכיון היסטורי", desc: "תמונות, מסמכים ומורשת היחידה", href: "/archive" },
              { icon: Calendar, title: "אירועים פרטיים", desc: "מפגשים וכנסים לחברים בלבד", href: "/events" },
              { icon: Award, title: "הטבות ויתרונות", desc: "הנחות ושירותים לבוגרי הסיירת", href: "/alumni-benefits" },
              { icon: Handshake, title: "פורום קהילתי", desc: "שיח, שאלות ומידע שיתופי", href: "/forum" },
              { icon: Star, title: "לוח תעסוקה", desc: "הזדמנויות עבודה בקהילת הבוגרים", href: "/alumni-benefits#jobs" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex items-start gap-4 border border-green-light/20"
                >
                  <div className="w-11 h-11 rounded-lg bg-green-pale flex items-center justify-center shrink-0 group-hover:bg-green-dark transition-colors">
                    <Icon size={20} className="text-green-dark group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-rubik font-bold text-gray-900 text-base mb-1 group-hover:text-green-dark transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-green-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-green-mid transition-colors"
            >
              הצטרפות לעמותה
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="container-max">
          <p className="text-center text-gray-400 text-sm font-medium mb-8 tracking-wider uppercase">
            שותפים ותומכים
          </p>
          <div className="flex items-center justify-center flex-wrap gap-8 opacity-50 grayscale hover:opacity-70 transition-opacity">
            {partners.map((p) => (
              <Image
                key={p.seed}
                src={`https://picsum.photos/seed/${p.seed}/120/40`}
                alt={p.name}
                width={120}
                height={40}
                className="object-contain h-10"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
