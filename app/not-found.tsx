import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 hero-texture"
      style={{ backgroundColor: "#1a2e1a", paddingTop: "64px" }}
    >
      <div className="text-center max-w-lg">
        <div className="font-rubik font-black text-[120px] sm:text-[160px] leading-none text-white/10 select-none mb-4">
          404
        </div>
        <h1 className="font-rubik font-black text-3xl sm:text-4xl text-white mb-4">
          הדף לא נמצא
        </h1>
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          הדף שחיפשת אינו קיים או הוסר.
          <br />
          אולי הקישור שגוי?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-green-dark text-white px-8 py-4 rounded-lg font-bold hover:bg-green-mid transition-colors"
          >
            <Home size={18} />
            חזרה לדף הבית
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
          >
            צור קשר
          </Link>
        </div>
        <div className="mt-12 flex items-center justify-center gap-6">
          {[
            { href: "/about", label: "אודות" },
            { href: "/events", label: "אירועים" },
            { href: "/donate", label: "תרומה" },
            { href: "/members", label: "בוגרים" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-green-light transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
