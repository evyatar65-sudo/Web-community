"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PrivateRoute from "@/components/ui/PrivateRoute";
import PageHero from "@/components/ui/PageHero";

type Category = "כללי" | "מקצועי" | "חברתי" | "ציוד ומילואים";

interface MockPost {
  id: string;
  title: string;
  category: Category;
  author: string;
  serviceYears: string;
  replies: number;
  time: string;
  preview: string;
}

const CATEGORIES: Category[] = ["כללי", "מקצועי", "חברתי", "ציוד ומילואים"];

const MOCK_POSTS: MockPost[] = [
  {
    id: "1",
    title: "שאלה לגבי הטבות נכים — מישהו עבר את התהליך?",
    category: "ציוד ומילואים",
    author: "אלון כ.",
    serviceYears: "2012–2016",
    replies: 8,
    time: "לפני שעתיים",
    preview: "רוצה להבין איך מקבלים את ההטבות של משרד הביטחון — האם יש מישהו שעבר את זה לאחרונה?",
  },
  {
    id: "2",
    title: "הצעות עבודה בחברות הייטק — שתפו פוסטים",
    category: "מקצועי",
    author: "מיכל ל.",
    serviceYears: "2010–2014",
    replies: 15,
    time: "לפני 5 שעות",
    preview: "ריכוז של פוסטים בלינקדאין ובאתרים שונים — עצמו כאן ותתחדשו",
  },
  {
    id: "3",
    title: "מי יוצא לריצה קבוצתית השישי הקרוב?",
    category: "חברתי",
    author: "נועם ש.",
    serviceYears: "2008–2012",
    replies: 5,
    time: "אתמול",
    preview: "מתכנן ריצה של 10 ק\"מ בירקון, 7 בבוקר. מי מצטרף?",
  },
  {
    id: "4",
    title: "עדכונים מהכנס שנתי 2024 — סיכום ורשמים",
    category: "כללי",
    author: "גיל א.",
    serviceYears: "1998–2002",
    replies: 22,
    time: "לפני 3 ימים",
    preview: "לאחר הכנס השנתי — רשמים, תמונות וקישורים לצפייה חוזרת",
  },
  {
    id: "5",
    title: "מה לוקחים למחנה? טיפים לציוד",
    category: "ציוד ומילואים",
    author: "תמר ג.",
    serviceYears: "2015–2019",
    replies: 11,
    time: "לפני שבוע",
    preview: "נשלח שוב למילואים בחודש הבא — מישהו יכול לשתף מה הוא לוקח?",
  },
];

const CATEGORY_COLORS: Record<Category, string> = {
  "כללי": "bg-blue-100 text-blue-700",
  "מקצועי": "bg-green-100 text-green-700",
  "חברתי": "bg-purple-100 text-purple-700",
  "ציוד ומילואים": "bg-orange-100 text-orange-700",
};

function ForumContent() {
  const [activeCategory, setActiveCategory] = useState<Category | "הכל">("הכל");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: CATEGORIES[0], content: "" });

  const filtered =
    activeCategory === "הכל"
      ? MOCK_POSTS
      : MOCK_POSTS.filter((p) => p.category === activeCategory);

  return (
    <>
      <PageHero
        title="פורום הקהילה"
        subtitle="שיח פתוח, שאלות ומידע — לחברי הסיירת בלבד"
      />

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          {/* Header actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {(["הכל", ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category | "הכל")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-green-dark text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="flex items-center gap-2 bg-green-dark text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors"
            >
              <Plus size={16} />
              פוסט חדש
            </button>
          </div>

          {/* New post form */}
          {showNewPost && (
            <div className="bg-green-pale rounded-2xl p-6 mb-6 border border-green-light/30">
              <h3 className="font-rubik font-bold text-lg text-gray-900 mb-4">פוסט חדש</h3>
              <div className="space-y-4">
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value as Category })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-dark bg-white"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="כותרת הפוסט"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark bg-white"
                />
                <textarea
                  placeholder="תוכן ההודעה..."
                  rows={5}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-dark bg-white resize-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-green-dark text-white hover:bg-green-mid transition-colors"
                  >
                    פרסם
                  </button>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts list */}
          <div className="space-y-3">
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/forum/${post.id}`}
                className="card-green-accent p-5 hover:shadow-md transition-shadow group block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category]}`}>
                        {post.category}
                      </span>
                    </div>
                    <h3 className="font-rubik font-bold text-gray-900 text-base group-hover:text-green-dark transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{post.preview}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-green-pale flex items-center justify-center text-green-dark font-bold text-xs">
                          {post.author[0]}
                        </div>
                        {post.author} | {post.serviceYears}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {post.time}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageSquare size={14} />
                      <span className="text-sm font-medium">{post.replies}</span>
                    </div>
                    <span className="text-xs text-gray-300">תגובות</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p>אין פוסטים בקטגוריה זו</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ForumPage() {
  return (
    <PrivateRoute>
      <ForumContent />
    </PrivateRoute>
  );
}
