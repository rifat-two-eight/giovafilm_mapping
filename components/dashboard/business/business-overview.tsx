"use client";

import { Globe } from "lucide-react";

export default function BusinessOverview({ businessData }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Business Overview
          </h2>
        </div>
        {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Edit Details
        </button> */}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Business Name
          </p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {businessData.name}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Category
          </p>
          <p className="text-gray-700 mt-1">{businessData.category}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Description
          </p>
          <p className="text-gray-700 mt-1 leading-relaxed">
            {businessData.description}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Website
          </p>
          <a
            href={`https://${businessData.website}`}
            className="text-blue-600 hover:underline mt-1"
          >
            {businessData.website} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
