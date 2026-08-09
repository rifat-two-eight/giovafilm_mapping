// components/shared/maps/CategoryMarker.tsx

import { CategoryIcon } from "../categories/category-icon";
import { Lock } from "lucide-react";

interface CategoryMarkerProps {
  icon: string;
  color?: string;
  isTemp?: boolean;
  isSelected?: boolean;
  isLocked?: boolean;
}

export function CategoryMarker({
  icon,
  color = "#3B82F6",
  isTemp = false,
  isSelected = false,
  isLocked = false,
}: CategoryMarkerProps) {
  const bgColor = isTemp ? "#F59E0B" : color;

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
      {/* Lock Icon overlay */}
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

      {/* Pin Head */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          background: bgColor,
          border: "3px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Undo rotation for icon */}
        <div style={{ transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CategoryIcon icon={icon} size={18} color="#fff" />
        </div>
      </div>

      {/* Pin Tail — white line only */}
      <div
        style={{
          width: 2,
          height: 8,
          background: "#ffffff",
          marginTop: -1,
          borderRadius: "0 0 2px 2px",
        }}
      />

      {/* Shadow dot on ground */}
      <div
        style={{
          width: 8,
          height: 3,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.15)",
          marginTop: 1,
        }}
      />
    </div>
  );
}
