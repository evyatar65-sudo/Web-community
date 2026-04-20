import { Award, Briefcase, Users, GraduationCap, Calendar, Home } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import PrivateRoute from "@/components/ui/PrivateRoute";

const benefits = [
  { company: "ביט — שירותי בנקאות", discount: "הנחה של 20% בעמלות", category: "פיננסי" },
  { company: "WeWork ישראל", discount: "חצי מחיר חודשי ראשון", category: "עבודה" },
  { company: "מכון כושר — ספורטלייף", discount: "הנחה של 30%", category: "בריאות" },
  { company: "כלל ביטוח", discount: "תוכנית ביטוח מותאמת לוותיקים", category: "ביטוח" },
  { company: "אורט — אקדמיה", discount: "מלגה מיוחדת לבוגרים", category: "אקדמיה" },
  { company: "משרד עורכי דין מילמן", discount: "ייעוץ משפטי חינם שעה ראשונה", category: "משפטי" },
];

const jobs = [
  { title: "מנהל אבטחה", company: "בנק לאומי", type: "משרה מלאה" },
  { title: "מדריך שטח", company: "ארגון גיבוש", type: "פרילנס" },
  { title: "מנהל פרויקטים", company: "תעשייה אווירית", type: "משרה מלאה" },
  { title: "יועץ בטחוני", company: "חברת יעוץ פרטית", type: "חלקי" },
];

const academicResources = [
  { title: "מלגת בוגרי לחימה — האוניברסיטה העברית", amount: "₪5,000 לשנה", deadline: "31.3 בכל שנה" },
  { title: "קורס MBA מוזל — IDC", amount: "הנחה 15%", deadline: "מתמשך" },
  { title: "מסלול מזורז לתעודת הוראה — מכון מופ\"ת", amount: "הנחה 25%", deadline: "01.09.2025" },
];

function BenefitsContent() {
  return (
    <>
      <PageHero
        title="קידום בוגרים"
        subtitle="מגוון שירותים, הטבות ומשאבים בלעדיים לחברי העמותה"
      />

      {/* Benefits */}
      <section className="section-padding bg-white" id="benefits">
        <div className="container-max">
          <SectionTitle
            title="הטבות ושותפויות"
            subtitle={'הנחות ושירותים מיוחדים לבוגרי סיירת נח"ל'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.company} className="card-green-accent p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-rubik font-bold text-gray-900">{b.company}</h3>
                  <span className="text-xs bg-green-pale text-green-dark px-2 py-0.5 rounded-full whitespace-nowrap">
                    {b.category}
                  </span>
                </div>
                <p className="text-green-mid font-semibold text-sm mb-4">{b.discount}</p>
                <button className="text-xs text-green-dark font-medium hover:underline">
                  לפרטים ולמימוש ←
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Networking */}
      <section className="section-padding bg-green-pale" id="networking">
        <div className="container-max">
          <SectionTitle title="נטוורקינג" subtitle="התחבר עם הקהילה — הרשת שלך חזקה ממה שחשבת" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <Link
              href="/members"
              className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-dark rounded-xl flex items-center justify-center shrink-0">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-rubik font-bold text-gray-900">מאגר בוגרים</h3>
                <p className="text-sm text-gray-500">500+ חברים — חפש וצור קשר</p>
              </div>
            </Link>
            <Link
              href="/forum"
              className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-dark rounded-xl flex items-center justify-center shrink-0">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-rubik font-bold text-gray-900">פורום קהילתי</h3>
                <p className="text-sm text-gray-500">שיח, שאלות ושיתוף</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="section-padding bg-white" id="jobs">
        <div className="container-max">
          <SectionTitle title="לוח תעסוקה" subtitle="הזדמנויות עבודה בקהילת הבוגרים ומחוצה לה" />
          <div className="max-w-3xl mx-auto space-y-4">
            {jobs.map((job) => (
              <div key={job.title} className="card p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase size={20} className="text-green-dark" />
                  </div>
                  <div>
                    <h3 className="font-rubik font-bold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {job.type}
                  </span>
                  <button className="text-sm font-semibold text-green-dark hover:text-green-mid transition-colors whitespace-nowrap">
                    פרטים ←
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academia */}
      <section className="section-padding bg-gray-light" id="academia">
        <div className="container-max">
          <SectionTitle
            title="אקדמיה ומלגות"
            subtitle="הזדמנויות לימודיות מועדפות לבוגרי הסיירת"
          />
          <div className="max-w-3xl mx-auto space-y-4">
            {academicResources.map((r) => (
              <div key={r.title} className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
                    <GraduationCap size={20} className="text-green-dark" />
                  </div>
                  <div>
                    <h3 className="font-rubik font-bold text-gray-900 text-base">{r.title}</h3>
                    <p className="text-green-mid font-semibold text-sm">{r.amount}</p>
                    <p className="text-gray-400 text-xs">הגשה עד: {r.deadline}</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-green-dark hover:underline whitespace-nowrap">
                  למידע נוסף
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events & Return */}
      <section className="section-padding bg-white" id="events-return">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SectionTitle title="כנסים ואירועים" centered={false} />
              <p className="text-gray-600 mb-4">
                הסיירת מארגנת כנסים מקצועיים, כנסי הייטק ואירועים חברתיים לאורך השנה.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-green-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-mid transition-colors text-sm"
              >
                <Calendar size={16} />
                לוח האירועים
              </Link>
            </div>
            <div>
              <SectionTitle title="חזרה לשגרה" centered={false} />
              <p className="text-gray-600 mb-4">
                משאבים, מדריכים ואנשי קשר לתהליך המעבר לחיים האזרחיים.
              </p>
              <div className="space-y-2">
                {["מדריך לקבלת תגמולים", "ייעוץ פסיכולוגי חינמי", "הכשרות מקצועיות מסובסדות"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Home size={14} className="text-green-mid shrink-0" />
                    {item}
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

export default function AlumniBenefitsPage() {
  return (
    <PrivateRoute>
      <BenefitsContent />
    </PrivateRoute>
  );
}
