import type { Metadata } from "next";
import TeacherPortal, { type PortalTeacher } from "@/components/admin/pt/TeacherPortal";
import { getPtSession } from "@/lib/pt-session";
import { listTeachers } from "@/lib/pt-service";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Professores",
  robots: { index: false, follow: false },
};

/** Área dos professores: login partilhado → "quem és tu?" → calendário das aulas e PTs. */
export default async function ProfessoresPage({ searchParams }: PageProps<"/admin/professores">) {
  const session = await getPtSession();
  if (!session) return <TeacherPortal step="login" />;

  const changing = (await searchParams).quem === "1";
  if (session.name && !changing) return <TeacherPortal step="calendar" name={session.name} />;

  let teachers: PortalTeacher[] = [];
  let error: string | null = null;
  try {
    teachers = (await listTeachers(getSupabaseAdmin()))
      .filter((t) => t.active)
      .map(({ id, name, color, kind }) => ({ id, name, color, kind }));
  } catch (e) {
    error = e instanceof Error ? e.message : "Não foi possível carregar os professores.";
  }
  return <TeacherPortal step="who" teachers={teachers} error={error} />;
}
