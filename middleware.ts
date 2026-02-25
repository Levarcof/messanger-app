import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/";
  const isProtectedRoute =
    pathname.startsWith("/users") ||
    pathname.startsWith("/conversations");

  // 🔴 If NOT logged in and trying to access protected route
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🟢 If logged in and trying to access login page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/users", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/users/:path*", "/conversations/:path*"],
};