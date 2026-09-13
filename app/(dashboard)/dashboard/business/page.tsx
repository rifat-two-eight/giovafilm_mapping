"use client";

import { BusinessStats } from "@/components/dashboard/business/business-stats";
import { BusinessTable } from "@/components/dashboard/business/business-table";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-100 min-h-screen ">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800  mb-6">{t("business_admin.title")}</h1>

      <BusinessStats />
      {/* Table */}
      <BusinessTable />
    </div>
  );
}

