import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const CONTACT_INBOX = 'afaqteam12@gmail.com';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof message !== 'string' || !message.trim()
    ) {
      return NextResponse.json({ error: 'الرجاء تعبئة جميع الحقول.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured.');
      return NextResponse.json(
        { error: 'خدمة الإرسال غير مُفعّلة حاليًا. الرجاء المحاولة لاحقًا.' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'نموذج تواصل AFAQ <onboarding@resend.dev>',
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `رسالة جديدة من ${name} — نموذج التواصل`,
      text: `الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'تعذّر إرسال الرسالة. حاول مرة أخرى.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'حدث خطأ غير متوقع.' }, { status: 500 });
  }
}
