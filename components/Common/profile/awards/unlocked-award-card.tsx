"use client";

import { Card } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { Check } from "lucide-react";

interface UnlockedAwardProps {
  title: string;
  image: StaticImageData | string;
  children?: React.ReactNode;
}

export function UnlockedAwardCard({
  title,
  image,
  children,
}: UnlockedAwardProps) {
  return (
    <Card className="w-full! overflow-hidden rounded-xl border-2 border-amber-400 w-[320px] shadow-md py-0 gap-1.5">
      {/* Image */}
      <div className="relative h-72">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="object-cover w-full h-full"
        />

        {/* Check icon */}
        <div className="absolute top-3 right-3 bg-amber-500 rounded-full p-1">
          <Check className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{title}</h3>

        <div className="flex justify-between text-sm text-amber-600 font-medium">
          <span>UNLOCKED</span>
          <span>100%</span>
        </div>

        <div className="w-full h-2 bg-amber-100 rounded-full">
          <div className="h-full w-full bg-amber-500 rounded-full" />
        </div>

        {children}
      </div>
    </Card>
  );
}
