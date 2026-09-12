"use client";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function RolePermissions(): React.ReactElement {
  const { t } = useLanguage();

  const rolePermissions = [
    {
      role: t("users_admin.owner_role"),
      description: t("users_admin.owner_desc"),
    },
    {
      role: t("users_admin.administrator_role"),
      description: t("users_admin.administrator_desc"),
    },
    {
      role: t("users_admin.map_editor_role"),
      description: t("users_admin.map_editor_desc"),
    },
  ];

  return (
    <Card className="p-6 bg-white border border-gray-200 gap-4">
      <h2 className="text-xl font-bold text-gray-900 ">{t("users_admin.role_permissions_title")}</h2>

      <div className="space-y-4">
        {rolePermissions.map((permission) => (
          <div
            key={permission.role}
            className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
          >
            <p className="font-semibold text-gray-900 mb-2">
              {permission.role}:
            </p>
            <p className="text-gray-600 text-sm">{permission.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

