"use client";

interface Stat {
  title: string;
  value: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

const stats: Stat[] = [
  { title: "Pending", value: 12, change: "+2%", changeType: "positive" },
  { title: "Needs Changes", value: 4, change: "0%", changeType: "neutral" },
  { title: "Approved Today", value: 3, change: "-5%", changeType: "negative" },
  { title: "Rejected", value: 1, change: "-1%", changeType: "negative" },
];

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function BusinessStats() {
  const { t } = useLanguage();

  const stats: (Stat & { key: string })[] = [
    { title: t("business_admin.pending"), key: "pending", value: 12, change: "+2%", changeType: "positive" },
    { title: t("business_admin.needs_changes") || "Needs Changes", key: "needs_changes", value: 4, change: "0%", changeType: "neutral" },
    { title: t("business_admin.approved_today") || "Approved Today", key: "approved_today", value: 3, change: "-5%", changeType: "negative" },
    { title: t("business_admin.rejected") || "Rejected", key: "rejected", value: 1, change: "-1%", changeType: "negative" },
  ];

  const getColor = (type: Stat["changeType"]) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-700";
      case "negative":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="bg-white border border-gray-200 rounded-lg p-5"
        >
          <p className="text-sm text-gray-500">{stat.title}</p>

          <div className="flex items-center gap-3 mt-2">
            <h2 className="text-2xl font-semibold">{stat.value}</h2>

            <span
              className={`text-xs px-2 py-1 rounded ${getColor(
                stat.changeType,
              )}`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
