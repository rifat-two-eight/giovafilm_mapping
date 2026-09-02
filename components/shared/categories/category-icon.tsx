"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { getImageUrl } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface CategoryIconProps {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}

export function CategoryIcon({
  icon,
  size = 20,
  color = "#ffffff",
  className = "",
}: CategoryIconProps) {
  const [imageError, setImageError] = useState(false);

  if (!icon) {
    return <MapPin size={size} color={color} className={className} />;
  }

  // Check if it's a custom image (URL, base64, or file path)
  const isCustomImage =
    icon.startsWith("http") ||
    icon.startsWith("data:") ||
    icon.includes("/") ||
    icon.includes(".");

  if (isCustomImage && !imageError) {
    return (
      <img
        src={getImageUrl(icon)}
        alt=""
        className={`object-contain ${className}`}
        style={{
          width: size,
          height: size,
          filter: "brightness(0) invert(1)",
        }}
        onError={() => setImageError(true)}
      />
    );
  }

  if (isCustomImage && imageError) {
    return <MapPin size={size} color={color} className={className} />;
  }

  // Check if it's an emoji
  const isEmoji = /\p{Emoji}/u.test(icon) && !icon.includes(":");

  if (isEmoji) {
    return (
      <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
        {icon}
      </span>
    );
  }

  // Fallback to Iconify
  return (
    <Icon
      icon={icon}
      width={size}
      height={size}
      color={color}
      className={className}
    />
  );
}

