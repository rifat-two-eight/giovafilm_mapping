"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function SalesTaxesChart({ data = [] }: { data?: any[] }) {
  // Map API keys to human readable labels if preferred, 
  // but here we'll just use the raw keys for simplicity or map them.
  const chartData = data.map(item => ({
    month: item.month,
    "Total Sales": item.totalSales,
    "Taxes": item.taxes,
    "Net Revenue": item.netRevenue
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          }}
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
        />
        <Legend />
        <Bar dataKey="Total Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Taxes" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Net Revenue" fill="#a855f7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
