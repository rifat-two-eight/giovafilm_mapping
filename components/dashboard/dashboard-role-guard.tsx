"use client";

import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  isAdminOnlyDashboardPath,
  isDashboardRole,
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
  const { data: user, isLoading, isError } = useGetProfileQuery({});

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      router.replace("/login");
      return;
    }

    if (!isDashboardRole(user.role)) {
      router.replace("/");
      return;
    }

    if (
      user.role === "map_editor" &&
      isAdminOnlyDashboardPath(pathname)
    ) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, isError, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Checking access...
      </div>
    );
  }

  if (!isDashboardRole(user.role)) {
    return null;
  }

  if (
    user.role === "map_editor" &&
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
