import { removeStudent, updateStudent } from "@/lib/pt-service";
import { readJson, scopeOf, withPtUser } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

/** Marcar presença (`attended`) ou corrigir o nome (`name`). */
export async function PATCH(request: Request, ctx: RouteContext<"/api/pt/students/[id]">) {
  const { id } = await ctx.params;
  const body = await readJson(request);
  return withPtUser(async (sb, actor) => ({
    sessions: await updateStudent(sb, id, { attended: body.attended, name: body.name }, actor),
  }));
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/pt/students/[id]">) {
  const { id } = await ctx.params;
  const scope = scopeOf(new URL(request.url).searchParams.get("scope"));
  return withPtUser(async (sb, actor) => ({ sessions: await removeStudent(sb, id, scope, actor) }));
}
