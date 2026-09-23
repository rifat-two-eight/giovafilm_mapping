"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

import { Lock } from "lucide-react";

interface AwardCardProps {
  title: string;
  description?: string;
  progress: number;
  current: number;
  total: number;
  Icon: LucideIcon;
  coverPhoto?: string;
}

export function AwardCard({
  title,
  description,
  progress,
  current,
  total,
  Icon,
  coverPhoto,
}: AwardCardProps) {
  return (
    <Card className="border rounded-xl shadow-sm hover:shadow-md transition py-0 overflow-hidden flex flex-col justify-between">
      <CardContent className="relative flex justify-center items-center py-10 bg-gray-100 h-40 md:h-64 overflow-hidden p-0">
        {coverPhoto ? (
          <>
            <img
              src={coverPhoto}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {/* Top-right Lock badge that clearly indicates locked status without obscuring the cover image */}
            <div className="absolute top-3 right-3 bg-gray-900/85 backdrop-blur-md text-amber-400 p-2 rounded-full shadow-lg border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
          </>
        ) : (
          /* Circle Icon Container */
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-amber-100 flex items-center justify-center relative">
            <Icon className="text-amber-500 w-6 h-6 md:w-8 md:h-8" />
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-white">
              <Lock className="text-white w-3 h-3" />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-1.5 md:gap-2.5 p-3 md:p-5 font-public-sans flex-1">
        <div className="w-full">
          {/* Title */}
          <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight">{title}</h3>
          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 mt-1 whitespace-pre-line leading-relaxed">{description}</p>
          )}
        </div>

        {/* Progress Text */}
        <div className="flex justify-between w-full text-xs text-muted-foreground mt-2">
          <span>
            PROGRESS: {current.toLocaleString()} / {total.toLocaleString()}
          </span>
          <span className="text-amber-600 font-bold">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-1.5 bg-gray-200 w-full" />
      </CardFooter>
    </Card>
  );
}
