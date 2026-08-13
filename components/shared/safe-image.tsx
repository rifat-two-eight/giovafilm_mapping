"use client";

import { NoImage } from "@/lib/others/others";
import { useEffect, useState } from "react";

type SafeImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  unoptimized?: boolean;
  sizes?: string;
};

export function SafeImage({ src, alt = "", className = "", fill }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <NoImage />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className}` : className}
      onError={() => setFailed(true)}
    />
  );
}
