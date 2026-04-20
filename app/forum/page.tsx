"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Plus, Clock, Send, Search } from "lucide-react";
import Link from "next/link";
import PrivateRoute from "@/components/ui/PrivateRoute";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";

type Category = "כללי" | "מקצועי" | "חברתי" | "ציוד ומילואים";

interface Post {
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

const MOCK_POSTS: Post[] = [
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
    preview: 'מתכנן ריצה של 10 ק"מ בירקון, 7 בבוקר. מי מצטרף?',
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

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `לפני ${mins || 1} דקות`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "אתמול";
  if (days < 7) return `לפני ${days} ימים`;
  return new Date(dateStr).toLocaleDateString("he-IL");
}

function PostSkeleton() {
  return (
    <div className="card-green-accent p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-200 rounded-full mb-3" />
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-100 rounded mb-4" />
          <div className="flex gap-4">
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

function ForumContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | "הכל">("הכל");
  const [search, setSearch] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: CATEGORIES[0], content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("forum_posts")
        .select("*, author:profiles(full_name, service_years), replies:forum_replies(count)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        setPosts(
          data.map((p) => {
            const authorProfile = Array.isArray(p.author) ? p.author[0] : p.author;
            return {
              id: p.id,
              title: p.title,
              category: p.category as Category,
              author: authorProfile?.full_name || "חבר",
              serviceYears: authorProfile?.service_years || "",
              replies: Array.isArray(p.replies) ? p.replies[0]?.count ?? 0 : 0,
              time: relativeTime(p.created_at),
              preview: p.content.slice(0, 120),
            };
          })
        );
      } else {
        setPosts(MOCK_POSTS);
      }
    } catch {
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "הכל" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.preview.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  async function handlePublish() {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setPostError("יש למלא כותרת ותוכן");
      return;
    }
    setSubmitting(true);
    setPostError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("לא מחובר");
      const { data, error } = await supabase
        .from("forum_posts")
        .insert({ author_id: user.id, category: newPost.category, title: newPost.title, content: newPost.content })
        .select("id")
        .single();
      if (error) throw error;
      if (data?.id) {
        router.push(`/forum/${data.id}`);
      } else {
        setShowNewPost(false);
        setNewPost({ title: "", category: CATEGORIES[0], content: "" });
        loadPosts();
      }
    } catch {
      setPostError("שגיאה בפרסום. נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        title="פורום הקהילה"
        subtitle="שיח פתוח, שאלות ומידע — לחברי הסיירת בלבד"
      />

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          {/* Search */}
          <div className="relative mb-5">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש בפורום..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark bg-white shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filter + new post */}
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
              className="flex items-center gap-2 bg-green-dark text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-mid transition-colors shrink-0"
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
                {postError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{postError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handlePublish}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-green-dark text-white hover:bg-green-mid transition-colors disabled:opacity-60"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    פרסם
                  </button>
                  <button
                    onClick={() => { setShowNewPost(false); setPostError(""); }}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts list */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {search && (
                <p className="text-sm text-gray-400 mb-3">
                  נמצאו {filtered.length} תוצאות
                </p>
              )}
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
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
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
                            {post.author}
                            {post.serviceYears && ` | ${post.serviceYears}`}
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
                  <p>{search ? `אין תוצאות עבור "${search}"` : "אין פוסטים בקטגוריה זו"}</p>
                </div>
              )}
            </>
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
