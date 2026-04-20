"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, Send, MessageSquare, Trash2 } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type Category = "כללי" | "מקצועי" | "חברתי" | "ציוד ומילואים";

interface Reply {
  id: string;
  author_id?: string;
  author: string;
  serviceYears: string;
  content: string;
  time: string;
}

interface ForumPost {
  id: string;
  author_id?: string;
  title: string;
  category: Category;
  author: string;
  serviceYears: string;
  content: string;
  time: string;
}

const MOCK_POSTS: Record<string, ForumPost & { replies: Reply[] }> = {
  "1": {
    id: "1",
    title: "שאלה לגבי הטבות נכים — מישהו עבר את התהליך?",
    category: "ציוד ומילואים",
    author: "אלון כ.",
    serviceYears: "2012–2016",
    content: `רוצה להבין איך מקבלים את ההטבות של משרד הביטחון לנכים — האם יש מישהו שעבר את זה לאחרונה?

ספציפית מעניין אותי:
1. מה תהליך ההגשה הראשוני?
2. כמה זמן לוקח עד שמקבלים תשובה?
3. האם כדאי להיעזר בעורך דין?

תודה מראש לכל מי שיכול לעזור!`,
    time: "לפני שעתיים",
    replies: [
      {
        id: "r1",
        author: "מיכל ל.",
        serviceYears: "2010–2014",
        content: "עברתי את התהליך לפני שנה. ממליצה להגיש דרך ועד הנכים כי יש שם מישהו שמכיר את הנבכים. התהליך לקח כ-6 חודשים.",
        time: "לפני שעה",
      },
      {
        id: "r2",
        author: "גיל א.",
        serviceYears: "1998–2002",
        content: "חשוב מאוד לשמור על כל המסמכים הרפואיים מתקופת השירות. זה מה שבסוף קובע. אם יש בעיה ספציפית צור קשר ואנסה לעזור.",
        time: "לפני 45 דקות",
      },
    ],
  },
  "2": {
    id: "2",
    title: "הצעות עבודה בחברות הייטק — שתפו פוסטים",
    category: "מקצועי",
    author: "מיכל ל.",
    serviceYears: "2010–2014",
    content: `ריכוז של פוסטים בלינקדאין ובאתרים שונים לבוגרי הסיירת שמחפשים עבודה בהייטק.

שתפו כאן קישורים, המלצות על חברות, וטיפים לתהליך הגיוס.

אני אתחיל: Check Point מגייסת מהנדסי אבטחה, עדיפות לבעלי רקע מודיעיני. קישור בתגובות.`,
    time: "לפני 5 שעות",
    replies: [
      {
        id: "r1",
        author: "נועם ש.",
        serviceYears: "2008–2012",
        content: "Palo Alto Networks גם מגייסת. יש לי קשר שם, מי שרוצה שישלח לי פרטים.",
        time: "לפני 4 שעות",
      },
      {
        id: "r2",
        author: "תמר ג.",
        serviceYears: "2015–2019",
        content: "Wiz גדלה מהר מאוד ומחפשת אנשים. רקע ביחידות לחימה מתקבל יפה אצלם.",
        time: "לפני 3 שעות",
      },
    ],
  },
  "3": {
    id: "3",
    title: "מי יוצא לריצה קבוצתית השישי הקרוב?",
    category: "חברתי",
    author: "נועם ש.",
    serviceYears: "2008–2012",
    content: `מתכנן ריצה של 10 ק"מ בירקון, 7 בבוקר. מי מצטרף?

המסלול: שדרות נורדאו → פארק הירקון → חזרה.
אחרי הריצה יש קפה ביחד בנמל.

אנא אשרו כאן כדי שאדע כמה אנשים מגיעים.`,
    time: "אתמול",
    replies: [
      {
        id: "r1",
        author: "אלון כ.",
        serviceYears: "2012–2016",
        content: "מגיע! נ.ב — אפשר גם 8 ק\"מ למי שלא בכושר 😄",
        time: "אתמול",
      },
    ],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  "כללי": "bg-blue-100 text-blue-700",
  "מקצועי": "bg-green-100 text-green-700",
  "חברתי": "bg-purple-100 text-purple-700",
  "ציוד ומילואים": "bg-orange-100 text-orange-700",
};

function ForumPostContent() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingReply, setDeletingReply] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<Profile> | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const id = params.id as string;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setCurrentUser(profile);
      }

      const { data: dbPost } = await supabase
        .from("forum_posts")
        .select("*, author:profiles(full_name, service_years)")
        .eq("id", id)
        .single();

      if (dbPost) {
        const { data: dbReplies } = await supabase
          .from("forum_replies")
          .select("*, author:profiles(full_name, service_years)")
          .eq("post_id", id)
          .order("created_at");

        const authorProfile = Array.isArray(dbPost.author) ? dbPost.author[0] : dbPost.author;
        setPost({
          id: dbPost.id,
          author_id: dbPost.author_id,
          title: dbPost.title,
          category: dbPost.category as Category,
          author: authorProfile?.full_name || "חבר",
          serviceYears: authorProfile?.service_years || "",
          content: dbPost.content,
          time: new Date(dbPost.created_at).toLocaleDateString("he-IL"),
        });
        setReplies(
          (dbReplies || []).map((r) => {
            const rAuthor = Array.isArray(r.author) ? r.author[0] : r.author;
            return {
              id: r.id,
              author_id: r.author_id,
              author: rAuthor?.full_name || "חבר",
              serviceYears: rAuthor?.service_years || "",
              content: r.content,
              time: new Date(r.created_at).toLocaleDateString("he-IL"),
            };
          })
        );

        // Subscribe to real-time reply inserts
        channelRef.current = supabase
          .channel(`forum_replies:${id}`)
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "forum_replies", filter: `post_id=eq.${id}` },
            async (payload) => {
              const r = payload.new as { id: string; author_id: string; content: string; created_at: string };
              const { data: rProfile } = await supabase
                .from("profiles")
                .select("full_name, service_years")
                .eq("id", r.author_id)
                .single();
              setReplies((prev) => {
                if (prev.some((x) => x.id === r.id)) return prev;
                return [
                  ...prev,
                  {
                    id: r.id,
                    author_id: r.author_id,
                    author: rProfile?.full_name || "חבר",
                    serviceYears: rProfile?.service_years || "",
                    content: r.content,
                    time: new Date(r.created_at).toLocaleDateString("he-IL"),
                  },
                ];
              });
            }
          )
          .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "forum_replies", filter: `post_id=eq.${id}` },
            (payload) => {
              const deleted = payload.old as { id: string };
              setReplies((prev) => prev.filter((r) => r.id !== deleted.id));
            }
          )
          .subscribe();

        return;
      }

      // Fall back to mock data
      const mockPost = MOCK_POSTS[id];
      if (!mockPost) {
        router.replace("/forum");
        return;
      }
      setIsMockData(true);
      setPost(mockPost);
      setReplies(mockPost.replies);
    }
    load();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [params.id]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!newReply.trim() || !post) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user && !isMockData) {
        await supabase
          .from("forum_replies")
          .insert({ post_id: post.id, author_id: user.id, content: newReply.trim() });
        // Real-time channel will append the reply
      } else {
        setReplies((prev) => [
          ...prev,
          {
            id: `new-${Date.now()}`,
            author_id: currentUserId || undefined,
            author: currentUser?.full_name || "חבר",
            serviceYears: currentUser?.service_years || "",
            content: newReply.trim(),
            time: "עכשיו",
          },
        ]);
      }
    } finally {
      setNewReply("");
      setSubmitting(false);
    }
  }

  async function handleDeletePost() {
    if (!post || !window.confirm("למחוק את הפוסט? הפעולה אינה הפיכה.")) return;
    setDeletingPost(true);
    await supabase.from("forum_posts").delete().eq("id", post.id);
    router.replace("/forum");
  }

  async function handleDeleteReply(replyId: string) {
    setDeletingReply(replyId);
    await supabase.from("forum_replies").delete().eq("id", replyId);
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
    setDeletingReply(null);
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "64px" }}>
        <div className="w-10 h-10 border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const canDeletePost = !isMockData && (isAdmin || post.author_id === currentUserId);

  return (
    <div className="min-h-screen bg-gray-light" style={{ paddingTop: "64px" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1a2e1a" }} className="hero-texture py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/forum" className="inline-flex items-center gap-1 text-gray-400 hover:text-green-light text-sm mb-5 transition-colors">
            <ArrowRight size={14} />
            חזרה לפורום
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
              {post.category}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-rubik font-black text-2xl sm:text-3xl text-white mb-3">{post.title}</h1>
            {canDeletePost && (
              <button
                onClick={handleDeletePost}
                disabled={deletingPost}
                title="מחק פוסט"
                className="shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors disabled:opacity-50"
              >
                {deletingPost ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-green-mid flex items-center justify-center text-white text-xs font-bold">
                {post.author[0]}
              </div>
              {post.author}
              {post.serviceYears && <span className="text-gray-500">| {post.serviceYears}</span>}
            </div>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.time}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={11} />
              {replies.length} תגובות
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Post body */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{post.content}</p>
        </div>

        {/* Replies */}
        <div className="mb-6">
          <h2 className="font-rubik font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-green-mid" />
            תגובות ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p>אין תגובות עדיין. היה הראשון להגיב!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => {
                const canDeleteReply = !isMockData && (isAdmin || reply.author_id === currentUserId);
                return (
                  <div
                    key={reply.id}
                    className="bg-white rounded-2xl shadow-sm p-5 border-r-4 border-r-green-pale"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-pale flex items-center justify-center text-green-dark text-sm font-bold">
                          {reply.author[0]}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{reply.author}</span>
                          {reply.serviceYears && (
                            <span className="text-xs text-gray-400 mr-1.5">| {reply.serviceYears}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} />
                          {reply.time}
                        </span>
                        {canDeleteReply && (
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            disabled={deletingReply === reply.id}
                            title="מחק תגובה"
                            className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {deletingReply === reply.id ? (
                              <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reply form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-rubik font-bold text-base text-gray-900 mb-4">הוסף תגובה</h3>
          <form onSubmit={handleReply} className="space-y-4">
            <textarea
              rows={4}
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="כתוב את תגובתך כאן..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark resize-none"
              required
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">תגובות גלויות לכל חברי העמותה המאושרים</p>
              <button
                type="submit"
                disabled={submitting || !newReply.trim()}
                className="flex items-center gap-2 bg-green-dark text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-mid transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                שלח תגובה
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ForumPostPage() {
  return (
    <PrivateRoute>
      <ForumPostContent />
    </PrivateRoute>
  );
}
