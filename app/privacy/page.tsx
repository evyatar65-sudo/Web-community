import PageHero from "@/components/ui/PageHero";

const sections = [
  {
    title: "מבוא",
    content: `עמותת בוגרי סיירת נח"ל ("העמותה") מחויבת להגן על פרטיות המשתמשים באתר ובשירותים שלנו. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.`,
  },
  {
    title: "מידע שאנו אוספים",
    content: `אנו אוספים את סוגי המידע הבאים:
• פרטים אישיים: שם מלא, כתובת דואר אלקטרוני, מספר טלפון
• מידע על שירות צבאי: שנות שירות, תפקיד ביחידה, מספר אישי (לצורך אימות)
• מידע שימוש: כיצד אתה משתמש באתר, דפים שביקרת, פעולות שביצעת
• עוגיות: מידע טכני לשיפור חוויית הגלישה`,
  },
  {
    title: "כיצד אנו משתמשים במידע",
    content: `המידע שנאסף משמש לצרכים הבאים:
• אימות ובדיקת כשירות חברות בעמותה
• מתן גישה לאזורים פרטיים באתר לחברים מאושרים
• שליחת עדכונים על אירועים ופעילויות
• שיפור השירותים שאנו מציעים
• ציות לדרישות חוקיות`,
  },
  {
    title: "שיתוף מידע",
    content: `אנו לא מוכרים, משכירים או מעבירים את המידע האישי שלך לצדדים שלישיים ללא הסכמתך, למעט:
• כאשר נדרש על פי חוק
• לספקי שירות הפועלים בשמנו (כגון שירותי אימייל), תחת הסכמי סודיות
• בהסכמה מפורשת שלך`,
  },
  {
    title: "אבטחת מידע",
    content: `אנו נוקטים באמצעי אבטחה מתאימים להגנה על המידע שלך, כולל הצפנה, בקרת גישה וניטור. עם זאת, אין שיטה של שידור דרך האינטרנט שהיא מאובטחת ב-100%.`,
  },
  {
    title: "זכויותיך",
    content: `בהתאם לחוק הגנת הפרטיות הישראלי, יש לך הזכות:
• לדעת אילו מידע אנו מחזיקים עליך
• לבקש תיקון מידע שגוי
• לבקש מחיקת מידעך (בכפוף למגבלות חוקיות)
• לבקש הגבלת עיבוד המידע

לפניות: info@sayeret-nachal.org.il`,
  },
  {
    title: "עוגיות (Cookies)",
    content: `האתר משתמש בעוגיות לצורך ניהול הפגישות ושיפור החוויה. ניתן לנהל העדפות עוגיות בהגדרות הדפדפן שלך.`,
  },
  {
    title: "שינויים במדיניות",
    content: `אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יוודעו בדואר אלקטרוני או בהודעה בולטת באתר.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="מדיניות פרטיות"
        subtitle="כיצד אנו שומרים על המידע שלך"
      />
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="text-sm text-gray-400 mb-10">
            עדכון אחרון: ינואר 2025
          </div>
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-rubik font-bold text-xl text-gray-900 mb-3">{section.title}</h2>
                <div className="h-0.5 w-10 bg-green-mid rounded-full mb-4" />
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-green-pale rounded-2xl">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>שאלות?</strong> ניתן לפנות אלינו בכל עת לכתובת{" "}
              <a href="mailto:privacy@sayeret-nachal.org.il" className="text-green-dark font-medium hover:underline">
                privacy@sayeret-nachal.org.il
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
