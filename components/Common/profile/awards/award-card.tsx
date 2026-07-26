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
      <CardContent className="relative flex justify-center items-center py-10 bg-gray-100 h-64 overflow-hidden p-0">
        {coverPhoto ? (
          <>
            <img
              src={coverPhoto}
              alt={title}
              className="w-full h-full object-cover filter grayscale opacity-75"
            />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Lock className="text-gray-600 w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          /* Circle Icon Container */
          <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center relative">
            <Icon className="text-amber-500 w-8 h-8" />
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-white">
              <Lock className="text-white w-3 h-3" />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2.5 p-5 font-public-sans flex-1">
        <div className="w-full">
          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 leading-tight">{title}</h3>
          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">{description}</p>
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
