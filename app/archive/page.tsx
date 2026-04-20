"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, FileText, Film, Filter, Upload, X } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";

type ItemType = "photo" | "document" | "video" | "all";

const MOCK_ARCHIVE = [
  { id: "1", title: "תמונות אימון 1985", year: 1985, type: "photo" as const, seed: "archive1" },
  { id: "2", title: "ריכוז מסמכים 1990", year: 1990, type: "document" as const, seed: "archive2" },
  { id: "3", title: "מבצע ליטני — תיעוד", year: 1982, type: "photo" as const, seed: "archive3" },
  { id: "4", title: "טקס סיום מחזור 45", year: 1995, type: "photo" as const, seed: "archive4" },
  { id: "5", title: "גיבוש 1988 — צפון", year: 1988, type: "photo" as const, seed: "archive5" },
  { id: "6", title: "כנס בוגרים 2005", year: 2005, type: "video" as const, seed: "archive6" },
  { id: "7", title: "תצוגה אווירית 1979", year: 1979, type: "photo" as const, seed: "archive7" },
  { id: "8", title: "פקודת מבצע עיראק", year: 1973, type: "document" as const, seed: "archive8" },
  { id: "9", title: "מצעד יום העצמאות 2000", year: 2000, type: "photo" as const, seed: "archive9" },
];

const YEARS = Array.from(
  new Set(MOCK_ARCHIVE.map((a) => a.year))
).sort((a, b) => b - a);

const TYPE_ICONS = {
  photo: ImageIcon,
  document: FileText,
  video: Film,
};

function ArchiveContent() {
  const [typeFilter, setTypeFilter] = useState<ItemType>("all");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = MOCK_ARCHIVE.filter((item) => {
    const matchType = typeFilter === "all" || item.type === typeFilter;
    const matchYear = !yearFilter || item.year === yearFilter;
    return matchType && matchYear;
  });

  return (
    <>
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

            {/* Type filter */}
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

            {/* Year filter */}
            <select
              value={yearFilter || ""}
              onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-green-dark"
            >
              <option value="">כל השנים</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <div className="flex-1" />

            <button className="flex items-center gap-2 bg-green-pale text-green-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-light hover:text-white transition-colors">
              <Upload size={14} />
              העלאת פריט
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              return (
                <div
                  key={item.id}
                  className="group relative cursor-pointer rounded-xl overflow-hidden bg-gray-100 aspect-square"
                  onClick={() => item.type === "photo" && setLightbox(item.seed)}
                >
                  {item.type === "photo" ? (
                    <>
                      <Image
                        src={`https://picsum.photos/seed/${item.seed}/300/300`}
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
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    <p className="text-white/60 text-xs">{item.year}</p>
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
            src={`https://picsum.photos/seed/${lightbox}/800/600`}
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
