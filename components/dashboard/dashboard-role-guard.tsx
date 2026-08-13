"use client";

import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  selectAccessToken,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";
import {
  isAdminOnlyDashboardPath,
  isDashboardRole,
  normalizeRole,
} from "@/lib/roles";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Enforces dashboard access by role:
 * - user → home
 * - map_editor → cannot open admin-only sections
 * - admin / super_admin → full dashboard
 */
export function DashboardRoleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAppSelector(selectAccessToken);
  const authUser = useAppSelector(selectCurrentUser);
  const { data: profile, isLoading, isError } = useGetProfileQuery(
    {},
    { skip: !accessToken },
  );

  const role = profile?.role || authUser?.role;

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }

    if (isLoading && !authUser) return;

    if (isError && !authUser) {
      router.replace("/login");
      return;
    }

    if (role && !isDashboardRole(role)) {
      router.replace("/");
      return;
    }

    if (
      normalizeRole(role) === "map_editor" &&
      isAdminOnlyDashboardPath(pathname)
    ) {
      router.replace("/dashboard");
    }
  }, [accessToken, authUser, role, isLoading, isError, pathname, router]);

  if (!accessToken || (isLoading && !authUser)) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Checking access...
      </div>
    );
  }

  if (role && !isDashboardRole(role)) {
    return null;
  }

  if (
    normalizeRole(role) === "map_editor" &&
    isAdminOnlyDashboardPath(pathname)
  ) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Redirecting...
      </div>
    );
  }

  return <>{children}</>;
}
