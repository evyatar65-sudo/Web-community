import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "כל השדות הם חובה" }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 });
    }

    // In production: send via Resend, SendGrid, or Supabase Edge Functions
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@sayeret-nachal.org.il',
    //   to: 'info@sayeret-nachal.org.il',
    //   subject: `פנייה חדשה: ${subject}`,
    //   html: `<p>מאת: ${name} (${email})</p><p>${message}</p>`
    // });

    console.log("Contact form submission:", { name, email, subject, message: message.slice(0, 100) });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
