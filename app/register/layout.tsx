import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'הצטרפות לעמותה — עמותת בוגרי סיירת נח"ל',
  description: "הגש בקשת הצטרפות לעמותת בוגרי סיירת נח\"ל — לבוגרי הסיירת בלבד.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
