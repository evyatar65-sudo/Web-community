"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import MemberCard from "@/components/ui/MemberCard";
import { MemberCardSkeleton } from "@/components/ui/Skeleton";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

function MembersContent() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
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

  const cities = Array.from(new Set(members.map((m) => m.current_city).filter(Boolean))).sort() as string[];
  const years = Array.from(
    new Set(
      members
        .map((m) => m.service_years?.match(/\d{4}/)?.[0])
        .filter(Boolean)
    )
  ).sort().reverse() as string[];

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      members.filter((m) => {
        const matchSearch =
          !q ||
          m.full_name?.toLowerCase().includes(q) ||
          m.role_in_unit?.toLowerCase().includes(q) ||
          m.service_years?.toLowerCase().includes(q) ||
          m.current_city?.toLowerCase().includes(q) ||
          m.profession?.toLowerCase().includes(q);
        const matchCity = !cityFilter || m.current_city === cityFilter;
        const matchYear = !yearFilter || m.service_years?.includes(yearFilter);
        return matchSearch && matchCity && matchYear;
      })
    );
  }, [search, cityFilter, yearFilter, members]);

  return (
    <>
      <PageHero
        title="מאגר בוגרים"
        subtitle={`${members.length} חברים רשומים — חפש, התחבר והתחדש`}
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Search + Filters */}
          <div className="max-w-3xl mx-auto mb-8 space-y-3">
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
            <div className="flex gap-3">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-green-dark shadow-sm text-gray-600"
              >
                <option value="">כל הערים</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-green-dark shadow-sm text-gray-600"
              >
                <option value="">כל השנים</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {(cityFilter || yearFilter) && (
                <button
                  onClick={() => { setCityFilter(""); setYearFilter(""); }}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl bg-white shadow-sm"
                >
                  נקה
                </button>
              )}
            </div>
            {(search || cityFilter || yearFilter) && (
              <p className="text-sm text-gray-500 text-center">
                נמצאו {filtered.length} חברים
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <MemberCardSkeleton key={i} />
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
