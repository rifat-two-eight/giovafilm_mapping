import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatItem {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
}

interface StatCardProps {
  data: StatItem[];
}

export function StatCard({ data }: StatCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {data?.map((stat, index) => (
        <Card
          key={index}
          className="bg-white p-7 py-6 rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow font-arial"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-gray-600 text-md font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold  text-gray-900">{stat.value}</p>
            </div>

            <div
              className={`${stat.iconBgColor} rounded-lg p-3 flex items-center justify-center`}
            >
              <div className="text-white">{stat.icon}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
