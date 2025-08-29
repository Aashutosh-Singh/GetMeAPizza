// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Allow homepage
  if (pathname === "/") {
    return NextResponse.next();
  }

  // ✅ Allow all files from /public (anything with an extension like .png, .jpg, .css, .js, etc.)
  if (/\.(.*)$/.test(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow these public paths
  const publicPaths = [
    "/login",
    "/signup",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify",
    "/info",
  ];
  if (
    token ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    publicPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // ❌ Redirect to login if trying to access a protected route
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // run middleware on everything except Next internals
    "/((?!_next).*)",
  ],
};
