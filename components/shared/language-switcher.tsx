"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const languages: { code: Language; label: string; flag: string; title: string }[] = [
  { code: "es", label: "ES", flag: "🇪🇸", title: "Español" },
  { code: "en", label: "EN", flag: "🇺🇸", title: "English" },
];

export default function LanguageSwitcher({
  className = "",
  size = "md",
  showIcon = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const currentLang = languages.find((l) => l.code === language) || languages[0];
  const isSmall = size === "sm";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Select language"
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full bg-gray-100/90 hover:bg-gray-200/80 border border-gray-200 text-gray-900 font-semibold cursor-pointer transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107] select-none shrink-0 shadow-2xs",
            isSmall ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs sm:text-sm",
            className
          )}
        >
          {showIcon && <Globe className="w-3.5 h-3.5 text-gray-500" />}
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <span className="font-bold tracking-wide">{currentLang.label}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-40 p-1.5 rounded-xl bg-white border border-gray-100 shadow-xl z-50 animate-in fade-in-50 zoom-in-95"
      >
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Language / Idioma
        </div>
        {languages.map((item) => {
          const isActive = language === item.code;
          return (
            <DropdownMenuItem
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs sm:text-sm font-medium transition-colors my-0.5",
                isActive
                  ? "bg-[#FFF9E6] text-black font-bold border border-[#FFE082]"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{item.flag}</span>
                <span>{item.title}</span>
              </div>
              {isActive && (
                <Check className="w-4 h-4 text-[#D97706] stroke-[2.5]" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
