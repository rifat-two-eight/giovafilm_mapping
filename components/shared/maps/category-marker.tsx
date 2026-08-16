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
  const size = isMobile ? 28 : 34;
  const iconSize = isMobile ? 16 : 20;

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
      {isLocked && (
        <div
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            background: "#EF4444",
            color: "#fff",
            borderRadius: "50%",
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid white",
            zIndex: 10,
          }}
        >
          <Lock size={10} style={{ strokeWidth: 3 }} />
        </div>
      )}

      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bgColor,
          border: isMobile ? "2px solid #fff" : "3px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <CategoryIcon icon={icon} size={iconSize} color="#fff" />
      </div>

      {/* White pointer only — no colored stem */}
      <div
        style={{
          width: 0,
          height: 0,
          marginTop: -1,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "8px solid #fff",
        }}
      />
    </div>
  );
}
