import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { level, name, contact } = await req.json();

  if (!level || !name || !contact) {
    return NextResponse.json({ error: "Campos em falta." }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error("SMTP não configurado: faltam variáveis de ambiente.");
    return NextResponse.json(
      { error: "Envio de email não está configurado no servidor." },
      { status: 500 }
    );
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
      replyTo: SMTP_USER,
      subject: `Inscrição Academia — ${name}`,
      text: `Nível: ${level}\nNome: ${name}\nContacto: ${contact}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao enviar email de inscrição:", err);
    return NextResponse.json({ error: "Não foi possível enviar a inscrição." }, { status: 500 });
  }
}
