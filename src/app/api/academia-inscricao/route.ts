import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { level, name, contact } = await req.json();

  if (!level || !name || !contact) {
    return NextResponse.json({ error: "Campos em falta." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error: dbError } = await supabase
    .from("academia_inscricoes")
    .insert({ level, name, contact });

  if (dbError) {
    console.error("Erro ao gravar inscrição:", dbError);
    return NextResponse.json({ error: "Não foi possível enviar a inscrição." }, { status: 500 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
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
    } catch (err) {
      // A inscrição já ficou gravada — o email é só uma notificação extra.
      console.error("Erro ao enviar email de inscrição:", err);
    }
  } else {
    console.warn("SMTP não configurado — inscrição gravada, sem email de notificação.");
  }

  return NextResponse.json({ ok: true });
}
