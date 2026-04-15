import { Calendar, Download } from "lucide-react";
import { SalesTaxesChart } from "./sales-taxes-chart";
import { Button } from "@/components/ui/button";

interface SalesTaxesData {
  totalSales: number;
  taxesCollected: number;
  netRevenue: number;
  monthlyData: any[];
}

export default function SalesTaxes({ data }: { data?: SalesTaxesData }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Sales & Taxes</h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Date range"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
          <p className="text-sm font-semibold text-blue-600 mb-1 uppercase tracking-wider">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">${data?.totalSales?.toLocaleString() || "0"}</p>
        </div>
        <div className="bg-green-50/50 rounded-xl p-6 border border-green-100">
          <p className="text-sm font-semibold text-green-600 mb-1 uppercase tracking-wider">Taxes Collected</p>
          <p className="text-2xl font-bold text-gray-900">${data?.taxesCollected?.toLocaleString() || "0"}</p>
        </div>
        <div className="bg-purple-50/50 rounded-xl p-6 border border-purple-100">
          <p className="text-sm font-semibold text-purple-600 mb-1 uppercase tracking-wider">Net Revenue</p>
          <p className="text-2xl font-bold text-gray-900">${data?.netRevenue?.toLocaleString() || "0"}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
        <SalesTaxesChart data={data?.monthlyData || []} />
      </div>
    </div>
  );
}
