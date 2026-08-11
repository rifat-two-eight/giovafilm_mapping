"use client";

import { useState } from "react";
import SalesTaxes from "@/components/dashboard/reports/sales-taxes";
import { UsageStatistics } from "@/components/dashboard/reports/usage-statistics";
import { useGetReportsQuery } from "@/redux/features/stats/statsApi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetAvailableCountriesQuery } from "@/redux/features/map/mapApi";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

  // Fetch available filter lists from API
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const { data: countriesResponse } = useGetAvailableCountriesQuery(undefined);

  // Fetch reports stats with applied filters
  const { data: response, isLoading, isError, refetch, isFetching } = useGetReportsQuery(
    {
      timeFilter,
      country,
      category,
    },
    { refetchOnMountOrArgChange: true }
  );
  
  const reportData = response?.data;

  const handleResetFilters = () => {
    setTimeFilter("");
    setCountry("");
    setCategory("");
  };

  // ==================== EXPORTS IMPLEMENTATION ====================
  const handleExportCSV = () => {
    if (!reportData) return;
    
    // Construct CSV file
    let csvContent = "";
    
    // 1. Sales Summary
    csvContent += "SALES & TAXES SUMMARY\n";
    csvContent += `Total Sales,Taxes Collected,Net Revenue\n`;
    csvContent += `"${reportData.salesAndTaxes?.totalSales}","${reportData.salesAndTaxes?.taxesCollected}","${reportData.salesAndTaxes?.netRevenue}"\n\n`;
    
    // 2. Monthly Breakdown
    csvContent += "MONTHLY BREAKDOWN\n";
    csvContent += "Month,Total Sales,Taxes,Net Revenue\n";
    reportData.salesAndTaxes?.monthlyData?.forEach((item: any) => {
      csvContent += `"${item.month}","${item.totalSales}","${item.taxes}","${item.netRevenue}"\n`;
    });
    csvContent += "\n";
    
    // 3. Usage Lists
    csvContent += "USAGE STATISTICS - TOP VIEWED MAPS\n";
    csvContent += "Map Name,Views\n";
    reportData.usage?.mostViewedMaps?.forEach((item: any) => {
      csvContent += `"${item.name}","${item.count}"\n`;
    });
    csvContent += "\n";

    csvContent += "USAGE STATISTICS - TOP OPENED PLACES\n";
    csvContent += "Place Name,Opens\n";
    reportData.usage?.mostOpenedPlaces?.forEach((item: any) => {
      csvContent += `"${item.name}","${item.count}"\n`;
    });
    csvContent += "\n";

    csvContent += "USAGE STATISTICS - TOP REDEEMED OFFERS\n";
    csvContent += "Offer Title,Redemptions\n";
    reportData.usage?.mostRedeemedOffers?.forEach((item: any) => {
      csvContent += `"${item.name}","${item.count}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reports_and_insights_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!reportData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>Reports & Insights - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: sans-serif; color: #333; padding: 40px; line-height: 1.6; }
            h1 { font-size: 24px; color: #111; margin-bottom: 5px; }
            .subtitle { font-size: 14px; color: #666; margin-bottom: 30px; }
            .section { margin-bottom: 40px; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #eaeaea; padding-bottom: 8px; margin-bottom: 20px; color: #1e3a8a; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
            .card-title { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 5px; }
            .card-value { font-size: 24px; font-weight: bold; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 14px; }
            th { background-color: #f1f5f9; color: #475569; font-weight: bold; }
            .row-flex { display: flex; gap: 30px; }
            .col { flex: 1; }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Reports & Insights Summary</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>

          <div class="section">
            <div class="section-title">Sales & Taxes</div>
            <div class="grid">
              <div class="card">
                <div class="card-title">Total Sales</div>
                <div class="card-value">$${reportData.salesAndTaxes?.totalSales?.toLocaleString()}</div>
              </div>
              <div class="card">
                <div class="card-title">Taxes Collected</div>
                <div class="card-value">$${reportData.salesAndTaxes?.taxesCollected?.toLocaleString()}</div>
              </div>
              <div class="card">
                <div class="card-title">Net Revenue</div>
                <div class="card-value">$${reportData.salesAndTaxes?.netRevenue?.toLocaleString()}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Sales</th>
                  <th>Taxes</th>
                  <th>Net Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.salesAndTaxes?.monthlyData?.map((item: any) => `
                  <tr>
                    <td>${item.month}</td>
                    <td>$${item.totalSales?.toLocaleString()}</td>
                    <td>$${item.taxes?.toLocaleString()}</td>
                    <td>$${item.netRevenue?.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Platform Usage Statistics</div>
            <div class="row-flex">
              <div class="col">
                <h3>Most Viewed Maps</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Map Name</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reportData.usage?.mostViewedMaps?.map((item: any) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.count?.toLocaleString()}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="2">No data</td></tr>'}
                  </tbody>
                </table>
              </div>

              <div class="col">
                <h3>Most Opened Places</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Place Name</th>
                      <th>Opens</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reportData.usage?.mostOpenedPlaces?.map((item: any) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.count?.toLocaleString()}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="2">No data</td></tr>'}
                  </tbody>
                </table>
              </div>

              <div class="col">
                <h3>Most Redeemed Offers</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Offer Title</th>
                      <th>Redemptions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reportData.usage?.mostRedeemedOffers?.map((item: any) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.count?.toLocaleString()}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="2">No data</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reports & Insights
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Real-time business performance and platform usage statistics.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">

        {/* Time Filter Dropdown */}
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/40 text-xs font-semibold bg-white min-w-[140px] text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
        </select>

        {/* Country Filter Dropdown */}
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/40 text-xs font-semibold bg-white min-w-[140px] text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <option value="">All Countries</option>
          {countriesResponse?.map((c: string) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Category Filter Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/40 text-xs font-semibold bg-white min-w-[140px] text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <option value="">All Categories</option>
          {categoriesResponse?.data?.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Reset Filters */}
        {(timeFilter || country || category) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-red-500 hover:text-red-600 font-bold transition-all px-3 py-2 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="space-y-8">
        <SalesTaxes 
          data={reportData?.salesAndTaxes} 
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
        <UsageStatistics data={reportData?.usage} />
      </div>
    </div>
  );
}
