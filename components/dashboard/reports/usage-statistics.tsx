"use client";

"use client";

interface StatItem {
  name: string;
  count: number;
}

function StatColumn({ title, items }: { title: string; items: StatItem[] }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-sm text-gray-700 font-medium truncate pr-2">{item.name}</span>
              <span className="text-sm font-bold text-blue-600">
                {item.count.toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400 text-xs bg-gray-50 rounded-lg border border-gray-100 border-dashed">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

interface UsageData {
  mostViewedMaps: StatItem[];
  mostOpenedPlaces: StatItem[];
  mostRedeemedOffers: StatItem[];
}

export function UsageStatistics({ data }: { data?: UsageData }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Usage of Maps / Places / Offers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatColumn title="Most Viewed Maps" items={data?.mostViewedMaps || []} />
        <StatColumn title="Most Opened Places" items={data?.mostOpenedPlaces || []} />
        <StatColumn title="Most Redeemed Offers" items={data?.mostRedeemedOffers || []} />
      </div>
    </div>
  );
}
