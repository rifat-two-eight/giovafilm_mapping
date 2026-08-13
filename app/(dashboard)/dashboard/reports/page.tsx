"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SalesTaxes from "@/components/dashboard/reports/sales-taxes";
import { UsageStatistics } from "@/components/dashboard/reports/usage-statistics";
import {
  useGetReportsQuery,
  useSearchReportEntitiesQuery,
} from "@/redux/features/stats/statsApi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetAvailableCountriesQuery } from "@/redux/features/map/mapApi";
import { Loader2, ArrowLeft, RefreshCw, Search, MapPin, Store, Map, Ticket, X } from "lucide-react";
import Link from "next/link";

type ReportEntityType = "place" | "business" | "map" | "offer";

type ReportEntity = {
  type: ReportEntityType;
  id: string;
  name: string;
  location?: string;
};

const ENTITY_META: Record<
  ReportEntityType,
  { label: string; Icon: typeof MapPin }
> = {
  place: { label: "Place", Icon: MapPin },
  business: { label: "Business", Icon: Store },
  map: { label: "Map", Icon: Map },
  offer: { label: "Offer", Icon: Ticket },
};

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<ReportEntity | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Fetch available filter lists from API
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const { data: countriesResponse } = useGetAvailableCountriesQuery(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!searchBoxRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const { data: suggestionsResponse, isFetching: isSearching } =
    useSearchReportEntitiesQuery(
      { searchTerm: debouncedSearch },
      { skip: !!selectedEntity || debouncedSearch.length < 2 }
    );

  const suggestions: ReportEntity[] = suggestionsResponse?.data || [];
  const isSuggestionPending =
    !selectedEntity &&
    searchTerm.trim().length >= 2 &&
    (searchTerm.trim() !== debouncedSearch || isSearching);

  const groupedSuggestions = useMemo(() => {
    const groups: { type: ReportEntityType; items: ReportEntity[] }[] = [];
    (["place", "business", "map", "offer"] as ReportEntityType[]).forEach((type) => {
      const items = suggestions.filter((item) => item.type === type);
      if (items.length) groups.push({ type, items });
    });
    return groups;
  }, [suggestions]);

  // Fetch reports stats with applied filters
  const { data: response, isLoading, isError, refetch, isFetching } = useGetReportsQuery(
    {
      timeFilter,
      country,
      category,
      ...(selectedEntity
        ? { entityType: selectedEntity.type, entityId: selectedEntity.id }
        : {}),
    },
    { refetchOnMountOrArgChange: true }
  );
  
  const reportData = response?.data;
  const categoryLabel =
    categoriesResponse?.data?.find((cat: any) => cat._id === category)?.name ||
    "";

  const handleSelectEntity = (item: ReportEntity) => {
    setSelectedEntity(item);
    setSearchTerm("");
    setDebouncedSearch("");
    setShowSuggestions(false);
  };

  const handleClearEntity = () => {
    setSelectedEntity(null);
    setSearchTerm("");
    setDebouncedSearch("");
    setShowSuggestions(false);
  };

  const handleResetFilters = () => {
    setTimeFilter("");
    setCountry("");
    setCategory("");
    handleClearEntity();
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
                <div class="card-value">$${(reportData.salesAndTaxes?.totalSales || 0).toLocaleString()}</div>
              </div>
              <div class="card">
                <div class="card-title">Taxes Collected</div>
                <div class="card-value">$${(reportData.salesAndTaxes?.taxesCollected || 0).toLocaleString()}</div>
              </div>
              <div class="card">
                <div class="card-title">Net Revenue</div>
                <div class="card-value">$${(reportData.salesAndTaxes?.netRevenue || 0).toLocaleString()}</div>
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
                    <td>$${(item.totalSales || 0).toLocaleString()}</td>
                    <td>$${(item.taxes || 0).toLocaleString()}</td>
                    <td>$${(item.netRevenue || 0).toLocaleString()}</td>
                  </tr>
                `).join('') || '<tr><td colspan="4">No data</td></tr>'}
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

        <div ref={searchBoxRef} className="relative min-w-[260px] flex-1 max-w-md">
          {selectedEntity ? (
            <div className="flex h-10 items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3">
              {(() => {
                const { Icon, label } = ENTITY_META[selectedEntity.type];
                return (
                  <>
                    <Icon className="h-4 w-4 shrink-0 text-amber-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      {label}
                    </span>
                    <span className="min-w-0 truncate text-xs font-semibold text-gray-900">
                      {selectedEntity.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleClearEntity}
                      className="ml-auto rounded p-0.5 text-amber-800 hover:bg-amber-100"
                      aria-label="Clear selected"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowSuggestions(false);
                }}
                placeholder="Search place or business..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs font-semibold text-gray-700 outline-none transition focus:ring-2 focus:ring-blue-400/40"
              />
            </>
          )}

          {!selectedEntity && showSuggestions && searchTerm.trim().length >= 2 && (
            <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
              {isSuggestionPending ? (
                <div className="flex items-center justify-center gap-2 p-4 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  Searching...
                </div>
              ) : groupedSuggestions.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">
                  No place or business found.
                </p>
              ) : (
                <div className="max-h-72 overflow-y-auto py-1">
                  {groupedSuggestions.map((group) => {
                    const { Icon, label } = ENTITY_META[group.type];
                    return (
                      <div key={group.type}>
                        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          {label}s
                        </p>
                        {group.items.map((item) => (
                          <button
                            key={`${item.type}-${item.id}`}
                            type="button"
                            onClick={() => handleSelectEntity(item)}
                            className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-amber-50"
                          >
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-gray-900">
                                {item.name}
                              </span>
                              {item.location ? (
                                <span className="block truncate text-xs text-gray-500">
                                  {item.location}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

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
        {(timeFilter || country || category || selectedEntity) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-red-500 hover:text-red-600 font-bold transition-all px-3 py-2 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {selectedEntity && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
            Showing reports for
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {ENTITY_META[selectedEntity.type].label}: {selectedEntity.name}
            {selectedEntity.location ? ` · ${selectedEntity.location}` : ""}
            {country ? ` · ${country}` : ""}
            {categoryLabel ? ` · ${categoryLabel}` : ""}
          </p>
          {selectedEntity.type === "business" && (
            <p className="mt-1 text-xs text-amber-800">
              Map sales are not linked to businesses. Visit and offer stats below are for this business.
            </p>
          )}
        </div>
      )}

      <div className="space-y-8">
        <SalesTaxes 
          data={reportData?.salesAndTaxes} 
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
        <UsageStatistics
          data={reportData?.usage}
          timeFilterActive={!!timeFilter}
          placeColumnTitle={
            selectedEntity?.type === "business"
              ? "Business visits"
              : "Most Opened Places"
          }
        />
      </div>
    </div>
  );
}
