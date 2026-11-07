import { setStatus, updateSession, type UpdateInput } from "@/lib/pt-service";
import { readJson, scopeOf, withPtUser } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

/** Alterar uma aula (dia/hora, duração, máx. de alunos, notas, professor) ou cancelá-la/repô-la (`status`). */
export async function PATCH(request: Request, ctx: RouteContext<"/api/pt/sessions/[id]">) {
  const { id } = await ctx.params;
  const body = await readJson(request);
  const scope = scopeOf(body.scope);
  return withPtUser(async (sb, actor) => {
    if (body.status === "cancelada" || body.status === "agendada") {
      return { sessions: await setStatus(sb, id, body.status, scope, actor) };
    }
    return { sessions: await updateSession(sb, id, { ...(body as UpdateInput), scope }, actor) };
  });
}
