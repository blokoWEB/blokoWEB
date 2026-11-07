import { createSessions, listSessions, type CreateInput } from "@/lib/pt-service";
import { readJson, withPtUser } from "@/lib/pt-route";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  return withPtUser(async (sb) => ({ sessions: await listSessions(sb, from, to) }));
}

export async function POST(request: Request) {
  const body = (await readJson(request)) as CreateInput;
  return withPtUser(async (sb, actor) => ({ sessions: await createSessions(sb, body, actor) }), 201);
}
