export type AppRole = "user" | "map_editor" | "admin" | "super_admin";

export const ADMIN_ROLES: AppRole[] = ["admin", "super_admin"];
export const DASHBOARD_ROLES: AppRole[] = [
  "admin",
  "super_admin",
  "map_editor",
];

/** Routes map_editor must NOT open (admin/super_admin only) */
export const ADMIN_ONLY_DASHBOARD_PREFIXES = [
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

export function isAdminRole(role?: string | null): boolean {
  return role === "admin" || role === "super_admin";
}

export function isDashboardRole(role?: string | null): boolean {
  return (
    role === "admin" || role === "super_admin" || role === "map_editor"
  );
}

/** Roles the actor is allowed to invite / assign */
export function assignableRolesFor(actorRole?: string | null): AppRole[] {
  if (actorRole === "super_admin") {
    return ["user", "map_editor", "admin", "super_admin"];
  }
  if (actorRole === "admin") {
    // Admin cannot create or promote to super_admin
    return ["user", "map_editor", "admin"];
  }
  return [];
}

export function canManageUserRole(
  actorRole?: string | null,
  targetRole?: string | null,
): boolean {
  if (!actorRole || !targetRole) return false;
  if (actorRole === "super_admin") return true;
  if (actorRole === "admin") {
    // Admin cannot manage super_admins
    return targetRole !== "super_admin";
  }
  return false;
}

/** Who can soft-delete another account from Users & Roles */
export function canDeleteUser(
  actorRole?: string | null,
  targetRole?: string | null,
): boolean {
  if (!actorRole || !targetRole) return false;
  // Never delete super_admin via this UI
  if (targetRole === "super_admin") return false;
  if (actorRole === "super_admin") {
    // Super admin may delete user / map_editor / admin
    return true;
  }
  if (actorRole === "admin") {
    // Admin may delete user / map_editor only (not other admins)
    return targetRole === "user" || targetRole === "map_editor";
  }
  return false;
}

export function isAdminOnlyDashboardPath(pathname: string): boolean {
  return ADMIN_ONLY_DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
