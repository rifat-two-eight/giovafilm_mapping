import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/for-business"];

// Define routes that require admin or super admin roles
const adminRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // 1. Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute && accessToken) {
    const isAdmin =
      userRole === "admin" ||
      userRole === "superadmin" ||
      userRole === "super_admin";

    if (!isAdmin) {
      // If user is logged in but not an admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Check for 'for-business' route (only for 'business' role)
  if (pathname.startsWith("/for-business") && accessToken) {
    if (userRole !== "business") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Config to match only relevant paths for performance
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/for-business/:path*"],
};
