import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'תרומה — עמותת בוגרי סיירת נח"ל',
  description: "תרמו לעמותת בוגרי סיירת נח\"ל ותסייעו לפצועים, למשפחות שכולות ולחיזוק הסיירת הפעילה.",
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
