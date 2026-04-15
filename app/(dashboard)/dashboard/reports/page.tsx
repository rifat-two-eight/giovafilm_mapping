"use client";

import SalesTaxes from "@/components/dashboard/reports/sales-taxes";
import { UsageStatistics } from "@/components/dashboard/reports/usage-statistics";
import { useGetReportsQuery } from "@/redux/features/stats/statsApi";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const { data: response, isLoading, isError } = useGetReportsQuery();
  
  const reportData = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-red-500 font-medium text-center p-6">
        <p>Failed to load reports data.</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center gap-2 font-medium">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 font-geist">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reports & Insights
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time business performance and platform usage statistics.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <SalesTaxes data={reportData?.salesAndTaxes} />
        <UsageStatistics data={reportData?.usage} />
      </div>
    </div>
  );
}
