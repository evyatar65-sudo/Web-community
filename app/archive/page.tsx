"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, FileText, Film, Filter, Upload, X, CheckCircle } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";
import type { ArchiveItem } from "@/lib/types";

type ItemType = "photo" | "document" | "video" | "all";

const MOCK_ARCHIVE: (ArchiveItem & { seed: string })[] = [
  { id: "1", title: "תמונות אימון 1985", year: 1985, type: "photo", seed: "archive1", is_approved: true, created_at: "" },
  { id: "2", title: "ריכוז מסמכים 1990", year: 1990, type: "document", seed: "archive2", is_approved: true, created_at: "" },
  { id: "3", title: "מבצע ליטני — תיעוד", year: 1982, type: "photo", seed: "archive3", is_approved: true, created_at: "" },
  { id: "4", title: "טקס סיום מחזור 45", year: 1995, type: "photo", seed: "archive4", is_approved: true, created_at: "" },
  { id: "5", title: "גיבוש 1988 — צפון", year: 1988, type: "photo", seed: "archive5", is_approved: true, created_at: "" },
  { id: "6", title: "כנס בוגרים 2005", year: 2005, type: "video", seed: "archive6", is_approved: true, created_at: "" },
  { id: "7", title: "תצוגה אווירית 1979", year: 1979, type: "photo", seed: "archive7", is_approved: true, created_at: "" },
  { id: "8", title: "פקודת מבצע", year: 1973, type: "document", seed: "archive8", is_approved: true, created_at: "" },
  { id: "9", title: "מצעד יום העצמאות 2000", year: 2000, type: "photo", seed: "archive9", is_approved: true, created_at: "" },
];

const TYPE_ICONS = {
  photo: ImageIcon,
  document: FileText,
  video: Film,
};

function ItemSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square animate-pulse" />
  );
}

function UploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const [form, setForm] = useState({ title: "", year: new Date().getFullYear(), type: "photo" as "photo" | "document" | "video", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    try {
      let file_url: string | undefined;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `archive/${Date.now()}.${ext}`;
        await supabase.storage.from("uploads").upload(path, file);
        const { data } = supabase.storage.from("uploads").getPublicUrl(path);
        file_url = data.publicUrl;
      }
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("archive_items").insert({
        ...form,
        file_url,
        is_approved: false,
        uploaded_by: user?.id,
      });
      setDone(true);
      onUploaded();
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-rubik font-bold text-lg">העלאת פריט לארכיון</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {done ? (
          <div className="text-center py-8">
            <CheckCircle size={40} className="text-green-dark mx-auto mb-3" />
            <p className="font-semibold text-gray-800 mb-1">הפריט הועלה בהצלחה!</p>
            <p className="text-sm text-gray-500 mb-5">הפריט יוצג לאחר אישור מנהל.</p>
            <button onClick={onClose} className="bg-green-dark text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors">
              סגור
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת *</label>
              <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark"
                placeholder="שם הפריט" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark bg-white">
                  <option value="photo">תמונה</option>
                  <option value="document">מסמך</option>
                  <option value="video">וידאו</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שנה</label>
                <input type="number" value={form.year} min={1948} max={new Date().getFullYear()}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark resize-none"
                placeholder="תיאור קצר של הפריט..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קובץ</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center cursor-pointer hover:border-green-dark transition-colors"
              >
                <Upload size={20} className="mx-auto mb-1 text-gray-400" />
                <p className="text-sm text-gray-500">{file ? file.name : "לחץ לבחירת קובץ"}</p>
              </div>
              <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.mp4,.mov"
                onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={uploading}
                className="flex-1 bg-green-dark text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors disabled:opacity-60">
                {uploading ? "מעלה..." : "העלה"}
              </button>
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50">
                ביטול
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

type DisplayItem = {
  id: string;
  title: string;
  year: number | null;
  type: "photo" | "document" | "video";
  imageUrl: string | null;
};

function ArchiveContent() {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<ItemType>("all");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const supabase = createClient();

  async function loadItems() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("archive_items")
        .select("*")
        .eq("is_approved", true)
        .order("year", { ascending: false });

      if (data && data.length > 0) {
        setItems(
          data.map((item: ArchiveItem) => ({
            id: item.id,
            title: item.title,
            year: item.year || null,
            type: item.type,
            imageUrl: item.file_url || null,
          }))
        );
      } else {
        setItems(
          MOCK_ARCHIVE.map((item) => ({
            id: item.id,
            title: item.title,
            year: item.year || null,
            type: item.type,
            imageUrl: `https://picsum.photos/seed/${item.seed}/300/300`,
          }))
        );
      }
    } catch {
      setItems(
        MOCK_ARCHIVE.map((item) => ({
          id: item.id,
          title: item.title,
          year: item.year || null,
          type: item.type,
          imageUrl: `https://picsum.photos/seed/${item.seed}/300/300`,
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const years = Array.from(new Set(items.map((i) => i.year).filter(Boolean))).sort((a, b) => (b as number) - (a as number)) as number[];

  const filtered = items.filter((item) => {
    const matchType = typeFilter === "all" || item.type === typeFilter;
    const matchYear = !yearFilter || item.year === yearFilter;
    return matchType && matchYear;
  });

  return (
    <>
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={loadItems} />}
      <PageHero
        title="ארכיון היסטורי"
        subtitle={'תמונות, מסמכים ותיעוד מתולדות סיירת נח"ל'}
      />

      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">סנן לפי:</span>
            </div>

            <div className="flex gap-2">
              {(["all", "photo", "document", "video"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? "bg-green-dark text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type === "all" ? "הכל" : type === "photo" ? "תמונות" : type === "document" ? "מסמכים" : "וידאו"}
                </button>
              ))}
            </div>

            <select
              value={yearFilter || ""}
              onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-green-dark"
            >
              <option value="">כל השנים</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <div className="flex-1" />

            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-green-pale text-green-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-light hover:text-white transition-colors"
            >
              <Upload size={14} />
              העלאת פריט
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ItemSkeleton key={i} />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((item) => {
                  const Icon = TYPE_ICONS[item.type];
                  return (
                    <div
                      key={item.id}
                      className="group relative cursor-pointer rounded-xl overflow-hidden bg-gray-100 aspect-square"
                      onClick={() => item.type === "photo" && item.imageUrl && setLightbox(item.imageUrl)}
                    >
                      {item.type === "photo" && item.imageUrl ? (
                        <>
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <ImageIcon size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50">
                          <Icon size={32} className="text-gray-400 mb-2" />
                          {item.type === "video" && item.imageUrl && (
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-green-dark underline mt-1"
                            >
                              פתח וידאו
                            </a>
                          )}
                          {item.type === "document" && item.imageUrl && (
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-green-dark underline mt-1"
                            >
                              פתח מסמך
                            </a>
                          )}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white text-xs font-medium truncate">{item.title}</p>
                        {item.year && <p className="text-white/60 text-xs">{item.year}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
                  <p>לא נמצאו פריטים</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 left-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <Image
            src={lightbox}
            alt=""
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default function ArchivePage() {
  return (
    <PrivateRoute>
      <ArchiveContent />
    </PrivateRoute>
  );
}
