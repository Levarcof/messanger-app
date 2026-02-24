import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/users") ||
    pathname.startsWith("/conversations");

  // If user is not authenticated and trying to access protected route
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*", "/conversations/:path*"],
};