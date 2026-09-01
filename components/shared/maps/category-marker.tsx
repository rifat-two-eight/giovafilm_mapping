// components/shared/maps/CategoryMarker.tsx

import { CategoryIcon } from "../categories/category-icon";
import { Lock } from "lucide-react";

interface CategoryMarkerProps {
  icon: string;
  color?: string;
  isTemp?: boolean;
  isSelected?: boolean;
  isLocked?: boolean;
  isMobile?: boolean;
}

export function CategoryMarker({
  icon,
  color = "#3B82F6",
  isTemp = false,
  isSelected = false,
  isLocked = false,
  isMobile = false,
}: CategoryMarkerProps) {
  const bgColor = isTemp ? "#F59E0B" : color;
  const size = isMobile ? 30 : 36;
  const iconSize = isMobile ? 18 : 22;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: isSelected
          ? "drop-shadow(0 4px 12px rgba(0,0,0,0.35))"
          : "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
        transform: isSelected ? "scale(1.2)" : "scale(1)",
        transition: "transform 0.15s ease, filter 0.15s ease",
        cursor: "pointer",
      }}
    >
      {/* Lock Icon overlay - positioned relative to the non-rotated parent */}
      {isLocked && (
        <div
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            background: "#EF4444",
            color: "#fff",
            borderRadius: "50%",
            width: isMobile ? 14 : 18,
            height: isMobile ? 14 : 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid white",
            zIndex: 10,
          }}
        >
          <Lock size={isMobile ? 8 : 10} style={{ strokeWidth: 3 }} />
        </div>
      )}

      {/* Teardrop Pin Head */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          background: bgColor,
          border: isMobile ? "1.5px solid #ffffff" : "2px solid #ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Undo rotation for icon */}
        <div
          style={{
            transform: "rotate(45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CategoryIcon icon={icon} size={iconSize} color="#ffffff" />
        </div>
      </div>
    </div>
  );
}
