"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, Calendar, ArrowRight, Phone, MessageSquare } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

function MemberProfileContent() {
  const [member, setMember] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.id as string)
        .eq("status", "approved")
        .single();
      setMember(data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "64px" }}>
        <div className="w-10 h-10 border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "64px" }}>
        <div className="text-center">
          <h1 className="font-rubik font-bold text-2xl text-gray-900 mb-2">חבר לא נמצא</h1>
          <p className="text-gray-500 mb-6">החבר אינו קיים או אינו מופיע במאגר</p>
          <Link href="/members" className="text-green-dark font-semibold hover:underline flex items-center gap-1 justify-center">
            <ArrowRight size={16} />
            חזרה למאגר
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light" style={{ paddingTop: "64px" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/members" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-dark mb-8">
          <ArrowRight size={14} />
          חזרה למאגר
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div style={{ backgroundColor: "#1a2e1a" }} className="p-8 text-center">
            {member.avatar_url ? (
              <Image
                src={member.avatar_url}
                alt={member.full_name}
                width={96}
                height={96}
                className="rounded-full object-cover w-24 h-24 mx-auto mb-4 border-4 border-green-light/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-mid flex items-center justify-center text-white font-rubik font-bold text-3xl mx-auto mb-4 border-4 border-green-light/30">
                {member.full_name[0]}
              </div>
            )}
            <h1 className="font-rubik font-black text-2xl text-white mb-1">{member.full_name}</h1>
            {member.role_in_unit && (
              <p className="text-green-light font-medium">{member.role_in_unit}</p>
            )}
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="space-y-4">
              {member.service_years && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-green-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">שנות שירות</p>
                    <p className="font-medium">{member.service_years}</p>
                  </div>
                </div>
              )}
              {member.current_city && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-green-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">עיר מגורים</p>
                    <p className="font-medium">{member.current_city}</p>
                  </div>
                </div>
              )}
              {member.profession && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase size={16} className="text-green-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">עיסוק</p>
                    <p className="font-medium">{member.profession}</p>
                  </div>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-green-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">טלפון</p>
                    <a href={`tel:${member.phone}`} className="font-medium text-green-dark hover:underline">
                      {member.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                href="/forum"
                className="inline-flex items-center gap-2 bg-green-pale text-green-dark px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-dark hover:text-white transition-colors"
              >
                <MessageSquare size={15} />
                פנה בפורום הקהילה
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemberProfilePage() {
  return (
    <PrivateRoute>
      <MemberProfileContent />
    </PrivateRoute>
  );
}
