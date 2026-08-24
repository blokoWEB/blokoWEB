import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;

  let authenticated = false;
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      authenticated = true;
    } catch {
      authenticated = false;
    }
  }

  if (!authenticated) {
    const url = new URL("/admin", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
