import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  const parsed = ContactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  await sendMail({
    to: process.env.SMTP_FROM || "zentaratravel@gmail.com",
    subject: `Contact from ${name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
