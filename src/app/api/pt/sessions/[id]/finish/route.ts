import { finish } from "@/lib/pt-service";
import { readJson, withPtUser } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

/** "Terminou": sem `student`, a série acaba; com `student`, esse aluno sai desta aula e das seguintes. */
export async function POST(request: Request, ctx: RouteContext<"/api/pt/sessions/[id]/finish">) {
  const { id } = await ctx.params;
  const body = await readJson(request);
  return withPtUser(async (sb, actor) => ({ sessions: await finish(sb, id, { student: body.student }, actor) }));
}
