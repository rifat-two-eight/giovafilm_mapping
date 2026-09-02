import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const dashboardRoutes = ["/dashboard"];

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

const guestAllowedExact = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/otp-verify",
  "/reset-password",
  "/privacy-policy",
  "/terms-of-service",
  "/success",
  "/cancel",
  "/claim-promo",
]);

function isAdminOnlyDashboardPath(pathname: string): boolean {
  return adminOnlyDashboardPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function safeInternalPath(pathname: string, search: string): string {
  const next = `${pathname}${search || ""}`;
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;
  const loggedInFlag = request.cookies.get("loggedIn")?.value === "1";
  const isLoggedIn = Boolean(accessToken || loggedInFlag || userRole);

  const isGuestAllowed =
    guestAllowedExact.has(pathname) ||
    pathname === "/catalog" ||
    pathname.startsWith("/catalog/") ||
    pathname === "/claim-promo" ||
    pathname.startsWith("/claim-promo");

  if (!isLoggedIn && !isGuestAllowed) {
    const loginRequiredFlag = request.nextUrl.searchParams.get("loginRequired") === "1";
    if (loginRequiredFlag) {
      return NextResponse.next();
    }

    const isDashboardRoute = pathname.startsWith("/dashboard");
    if (isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", safeInternalPath(pathname, search));
      return NextResponse.redirect(loginUrl);
    }

    const targetUrl = new URL(request.url);
    targetUrl.searchParams.set("loginRequired", "1");
    targetUrl.searchParams.set("redirect", safeInternalPath(pathname, search));
    return NextResponse.redirect(targetUrl);
  }

  const isDashboardRoute = dashboardRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isDashboardRoute && isLoggedIn) {
    const role = (userRole || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
    const isDashboardRole =
      role === "admin" ||
      role === "map_editor" ||
      role === "superadmin" ||
      role === "super_admin";

    if (!isDashboardRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "map_editor" && isAdminOnlyDashboardPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
