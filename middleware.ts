import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("closeflow_auth")?.value;
  const { pathname } = req.nextUrl;

  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/api/auth") || pathname.startsWith("/api/locale") || pathname.startsWith("/_next") || pathname === "/favicon.ico";
  if (isPublic) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!api/auth|_next/static|_next/image).*)"] };
