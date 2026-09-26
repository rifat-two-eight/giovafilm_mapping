"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LucideIcon, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AwardCardProps {
  title: string;
  description?: string;
  progress: number;
  current: number;
  total: number;
  Icon: LucideIcon;
  coverPhoto?: string;
  onClick?: () => void;
}

export function AwardCard({
  title,
  description,
  progress,
  current,
  total,
  Icon,
  coverPhoto,
  onClick,
}: AwardCardProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasLongDesc = !!(description && description.length > 70);

  return (
    <Card
      onClick={onClick}
      className="border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 py-0 overflow-hidden flex flex-col justify-between h-full bg-white group cursor-pointer"
    >
      <CardContent className="relative flex justify-center items-center bg-slate-100 h-36 sm:h-44 md:h-48 w-full overflow-hidden p-0 shrink-0">
        {coverPhoto ? (
          <>
            <img
              src={coverPhoto}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Top-right Lock badge */}
            <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md text-amber-400 p-1.5 sm:p-2 rounded-full shadow-lg border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
          </>
        ) : (
          /* Circle Icon Container */
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-100/80 flex items-center justify-center relative">
            <Icon className="text-amber-600 w-6 h-6 sm:w-8 sm:h-8" />
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-white">
              <Lock className="text-white w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start justify-between gap-2 p-3.5 sm:p-4 md:p-5 font-public-sans flex-1">
        <div className="w-full">
          {/* Title */}
          <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Truncated / Symmetrical Description */}
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

        <div className="w-full pt-1.5 mt-auto space-y-2">
          <div className="space-y-1">
            {/* Progress Text */}
            <div className="flex justify-between w-full text-[10px] sm:text-[11px] text-slate-500 font-bold">
              <span>
                {language === "es" ? "PROGRESO" : "PROGRESS"}: {current.toLocaleString()} / {total.toLocaleString()}
              </span>
              <span className="text-amber-600 font-extrabold">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <Progress value={progress} className="h-1.5 bg-slate-100 w-full" />
          </div>

          {/* Action button matching unlocked card height for symmetrical layout */}
          <Button
            type="button"
            variant="outline"
            onClick={onClick}
            className="w-full border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-700 bg-slate-50 hover:bg-amber-50/50 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider h-10 sm:h-11 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            {language === "es" ? "Ver detalles" : "View Details"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
