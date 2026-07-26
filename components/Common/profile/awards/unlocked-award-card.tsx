"use client";

import { Card } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { Check } from "lucide-react";

interface UnlockedAwardProps {
  title: string;
  description?: string;
  image: any;
  children?: React.ReactNode;
}

export function UnlockedAwardCard({
  title,
  description,
  image,
  children,
}: UnlockedAwardProps) {
  return (
    <Card className="w-full! overflow-hidden rounded-xl border-2 border-amber-400 w-[320px] shadow-md py-0 gap-1.5 flex flex-col justify-between">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={typeof image === "string" ? image : image?.src}
          alt={title}
          className="object-cover w-full h-full hover:scale-105 transition-all duration-300"
        />

        {/* Check icon */}
        <div className="absolute top-3 right-3 bg-amber-500 rounded-full p-1.5 shadow-md">
          <Check className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-gray-900 leading-tight">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">{description}</p>
          )}
        </div>

        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-xs text-amber-600 font-bold">
            <span>UNLOCKED</span>
            <span>100%</span>
          </div>

          <div className="w-full h-1.5 bg-amber-100 rounded-full">
            <div className="h-full w-full bg-amber-500 rounded-full" />
          </div>
        </div>

        {children}
      </div>
    </Card>
  );
}
