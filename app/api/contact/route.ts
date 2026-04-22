import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "כל השדות הם חובה" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({ name, email, subject, message });

    if (error) {
      console.error("Contact insert error:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
