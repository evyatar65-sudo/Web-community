import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'צור קשר — עמותת בוגרי סיירת נח"ל',
  description: "צרו קשר עם עמותת בוגרי סיירת נח\"ל — נשמח לשמוע מכם בכל עניין.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
