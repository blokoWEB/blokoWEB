import { getLog } from "@/lib/pt-service";
import { withPtUser } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: RouteContext<"/api/pt/sessions/[id]/log">) {
  const { id } = await ctx.params;
  return withPtUser(async (sb) => ({ log: await getLog(sb, id) }));
}
