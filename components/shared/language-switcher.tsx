"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 text-xs font-semibold select-none">
      <button
        type="button"
        onClick={() => setLanguage("es")}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 cursor-pointer ${
          language === "es"
            ? "bg-[#FFC107] text-black shadow-xs font-bold"
            : "text-gray-600 hover:text-black"
        }`}
      >
        <span>🇪🇸</span>
        <span>ES</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 cursor-pointer ${
          language === "en"
            ? "bg-[#FFC107] text-black shadow-xs font-bold"
            : "text-gray-600 hover:text-black"
        }`}
      >
        <span>🇺🇸</span>
        <span>EN</span>
      </button>
    </div>
  );
}
