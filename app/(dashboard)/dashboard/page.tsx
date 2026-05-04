"use client";

import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { useGetDashboardStatsQuery } from "@/redux/features/stats/statsApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  Calculator,
  DollarSign,
  Gift,
  LayoutGrid,
  MapPin,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function Page() {
  const { data: response, isLoading, isError } = useGetDashboardStatsQuery();
  const { data: profileRes } = useGetProfileQuery({});

  console.log(profileRes);

  const stats = response?.data?.stats;
  const recentActivity = response?.data?.recentActivity || [];

  const statsData = [
    {
      label: "Total Maps",
      value: stats?.totalMaps?.toString() || "0",
      icon: <LayoutGrid size={24} />,
      iconBgColor: "bg-blue-500",
    },
    {
      label: "Total Places",
      value: stats?.totalPlaces?.toString() || "0",
      icon: <MapPin size={24} />,
      iconBgColor: "bg-green-500",
    },
    {
      label: "Active Offers",
      value: stats?.activeOffers?.toString() || "0",
      icon: <Gift size={24} />,
      iconBgColor: "bg-purple-500",
    },
    {
      label: "Total Sales",
      value: stats?.totalSales ? `$${stats.totalSales.toLocaleString()}` : "$0",
      icon: <DollarSign size={24} />,
      iconBgColor: "bg-yellow-500",
    },
    {
      label: "This Month Revenue",
      value: stats?.thisMonthRevenue
        ? `$${stats.thisMonthRevenue.toLocaleString()}`
        : "$0",
      icon: <TrendingUp size={24} />,
      iconBgColor: "bg-pink-500",
    },
    {
      label: "Taxes Collected",
      value: stats?.taxesCollected
        ? `$${stats.taxesCollected.toLocaleString()}`
        : "$0",
      icon: <Calculator size={24} />,
      iconBgColor: "bg-indigo-500",
    },
  ];

  const mapEditorStats = [
    {
      label: "Total Maps",
      value: stats?.totalMaps?.toString() || "0",
      icon: <LayoutGrid size={24} />,
      iconBgColor: "bg-blue-500",
    },
    {
      label: "Total Places",
      value: stats?.totalPlaces?.toString() || "0",
      icon: <MapPin size={24} />,
      iconBgColor: "bg-green-500",
    },
    {
      label: "Active Offers",
      value: stats?.activeOffers?.toString() || "0",
      icon: <Gift size={24} />,
      iconBgColor: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-arial pb-6">Dashboard Overview</h1>

      {profileRes?.role === "map_editor" ? (
        <StatCard data={mapEditorStats} />
      ) : (
        <StatCard data={statsData} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
