import type { Metadata } from "next";
import { Heebo, Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-heebo",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: 'עמותת בוגרי סיירת נח"ל',
    template: '%s | עמותת בוגרי סיירת נח"ל',
  },
  description: 'חברה, מורשת, שייכות — קהילת בוגרי סיירת נח"ל',
  keywords: ['סיירת נח"ל', "בוגרים", "עמותה", "IDF", "veterans"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: 'עמותת בוגרי סיירת נח"ל',
    description: 'חברה, מורשת, שייכות — קהילת בוגרי סיירת נח"ל',
    locale: "he_IL",
    type: "website",
    siteName: 'עמותת בוגרי סיירת נח"ל',
  },
  twitter: {
    card: "summary",
    title: 'עמותת בוגרי סיירת נח"ל',
    description: 'חברה, מורשת, שייכות — קהילת בוגרי סיירת נח"ל',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${rubik.variable}`}>
      <body className="font-heebo antialiased">
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
