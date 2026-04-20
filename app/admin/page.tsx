"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Users, Calendar, MessageSquare, Download, Shield, Plus, X, Pencil, Trash2, Image as ImageIcon, Search, Gift } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Event, ArchiveItem, Benefit } from "@/lib/types";

type AdminTab = "users" | "events" | "archive" | "members" | "donations" | "benefits";

const TAB_ICONS = {
  users: Users,
  events: Calendar,
  archive: ImageIcon,
  members: MessageSquare,
  donations: Shield,
  benefits: Gift,
};

const TAB_LABELS: Record<AdminTab, string> = {
  users: "אישור משתמשים",
  events: "ניהול אירועים",
  archive: "ניהול ארכיון",
  members: "כל החברים",
  donations: "תרומות",
  benefits: "הטבות",
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

type EventForm = {
  title: string;
  date: string;
  location: string;
  description: string;
  is_public: boolean;
};

const EMPTY_FORM: EventForm = { title: "", date: "", location: "", description: "", is_public: false };

function EventModal({
  initial,
  onSave,
  onClose,
}: {
  initial: EventForm;
  onSave: (form: EventForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<EventForm>(initial);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-rubik font-bold text-lg text-gray-900">
            {initial.title ? "עריכת אירוע" : "אירוע חדש"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כותרת *</label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark"
              placeholder="שם האירוע"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תאריך ושעה *</label>
              <input
                required
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מיקום</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark"
                placeholder="עיר / כתובת"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark resize-none"
              placeholder="פרטי האירוע..."
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
              className="w-4 h-4 accent-green-dark"
            />
            <span className="text-sm text-gray-700">אירוע פומבי (גלוי גם לא-חברים)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-dark text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors disabled:opacity-60"
            >
              {saving ? "שומר..." : "שמור אירוע"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: false });
    setEvents(data || []);
  }

  async function handleSave(form: EventForm) {
    if (editingEvent) {
      await supabase.from("events").update(form).eq("id", editingEvent.id);
    } else {
      await supabase.from("events").insert(form);
    }
    await load();
    setShowModal(false);
    setEditingEvent(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק את האירוע?")) return;
    setDeleting(id);
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleting(null);
  }

  function openEdit(e: Event) {
    setEditingEvent(e);
    setShowModal(true);
  }

  function openNew() {
    setEditingEvent(null);
    setShowModal(true);
  }

  const modalInitial: EventForm = editingEvent
    ? {
        title: editingEvent.title,
        date: editingEvent.date.slice(0, 16),
        location: editingEvent.location || "",
        description: editingEvent.description || "",
        is_public: editingEvent.is_public,
      }
    : EMPTY_FORM;

  return (
    <div>
      {showModal && (
        <EventModal
          initial={modalInitial}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-rubik font-bold text-lg">אירועים ({events.length})</h3>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-green-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors"
        >
          <Plus size={14} />
          אירוע חדש
        </button>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-400 text-center py-8">אין אירועים במערכת</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50">
              <div>
                <p className="font-medium text-gray-900">{e.title}</p>
                <p className="text-xs text-gray-400">
                  {new Date(e.date).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })}
                  {e.location && ` | ${e.location}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${e.is_public ? "bg-green-pale text-green-dark" : "bg-gray-100 text-gray-500"}`}>
                  {e.is_public ? "פומבי" : "חברים"}
                </span>
                <button
                  onClick={() => openEdit(e)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="ערוך"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  disabled={deleting === e.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="מחק"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveTab() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("archive_items")
      .select("*")
      .eq("is_approved", false)
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  async function approve(id: string) {
    setProcessing(id);
    await supabase.from("archive_items").update({ is_approved: true }).eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setProcessing(null);
  }

  async function reject(id: string) {
    setProcessing(id);
    await supabase.from("archive_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setProcessing(null);
  }

  const TYPE_LABELS: Record<string, string> = { photo: "תמונה", document: "מסמך", video: "וידאו" };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-green-mid border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={40} className="text-green-light mx-auto mb-3" />
        <p className="text-gray-500">אין פריטים ממתינים לאישור</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
              <ImageIcon size={15} className="text-green-dark" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">
                {TYPE_LABELS[item.type] || item.type}
                {item.year ? ` · ${item.year}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => approve(item.id)}
              disabled={processing === item.id}
              className="flex items-center gap-1 bg-green-dark text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-mid transition-colors disabled:opacity-50"
            >
              <CheckCircle size={12} />
              אישור
            </button>
            <button
              onClick={() => reject(item.id)}
              disabled={processing === item.id}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <XCircle size={12} />
              דחייה
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  approved: { label: "מאושר", color: "bg-green-pale text-green-dark" },
  pending:  { label: "ממתין", color: "bg-yellow-100 text-yellow-700" },
  rejected: { label: "נדחה",  color: "bg-red-100 text-red-600" },
};

function AllMembersTab() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
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
      .order("created_at", { ascending: false });
    setMembers(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      !q
        ? members
        : members.filter(
            (m) =>
              m.full_name?.toLowerCase().includes(q) ||
              m.service_years?.toLowerCase().includes(q) ||
              m.role_in_unit?.toLowerCase().includes(q)
          )
    );
  }, [search, members]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setProcessing(id);
    await supabase.from("profiles").update({ status }).eq("id", id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    setProcessing(null);
  }

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "member" : "admin";
    setProcessing(id);
    await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: newRole as "member" | "admin" } : m)));
    setProcessing(null);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-green-mid border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="חיפוש חבר..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 pr-9 text-sm focus:outline-none focus:border-green-dark"
          />
        </div>
        <span className="text-sm text-gray-400">{filtered.length} חברים</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-right py-3 px-3 font-medium text-gray-600">שם</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 hidden sm:table-cell">שנות שירות</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600">סטטוס</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 hidden md:table-cell">תפקיד</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const s = STATUS_LABELS[m.status] || STATUS_LABELS.pending;
              return (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-medium text-gray-900">{m.full_name}</td>
                  <td className="py-2.5 px-3 text-gray-500 hidden sm:table-cell">{m.service_years || "—"}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                  </td>
                  <td className="py-2.5 px-3 hidden md:table-cell">
                    <button
                      onClick={() => toggleRole(m.id, m.role)}
                      disabled={processing === m.id}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                        m.role === "admin"
                          ? "bg-green-dark text-white hover:bg-green-mid"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      {m.role === "admin" ? "מנהל" : "חבר"}
                    </button>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {m.status !== "approved" && (
                        <button
                          onClick={() => updateStatus(m.id, "approved")}
                          disabled={processing === m.id}
                          className="p-1 text-green-dark hover:bg-green-pale rounded transition-colors disabled:opacity-50"
                          title="אשר"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {m.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(m.id, "rejected")}
                          disabled={processing === m.id}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="דחה"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DonationsTab() {
  const mockStats = { total: "₪127,450", monthly: "₪12,300", donors: 84 };
  const [exporting, setExporting] = useState(false);
  const supabase = createClient();

  async function handleExportMembers() {
    setExporting(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("full_name,personal_id,service_years,role_in_unit,phone,current_city,profession,status,role,created_at")
        .order("created_at", { ascending: false });

      if (!data || data.length === 0) return;

      const headers = ["שם מלא", "מספר אישי", "שנות שירות", "תפקיד", "טלפון", "עיר", "עיסוק", "סטטוס", "תפקיד מערכת", "נרשם"];
      const rows = data.map((m) => [
        m.full_name,
        m.personal_id || "",
        m.service_years || "",
        m.role_in_unit || "",
        m.phone || "",
        m.current_city || "",
        m.profession || "",
        m.status,
        m.role,
        new Date(m.created_at).toLocaleDateString("he-IL"),
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `members-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

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
      <div className="flex gap-3">
        <button
          onClick={handleExportMembers}
          disabled={exporting}
          className="flex items-center gap-2 bg-green-dark text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors disabled:opacity-60"
        >
          {exporting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={14} />
          )}
          ייצוא חברים CSV
        </button>
      </div>
    </div>
  );
}

type BenefitForm = { company: string; description: string; discount_details: string; link: string; is_active: boolean };
const EMPTY_BENEFIT: BenefitForm = { company: "", description: "", discount_details: "", link: "", is_active: true };

function BenefitModal({
  initial,
  onSave,
  onClose,
}: {
  initial: BenefitForm;
  onSave: (form: BenefitForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<BenefitForm>(initial);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-rubik font-bold text-lg text-gray-900">
            {initial.company ? "עריכת הטבה" : "הטבה חדשה"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם החברה / ספק *</label>
            <input
              required
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark"
              placeholder="שם החברה"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תיאור ההטבה *</label>
            <input
              required
              type="text"
              value={form.discount_details}
              onChange={(e) => setForm({ ...form, discount_details: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark"
              placeholder='לדוגמה: הנחה 20% על כל המוצרים'
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תיאור כללי</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark resize-none"
              placeholder="מידע נוסף על ההטבה..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קישור (לא חובה)</label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark"
              placeholder="https://..."
              dir="ltr"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 accent-green-dark"
            />
            <span className="text-sm text-gray-700">הטבה פעילה (מוצגת לחברים)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-dark text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors disabled:opacity-60"
            >
              {saving ? "שומר..." : "שמור הטבה"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BenefitsTab() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Benefit | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("benefits").select("*").order("company");
    setBenefits(data || []);
    setLoading(false);
  }

  async function handleSave(form: BenefitForm) {
    if (editing) {
      await supabase.from("benefits").update(form).eq("id", editing.id);
    } else {
      await supabase.from("benefits").insert(form);
    }
    await load();
    setShowModal(false);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק את ההטבה?")) return;
    setDeleting(id);
    await supabase.from("benefits").delete().eq("id", id);
    setBenefits((prev) => prev.filter((b) => b.id !== id));
    setDeleting(null);
  }

  async function toggleActive(b: Benefit) {
    await supabase.from("benefits").update({ is_active: !b.is_active }).eq("id", b.id);
    setBenefits((prev) => prev.map((x) => (x.id === b.id ? { ...x, is_active: !b.is_active } : x)));
  }

  const modalInitial: BenefitForm = editing
    ? { company: editing.company, description: editing.description || "", discount_details: editing.discount_details || "", link: editing.link || "", is_active: editing.is_active }
    : EMPTY_BENEFIT;

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-green-mid border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      {showModal && (
        <BenefitModal
          initial={modalInitial}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-rubik font-bold text-lg">הטבות ({benefits.length})</h3>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-green-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors"
        >
          <Plus size={14} />
          הטבה חדשה
        </button>
      </div>
      {benefits.length === 0 ? (
        <p className="text-gray-400 text-center py-8">אין הטבות במערכת</p>
      ) : (
        <div className="space-y-3">
          {benefits.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-green-pale rounded-lg flex items-center justify-center shrink-0">
                  <Gift size={15} className="text-green-dark" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{b.company}</p>
                  <p className="text-xs text-gray-400 truncate">{b.discount_details || b.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(b)}
                  className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                    b.is_active ? "bg-green-pale text-green-dark hover:bg-green-light/20" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {b.is_active ? "פעיל" : "לא פעיל"}
                </button>
                <button
                  onClick={() => { setEditing(b); setShowModal(true); }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="ערוך"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={deleting === b.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="מחק"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0, pendingArchive: 0 });
  const supabase = createClient();

  async function loadStats() {
    const [{ data: profiles }, { count: archiveCount }] = await Promise.all([
      supabase.from("profiles").select("status"),
      supabase.from("archive_items").select("*", { count: "exact", head: true }).eq("is_approved", false),
    ]);
    if (profiles) {
      setStats({
        pending: profiles.filter((p) => p.status === "pending").length,
        approved: profiles.filter((p) => p.status === "approved").length,
        total: profiles.length,
        pendingArchive: archiveCount || 0,
      });
    }
  }

  useEffect(() => {
    loadStats();

    // Update pending badge in real-time when new users register or status changes
    const channel = supabase
      .channel("admin_profiles_watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => { loadStats(); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "archive_items" },
        () => { loadStats(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
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
        {/* Mobile tab bar */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 mb-4">
          {(Object.keys(TAB_LABELS) as AdminTab[]).map((tab) => {
            const Icon = TAB_ICONS[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-green-dark text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <Icon size={13} />
                {TAB_LABELS[tab]}
                {tab === "users" && stats.pending > 0 && (
                  <span className="bg-yellow-400 text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {stats.pending}
                  </span>
                )}
                {tab === "archive" && stats.pendingArchive > 0 && (
                  <span className="bg-orange-400 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {stats.pendingArchive}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop only */}
          <div className="hidden lg:block w-56 shrink-0">
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
                    {tab === "archive" && stats.pendingArchive > 0 && (
                      <span className="mr-auto bg-orange-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {stats.pendingArchive}
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
            {activeTab === "archive" && <ArchiveTab />}
            {activeTab === "members" && <AllMembersTab />}
            {activeTab === "donations" && <DonationsTab />}
            {activeTab === "benefits" && <BenefitsTab />}
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
