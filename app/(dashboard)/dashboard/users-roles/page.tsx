"use client";

import { InviteUserForm } from "@/components/dashboard/users-roles/invite-user-form";
import { RolePermissions } from "@/components/dashboard/users-roles/role-permissions";
import { UsersTable } from "@/components/dashboard/users-roles/users-table";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Plus } from "lucide-react";

export default function Page() {
  const { t } = useLanguage();

  return (
    <div className=" min-h-screen ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{t("users_admin.role_permissions_title")}</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          <RolePermissions />
          <InviteUserForm />
        </div>
        <UsersTable />
      </div>
    </div>
  );
}

