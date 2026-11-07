import { createTeacher, listTeachers } from "@/lib/pt-service";
import { readJson, withPtAdmin, withPtUser } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

/** A lista de professores vê-se também na área dos professores; criar/editar é só da administração. */
export async function GET() {
  return withPtUser(async (sb) => ({ teachers: await listTeachers(sb) }));
}

export async function POST(request: Request) {
  const body = await readJson(request);
  return withPtAdmin(async (sb) => ({ teacher: await createTeacher(sb, body) }), 201);
}
