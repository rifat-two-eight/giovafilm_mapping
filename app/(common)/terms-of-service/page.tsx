"use client";

import { PolicySection } from "@/components/shared/policy-section";
import termsData from "@/lib/terms.json";

export default function TermsOfServicePage() {
  return (
    <main className="bg-linear-to-b from-gray-50/50 via-white to-gray-50/50 min-h-screen py-16 md:py-24 font-inter">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {termsData.title}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {termsData.description}
          </p>
          <p className="text-xs md:text-sm text-gray-400 font-medium">
            Last Updated: <span className="text-gray-700">{termsData.lastUpdated}</span>
          </p>
        </div>

        {/* White card container */}
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100/80">
          {/* Sections list */}
          <div className="space-y-10">
            {termsData.sections.map((section) => (
              <PolicySection
                key={section.id}
                id={section.id}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-14 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              These terms and conditions constitute the entire agreement between
              you and RoadTripAdo regarding your use of our website and
              services. If you have any questions, please contact us at{" "}
              <a
                href="mailto:legal@roadtripeado.com"
                className="text-yellow-600 hover:text-yellow-700 font-bold transition-colors cursor-pointer"
              >
                legal@roadtripeado.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
