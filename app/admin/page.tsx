"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Users, Calendar, FileText, MessageSquare, Download, Shield } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type AdminTab = "users" | "events" | "content" | "forum" | "donations";

const TAB_ICONS = {
  users: Users,
  events: Calendar,
  content: FileText,
  forum: MessageSquare,
  donations: Shield,
};

const TAB_LABELS: Record<AdminTab, string> = {
  users: "אישור משתמשים",
  events: "ניהול אירועים",
  content: "ניהול תוכן",
  forum: "ניהול פורום",
  donations: "תרומות",
};

function PendingUsersTab() {
  const [pending, setPending] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setPending(data || []);
    setLoading(false);
  }

  async function approve(id: string) {
    setProcessing(id);
    await supabase.from("profiles").update({ status: "approved" }).eq("id", id);
    setPending((prev) => prev.filter((p) => p.id !== id));
    setProcessing(null);
  }

  async function reject(id: string) {
    setProcessing(id);
    await supabase.from("profiles").update({ status: "rejected" }).eq("id", id);
    setPending((prev) => prev.filter((p) => p.id !== id));
    setProcessing(null);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-green-mid border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (pending.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={40} className="text-green-light mx-auto mb-3" />
        <p className="text-gray-500">אין בקשות ממתינות לאישור</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-right py-3 px-4 font-medium text-gray-600">שם</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">מספר אישי</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">שנות שירות</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">תפקיד</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">נרשם</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((user) => (
            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="py-3 px-4 font-medium text-gray-900">{user.full_name}</td>
              <td className="py-3 px-4 text-gray-600 font-mono">{user.personal_id || "—"}</td>
              <td className="py-3 px-4 text-gray-600">{user.service_years || "—"}</td>
              <td className="py-3 px-4 text-gray-600">{user.role_in_unit || "—"}</td>
              <td className="py-3 px-4 text-gray-400 text-xs">
                {new Date(user.created_at).toLocaleDateString("he-IL")}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approve(user.id)}
                    disabled={processing === user.id}
                    className="flex items-center gap-1 bg-green-dark text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-mid transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={12} />
                    אישור
                  </button>
                  <button
                    onClick={() => reject(user.id)}
                    disabled={processing === user.id}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={12} />
                    דחייה
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState<{id:string;title:string;date:string;location?:string;is_public:boolean}[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("events").select("*").order("date", { ascending: false }).then(({ data }) => setEvents(data || []));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-rubik font-bold text-lg">אירועים</h3>
        <button className="flex items-center gap-2 bg-green-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors">
          + אירוע חדש
        </button>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-400 text-center py-8">אין אירועים במערכת</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{e.title}</p>
                <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString("he-IL")} | {e.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${e.is_public ? "bg-green-pale text-green-dark" : "bg-gray-100 text-gray-500"}`}>
                  {e.is_public ? "פומבי" : "חברים"}
                </span>
                <button className="text-xs text-blue-600 hover:underline">ערוך</button>
                <button className="text-xs text-red-500 hover:underline">מחק</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DonationsTab() {
  const mockStats = { total: "₪127,450", monthly: "₪12,300", donors: 84 };
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "סה\"כ תרומות", value: mockStats.total },
          { label: "החודש", value: mockStats.monthly },
          { label: "תורמים", value: mockStats.donors },
        ].map((s) => (
          <div key={s.label} className="bg-green-pale rounded-xl p-5 text-center">
            <div className="font-rubik font-bold text-2xl text-green-dark mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <button className="flex items-center gap-2 bg-green-dark text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors">
        <Download size={14} />
        ייצוא CSV
      </button>
    </div>
  );
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase.from("profiles").select("status");
      if (data) {
        setStats({
          pending: data.filter((p) => p.status === "pending").length,
          approved: data.filter((p) => p.status === "approved").length,
          total: data.length,
        });
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-light" style={{ paddingTop: "64px" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1a2e1a" }} className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-mid rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-rubik font-black text-2xl text-white">פאנל ניהול</h1>
              <p className="text-gray-400 text-sm">עמותת בוגרי סיירת נח&quot;ל</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm">
            {[
              { label: "ממתינים", value: stats.pending, color: "text-yellow-400" },
              { label: "מאושרים", value: stats.approved, color: "text-green-light" },
              { label: "סה\"כ חברים", value: stats.total, color: "text-white" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`font-rubik font-bold text-2xl ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {(Object.keys(TAB_LABELS) as AdminTab[]).map((tab) => {
                const Icon = TAB_ICONS[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors text-right border-b border-gray-50 last:border-b-0 ${
                      activeTab === tab
                        ? "bg-green-pale text-green-dark border-r-4 border-r-green-dark"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} />
                    {TAB_LABELS[tab]}
                    {tab === "users" && stats.pending > 0 && (
                      <span className="mr-auto bg-yellow-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {stats.pending}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-rubik font-bold text-xl text-gray-900 mb-6 pb-4 border-b border-gray-100">
              {TAB_LABELS[activeTab]}
            </h2>
            {activeTab === "users" && <PendingUsersTab />}
            {activeTab === "events" && <EventsTab />}
            {activeTab === "content" && (
              <div className="text-center py-12 text-gray-400">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p>ניהול תוכן — בקרוב</p>
              </div>
            )}
            {activeTab === "forum" && (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                <p>ניהול פורום — בקרוב</p>
              </div>
            )}
            {activeTab === "donations" && <DonationsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <PrivateRoute adminOnly>
      <AdminContent />
    </PrivateRoute>
  );
}
