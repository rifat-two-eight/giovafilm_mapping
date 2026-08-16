"use client";

import { Globe } from "lucide-react";
import { toExternalUrl, toInstagramUrl } from "./business-links";

export default function BusinessOverview({ businessData }: any) {
  const websiteUrl = toExternalUrl(businessData.website);
  const instagramUrl = toInstagramUrl(businessData.instagram);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Business Overview
          </h2>
        </div>
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
            {businessData.description || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Website
          </p>
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-1 inline-block"
            >
              {businessData.website} ↗
            </a>
          ) : (
            <p className="text-gray-500 mt-1">N/A</p>
          )}
        </div>

        {instagramUrl && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Instagram
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-1 inline-block"
            >
              {businessData.instagram} ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
