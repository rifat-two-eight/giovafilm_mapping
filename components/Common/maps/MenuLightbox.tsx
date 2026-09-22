"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getImageUrl } from "@/lib/utils";
import { X } from "lucide-react";

interface MenuLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export function MenuLightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title = "Menu",
}: MenuLightboxProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(initialIndex + 1);

  useEffect(() => {
    if (!api) return;
    api.scrollTo(initialIndex, true);
    setCurrent(initialIndex + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, initialIndex, isOpen]);

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl w-[95vw] sm:w-[90vw] p-0 overflow-hidden bg-black/95 border-neutral-800 text-white flex flex-col items-center justify-center rounded-2xl"
        showCloseButton={false}
      >
        <div className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/80 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <DialogTitle className="text-sm font-semibold text-white truncate">
              {title}
            </DialogTitle>
            <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full flex-shrink-0">
              {current} / {images.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative w-full flex items-center justify-center p-2 sm:p-4 min-h-[50vh] max-h-[80vh]">
          <Carousel
            setApi={setApi}
            opts={{
              startIndex: initialIndex,
              loop: images.length > 1,
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <CarouselContent className="items-center">
              {images.map((img, idx) => (
                <CarouselItem
                  key={idx}
                  className="flex items-center justify-center select-none"
                >
                  <div className="relative max-h-[72vh] w-full flex items-center justify-center overflow-hidden">
                    <img
                      src={getImageUrl(img)}
                      alt={`${title} - Page ${idx + 1}`}
                      className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl"
                      draggable={false}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 sm:left-4 bg-black/60 border-neutral-700 text-white hover:bg-black/90 hover:text-white" />
                <CarouselNext className="right-2 sm:right-4 bg-black/60 border-neutral-700 text-white hover:bg-black/90 hover:text-white" />
              </>
            )}
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
