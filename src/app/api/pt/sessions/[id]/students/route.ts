import { addStudent } from "@/lib/pt-service";
import { readJson, scopeOf, withPtUser } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

export async function POST(request: Request, ctx: RouteContext<"/api/pt/sessions/[id]/students">) {
  const { id } = await ctx.params;
  const body = await readJson(request);
  return withPtUser(async (sb, actor) => addStudent(sb, id, body.name, scopeOf(body.scope), actor), 201);
}
