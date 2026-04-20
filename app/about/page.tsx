import Image from "next/image";
import { Download, FileText, Users, Target, Heart } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";

const teamMembers = [
  { name: "אלון כהן", role: "יושב ראש", seed: "team1", years: "2012-2016" },
  { name: "מיכל לוי", role: "מנכ\"ל/ית", seed: "team2", years: "2008-2012" },
  { name: "יואב שפירא", role: "גזבר", seed: "team3", years: "2005-2009" },
  { name: "תמר גולן", role: "מזכירה", seed: "team4", years: "2015-2019" },
];

const boardMembers = [
  { name: "גיל אברהם", role: "יו\"ר ועד", years: "1998-2002" },
  { name: "דנה כץ", role: "חבר ועד", years: "2003-2007" },
  { name: "עמיר שחר", role: "חבר ועד", years: "2010-2014" },
  { name: "ליאת מורן", role: "חבר ועד", years: "2018-2022" },
  { name: "נועם ברק", role: "חבר ועד", years: "2007-2011" },
];

const documents = [
  { name: "תקנון העמותה", year: "2024", size: "PDF, 420KB" },
  { name: "דו\"ח כספי 2023", year: "2023", size: "PDF, 1.2MB" },
  { name: "דו\"ח פעילות 2023", year: "2023", size: "PDF, 890KB" },
  { name: "תקציב 2024", year: "2024", size: "PDF, 340KB" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="אודותינו"
        subtitle={'עמותת בוגרי סיירת נח"ל — מחברים בין עבר, הווה ועתיד'}
      />

      {/* About Association */}
      <section className="section-padding bg-white" id="about">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle title="אודות העמותה" centered={false} />
              <p className="text-gray-600 leading-relaxed mb-4">
                עמותת בוגרי סיירת נח&quot;ל הוקמה בשנת 2010 במטרה לשמור על הקשרים בין בוגרי
                היחידה, לחזק את הקהילה ולשמר את מורשת הסיירת לדורות הבאים.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                אנו פועלים לסייע לפצועים ולנכים, לתמוך במשפחות הנופלים, לחזק את היחידה
                הפעילה ולקיים קהילה חיה ופועמת של בוגרים ברחבי ישראל והעולם.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                מאות חברים פעילים, עשרות אירועים בשנה, ומחויבות בלתי נלאית לערכים שעמם
                גדלנו — אלה הם פני העמותה.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Target, label: "מטרה", value: "קהילה חיה" },
                  { icon: Users, label: "חברים", value: "500+" },
                  { icon: Heart, label: "פעילות", value: "כל השנה" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="text-center p-4 bg-green-pale rounded-lg">
                      <Icon size={22} className="text-green-dark mx-auto mb-2" />
                      <div className="font-rubik font-bold text-lg text-green-dark">{item.value}</div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://picsum.photos/seed/about1/600/450"
                alt='עמותת בוגרי סיירת נח"ל'
                width={600}
                height={450}
                className="rounded-2xl shadow-lg object-cover w-full"
              />
              <div
                className="absolute -bottom-4 -right-4 bg-green-dark text-white rounded-xl p-4 text-center shadow-xl"
              >
                <div className="font-rubik font-black text-3xl">2010</div>
                <div className="text-xs text-green-light">שנת ייסוד</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Unit */}
      <section className="section-padding bg-gray-light" id="unit">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Image
                src="https://picsum.photos/seed/about2/600/400"
                alt='סיירת נח"ל'
                width={600}
                height={400}
                className="rounded-2xl shadow-lg object-cover w-full"
              />
            </div>
            <div className="order-1 lg:order-2">
              <SectionTitle title="אודות הסיירת" centered={false} />
              <p className="text-gray-600 leading-relaxed mb-4">
                סיירת נח&quot;ל היא יחידת הסיור העוצבתית של חטיבת הנח&quot;ל בצבא ההגנה לישראל.
                היחידה ידועה ביכולות הסיור, הסתערות, ואיסוף המודיעין שלה.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                הסיירת פועלת בתנאים מורכבים, מבצעת משימות מיוחדות ומשרתת כחוד החנית
                של החטיבה. בוגריה ידועים ביכולות הגבוהות, ברוח הלחימה ובמחויבות לחיפוש
                אחר מצוינות.
              </p>
              <p className="text-gray-600 leading-relaxed">
                מורשת הסיירת — ערכי לחימה, יחד, מחויבות ואומץ — ממשיכה ללוות את הבוגרים
                בחיים האזרחיים ולעצב את אופיים.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white" id="team">
        <div className="container-max">
          <SectionTitle
            title="צוות העמותה"
            subtitle="האנשים המניעים את העמותה מאחורי הקלעים"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative mb-4 inline-block">
                  <Image
                    src={`https://picsum.photos/seed/${member.seed}/200/200`}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover w-28 h-28 mx-auto border-4 border-green-pale group-hover:border-green-light transition-colors"
                  />
                </div>
                <h3 className="font-rubik font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-green-mid font-medium text-sm">{member.role}</p>
                <p className="text-gray-400 text-xs mt-1">שירות: {member.years}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="section-padding bg-green-pale" id="board">
        <div className="container-max">
          <SectionTitle
            title="ועד מנהל"
            subtitle="חברי הוועד הנבחר המוביל את העמותה"
          />
          <div className="max-w-2xl mx-auto">
            {boardMembers.map((member, index) => (
              <div
                key={member.name}
                className={`flex items-center justify-between py-4 ${
                  index < boardMembers.length - 1 ? "border-b border-green-light/30" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-dark text-white flex items-center justify-center font-bold text-sm">
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="font-rubik font-bold text-gray-900">{member.name}</div>
                    <div className="text-sm text-green-mid">{member.role}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">שירות: {member.years}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="section-padding bg-white" id="documents">
        <div className="container-max">
          <SectionTitle
            title="מסמכי העמותה"
            subtitle={'תקנון, דו"חות כספיים ומסמכים רשמיים'}
          />
          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="card-green-accent p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{doc.name}</div>
                    <div className="text-xs text-gray-400">{doc.year} | {doc.size}</div>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1.5 text-green-dark hover:text-green-mid transition-colors text-sm font-medium"
                  aria-label={`הורד ${doc.name}`}
                >
                  <Download size={16} />
                  הורד
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
