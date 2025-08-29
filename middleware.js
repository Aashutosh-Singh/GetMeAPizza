// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow the following paths without auth
  const publicPaths = [
    "/login",
    "/signup",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify",
    "/info"
  ];

  if (
    token ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
   
    
    publicPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Redirect to login if trying to access a protected route
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes except explicitly public
export const config = {
  matcher: [
    // Run on all routes except NEXT internals, static, favicon etc.
    "/((?!_next/static|_next/image|pizza.png|logo.png).*)",
  ],
};
