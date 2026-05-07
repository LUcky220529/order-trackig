import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes, but allow /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin-auth");

    if (!token || token.value !== "true") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // NextAuth handles protecting /dashboard automatically if configured, 
  // but to be explicit for the dashboard directory:
  if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/login")) {
    const sessionToken = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
