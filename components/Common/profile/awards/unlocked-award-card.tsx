"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface UnlockedAwardProps {
  title: string;
  description?: string;
  image: any;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function UnlockedAwardCard({
  title,
  description,
  image,
  children,
  onClick,
}: UnlockedAwardProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasLongDesc = !!(description && description.length > 70);

  return (
    <Card
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl border-2 border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 py-0 flex flex-col justify-between h-full bg-white group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden shrink-0 bg-slate-100">
        <img
          src={typeof image === "string" ? image : image?.src}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
        />

        {/* Check icon */}
        <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white p-1.5 rounded-full shadow-lg">
          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[3]" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3.5 sm:p-4 md:p-5 flex-1 flex flex-col justify-between font-public-sans gap-2">
        <div>
          <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
            {title}
          </h3>
          {description && (
            <div className="mt-1">
              <p
                className={`text-[11px] sm:text-xs text-slate-500 leading-relaxed ${
                  isExpanded ? "whitespace-pre-line" : "line-clamp-2"
                }`}
              >
                {description}
              </p>
              {hasLongDesc && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-[10px] sm:text-[11px] font-bold text-amber-600 hover:text-amber-700 mt-0.5 inline-flex items-center gap-0.5 cursor-pointer select-none"
                >
                  {isExpanded ? (
                    <>
                      {language === "es" ? "Ver menos" : "See less"} <ChevronUp size={11} />
                    </>
                  ) : (
                    <>
                      {language === "es" ? "Ver más" : "See more"} <ChevronDown size={11} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="pt-1.5 mt-auto space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] sm:text-[11px] text-amber-700 font-extrabold tracking-wider">
              <span>{language === "es" ? "DESBLOQUEADO" : "UNLOCKED"}</span>
              <span>100%</span>
            </div>

            <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full w-full bg-amber-500 rounded-full" />
            </div>
          </div>

          {children || (
            <div className="pt-1.5">
              <Button
                type="button"
                onClick={onClick}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider h-10 sm:h-11 rounded-xl border-none shadow-sm shadow-amber-200/50 cursor-pointer"
              >
                {language === "es" ? "Ver detalles" : "View Details"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
