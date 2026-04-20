"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { Shield, Clock, XCircle } from "lucide-react";

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function PrivateRoute({ children, adminOnly = false }: PrivateRouteProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "64px" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-mid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  if (profile.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ paddingTop: "64px" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-yellow-500" />
          </div>
          <h1 className="font-rubik font-bold text-2xl text-gray-900 mb-3">ממתין לאישור</h1>
          <p className="text-gray-600 leading-relaxed">
            הבקשה שלך התקבלה ונמצאת בתהליך אימות. אנו נחזור אליך בהקדם האפשרי לאחר אישור הנתונים שלך.
          </p>
        </div>
      </div>
    );
  }

  if (profile.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ paddingTop: "64px" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>
          <h1 className="font-rubik font-bold text-2xl text-gray-900 mb-3">הבקשה נדחתה</h1>
          <p className="text-gray-600 leading-relaxed">
            מצטערים, לא הצלחנו לאמת את פרטיך. לפרטים נוספים, אנא פנה אלינו דרך עמוד{" "}
            <a href="/contact" className="text-green-dark hover:underline font-medium">צור קשר</a>.
          </p>
        </div>
      </div>
    );
  }

  if (adminOnly && profile.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ paddingTop: "64px" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} className="text-gray-400" />
          </div>
          <h1 className="font-rubik font-bold text-2xl text-gray-900 mb-3">גישה מוגבלת</h1>
          <p className="text-gray-600">אין לך הרשאה לגשת לעמוד זה.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
