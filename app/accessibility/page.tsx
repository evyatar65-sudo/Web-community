import Link from "next/link";
import { CheckCircle, Mail } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

const features = [
  "תמיכה בקוראי מסך (NVDA, VoiceOver, JAWS)",
  "ניווט מלא במקלדת ללא עכבר",
  "יחסי ניגודיות עומדים בתקן WCAG 2.1 רמה AA",
  "טקסט חלופי (alt text) לכל התמונות",
  "תמיכה בהגדלת גופן של הדפדפן עד 200%",
  "כותרות ומבנה סמנטי תקין",
  "תוויות נגישות לכל רכיבי הטופס",
  "הצהרת שפה ותמיכה ב-RTL מלא",
  "תמיכה במצב ניגודיות גבוהה של מערכת ההפעלה",
];

const limitations = [
  "חלק מהתכנים הישנים בארכיון עלולים להיות בפורמטים פחות נגישים",
  "וידאו מוטמע ממקורות חיצוניים עשוי לא להכיל כתוביות",
  "קבצי PDF ישנים עלולים לא לתמוך בקוראי מסך",
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="הצהרת נגישות"
        subtitle="אנו מחויבים לנגישות דיגיטלית לכל"
      />
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          {/* Intro */}
          <div className="bg-green-pale rounded-2xl p-6 mb-10">
            <p className="text-gray-700 leading-relaxed">
              עמותת בוגרי סיירת נח&quot;ל מחויבת להנגיש את האתר לכלל הציבור, כולל אנשים עם מוגבלויות.
              אנו שואפים לעמוד בדרישות תקן ישראלי 5568 ובהנחיות WCAG 2.1 ברמת AA.
            </p>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h2 className="font-rubik font-bold text-2xl text-gray-900 mb-2">תכונות נגישות</h2>
            <div className="h-0.5 w-10 bg-green-mid rounded-full mb-6" />
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-mid shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Known limitations */}
          <div className="mb-10">
            <h2 className="font-rubik font-bold text-2xl text-gray-900 mb-2">מגבלות ידועות</h2>
            <div className="h-0.5 w-10 bg-green-mid rounded-full mb-6" />
            <ul className="space-y-3">
              {limitations.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              אנו עובדים לשיפור רציף של הנגישות ונטפל במגבלות אלה בגרסאות עתידיות.
            </p>
          </div>

          {/* Standards */}
          <div className="mb-10">
            <h2 className="font-rubik font-bold text-2xl text-gray-900 mb-2">תקנים ועמידה</h2>
            <div className="h-0.5 w-10 bg-green-mid rounded-full mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "תקן ישראלי", value: "5568", sub: "רמה AA" },
                { label: "WCAG", value: "2.1", sub: "רמה AA" },
                { label: "בדיקה אחרונה", value: "2025", sub: "ינואר" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-light rounded-xl p-4 text-center">
                  <div className="font-rubik font-bold text-2xl text-green-dark">{item.value}</div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="border border-green-light/30 rounded-2xl p-6">
            <h2 className="font-rubik font-bold text-xl text-gray-900 mb-3">נתקלת בבעיית נגישות?</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              אנו מעריכים כל משוב שיסייע לנו לשפר את הנגישות. ניתן לדווח על בעיות דרך:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:accessibility@sayeret-nachal.org.il"
                className="flex items-center gap-2 bg-green-dark text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-mid transition-colors text-sm"
              >
                <Mail size={16} />
                accessibility@sayeret-nachal.org.il
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2 border border-green-dark text-green-dark px-5 py-3 rounded-lg font-semibold hover:bg-green-pale transition-colors text-sm"
              >
                טופס יצירת קשר
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-3">נחזור אליך תוך 7 ימי עסקים</p>
          </div>
        </div>
      </section>
    </>
  );
}
