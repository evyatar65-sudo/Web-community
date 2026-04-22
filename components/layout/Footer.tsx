import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-darkest text-gray-300" style={{ backgroundColor: "#1a2e1a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-mid flex items-center justify-center text-white font-bold">
                סנ
              </div>
              <div>
                <div className="text-white font-rubik font-bold text-base leading-tight">
                  עמותת בוגרי
                </div>
                <div className="text-green-light font-rubik font-bold text-base leading-tight">
                  סיירת נח&quot;ל
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              חברה, מורשת, שייכות. קהילת בוגרי סיירת נח&quot;ל — יחד מחוץ לשדה הקרב, כפי שהיינו בו.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="פייסבוק"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-mid transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="אינסטגרם"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-mid transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="וואטסאפ"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-mid transition-colors"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-rubik font-bold text-base mb-4">ניווט מהיר</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "אודות העמותה" },
                { href: "/activities", label: "פעילויות" },
                { href: "/memorial", label: "הנצחה ומורשת" },
                { href: "/events", label: "אירועים" },
                { href: "/donate", label: "תרומה" },
                { href: "/shop", label: "חנות" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Members Area */}
          <div>
            <h3 className="text-white font-rubik font-bold text-base mb-4">אזור חברים</h3>
            <ul className="space-y-2">
              {[
                { href: "/register", label: "הצטרפות לעמותה" },
                { href: "/login", label: "כניסת חברים" },
                { href: "/members", label: "מאגר בוגרים" },
                { href: "/forum", label: "פורום הקהילה" },
                { href: "/archive", label: "ארכיון היסטורי" },
                { href: "/alumni-benefits", label: "קידום בוגרים" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-rubik font-bold text-base mb-4">יצירת קשר</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={15} className="shrink-0 mt-0.5 text-green-light" />
                תל אביב, ישראל
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={15} className="shrink-0 text-green-light" />
                <a href="mailto:info@sayeret-nachal.org.il" className="hover:text-green-light transition-colors">
                  info@sayeret-nachal.org.il
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} עמותת בוגרי סיירת נח&quot;ל | ע&quot;ר XXXXXXX
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              תקנון
            </Link>
            <Link href="/accessibility" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              נגישות
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
