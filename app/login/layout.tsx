import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'כניסה — עמותת בוגרי סיירת נח"ל',
  description: "כניסה לאזור הבוגרים של עמותת סיירת נח\"ל",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
