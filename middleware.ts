import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/for-business"];

// Define routes that require dashboard roles
const dashboardRoutes = ["/dashboard"];

/** Admin-only dashboard sections (map_editor blocked) */
const adminOnlyDashboardPrefixes = [
  "/dashboard/users-roles",
  "/dashboard/categories",
  "/dashboard/business",
  "/dashboard/rewards",
  "/dashboard/reviews-verification",
  "/dashboard/reports",
  "/dashboard/settings",
  "/dashboard/subscription",
  "/dashboard/notification",
];

function isAdminOnlyDashboardPath(pathname: string): boolean {
  return adminOnlyDashboardPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isDashboardRoute = dashboardRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isDashboardRoute && accessToken) {
    const isDashboardRole =
      userRole === "admin" ||
      userRole === "map_editor" ||
      userRole === "superadmin" ||
      userRole === "super_admin";

    if (!isDashboardRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // map_editor cannot open admin-only sections via direct URL
    if (userRole === "map_editor" && isAdminOnlyDashboardPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Config to match only relevant paths for performance
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/for-business/:path*"],
};
