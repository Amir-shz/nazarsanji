import { cookies } from "next/headers";
import { decrypt } from "./lib/session";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!payload?.username)
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
