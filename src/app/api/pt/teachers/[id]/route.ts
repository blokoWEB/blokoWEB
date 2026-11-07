import { updateTeacher } from "@/lib/pt-service";
import { readJson, withPtAdmin } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, ctx: RouteContext<"/api/pt/teachers/[id]">) {
  const { id } = await ctx.params;
  const body = await readJson(request);
  return withPtAdmin(async (sb) => ({ teacher: await updateTeacher(sb, id, body) }));
}
