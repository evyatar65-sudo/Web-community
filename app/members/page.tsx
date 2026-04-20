"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Users } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import MemberCard from "@/components/ui/MemberCard";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

function MembersContent() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "approved")
        .eq("show_in_directory", true)
        .order("full_name");
      setMembers(data || []);
      setFiltered(data || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(members);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      members.filter(
        (m) =>
          m.full_name?.toLowerCase().includes(q) ||
          m.role_in_unit?.toLowerCase().includes(q) ||
          m.service_years?.toLowerCase().includes(q) ||
          m.current_city?.toLowerCase().includes(q) ||
          m.profession?.toLowerCase().includes(q)
      )
    );
  }, [search, members]);

  return (
    <>
      <PageHero
        title="מאגר בוגרים"
        subtitle={`${members.length} חברים רשומים — חפש, התחבר והתחדש`}
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש לפי שם, תפקיד, שנות שירות, עיר..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-4 pr-12 text-sm focus:outline-none focus:border-green-dark focus:ring-2 focus:ring-green-dark/20 shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            {search && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                נמצאו {filtered.length} תוצאות עבור &quot;{search}&quot;
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-full shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Users size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-rubik font-bold text-xl text-gray-400 mb-2">לא נמצאו תוצאות</h3>
              <p className="text-gray-400 text-sm">נסה חיפוש אחר</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function MembersPage() {
  return (
    <PrivateRoute>
      <MembersContent />
    </PrivateRoute>
  );
}
