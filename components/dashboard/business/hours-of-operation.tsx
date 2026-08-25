"use client";

import { Clock } from "lucide-react";

type ScheduleItem = {
  days?: string;
  day?: string;
  openTime?: string;
  closeTime?: string;
};

export default function HoursOfOperation({
  schedule,
}: {
  schedule?: ScheduleItem[];
}) {
  const items = Array.isArray(schedule) ? schedule.filter((item) => item?.days || item?.day) : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Hours of Operation
          </h2>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No hours set</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <div
              key={`${item.days || item.day}-${index}`}
              className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 text-center"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {item.days || item.day}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {item.openTime || "--"}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {item.closeTime || "--"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
