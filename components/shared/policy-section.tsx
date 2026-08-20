"use client";

/**
 * PolicySection Component
 *
 * Reusable component for displaying individual policy sections.
 * Takes section data and renders it with consistent styling.
 *
 * Props:
 * - id: number - Unique identifier for the section
 * - title: string - Section title
 * - content: string - Section content/description
 */

interface PolicySectionProps {
  id: number;
  title: string;
  content: string;
}

export function PolicySection({ id, title, content }: PolicySectionProps) {
  return (
    <div className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
      {/* Section number and title */}
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-yellow-50/80 border border-yellow-150/60 rounded-xl text-yellow-600 font-extrabold text-sm shadow-xs">
          {id}
        </span>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
          {/* Section content */}
          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">{content}</p>
        </div>
      </div>
    </div>
  );
}
