import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, phone, email, message } = await req.json();

  if (!name || !phone || !email || !message) {
    return NextResponse.json({ error: "Campos em falta." }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP não configurado — mensagem de contacto não enviada.");
    return NextResponse.json({ error: "Não foi possível enviar a mensagem." }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Site BLOKO" <${SMTP_USER}>`,
      to: SMTP_TO || SMTP_USER,
      replyTo: email,
      subject: `NOVA MENSAGEM WEBSITE BLOKO`,
      text: `Nome: ${name}\nTelefone: ${phone}\nEmail: ${email}\n\nMensagem:\n${message}`,
    });
  } catch (err) {
    console.error("Erro ao enviar mensagem de contacto:", err);
    return NextResponse.json({ error: "Não foi possível enviar a mensagem." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
