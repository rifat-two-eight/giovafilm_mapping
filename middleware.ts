import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that require authentication
const protectedRoutes = ["/dashboard", "/profile"];

// Define routes that require admin or super admin roles
const adminRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // 1. Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    // We can pass a message or redirect back URL if needed
    // loginUrl.searchParams.set("message", "Login Required");
    return NextResponse.redirect(loginUrl);
  }

  // 2. Check for role-based access to dashboard
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute && accessToken) {
    const isAdmin =
      userRole === "admin" ||
      userRole === "superadmin" ||
      userRole === "super admin";

    if (!isAdmin) {
      // If user is logged in but not an admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Config to match only relevant paths for performance
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
