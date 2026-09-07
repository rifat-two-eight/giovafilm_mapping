import React, { useState } from "react";
import { CategoryIcon } from "../categories/category-icon";
import { Lock } from "lucide-react";

interface CategoryMarkerProps {
  icon: string;
  color?: string;
  name?: string;
  isTemp?: boolean;
  isSelected?: boolean;
  isLocked?: boolean;
  isMobile?: boolean;
}

export function CategoryMarker({
  icon,
  color = "#FA7B17",
  name,
  isTemp = false,
  isSelected = false,
  isLocked = false,
  isMobile = false,
}: CategoryMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Proportions for a 100% Uniform Google Maps POI Pin (4px desktop / 3px mobile white border)
  const width = isMobile ? 30 : 37;
  const height = isMobile ? 38 : 46;
  const badgeSize = isMobile ? 24 : 29;

  const isCustomImage =
    icon?.startsWith("http") ||
    icon?.startsWith("data:") ||
    icon?.includes("/") ||
    icon?.includes(".");

  const iconSize = isCustomImage ? badgeSize : (isMobile ? 16 : 19);
  const showName = Boolean(name) && (isSelected || (!isMobile && !isLocked && isHovered));

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transformOrigin: "bottom center",
        transform: isSelected ? "scale(1.22)" : isHovered ? "scale(1.08)" : "scale(1)",
        filter: isSelected
          ? "drop-shadow(0 8px 22px rgba(0, 0, 0, 0.55))"
          : isHovered
            ? "drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45))"
            : "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.35))",
        transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.22s ease",
        userSelect: "none",
      }}
    >
      {/* ── Selection Beacon / Glowing Halo ── */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${badgeSize + 16}px`,
            height: `${badgeSize + 16}px`,
            borderRadius: "50%",
            border: "2.5px solid #FFC107",
            boxShadow: "0 0 16px rgba(255, 193, 7, 0.65)",
            animation: "ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* ── Name Tooltip for Selected or Hovered Pin ── */}
      {showName && (
        <div
          style={{
            position: "absolute",
            bottom: `${height + (isSelected ? 10 : 6)}px`,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: isSelected ? "#0F172A" : "rgba(15, 23, 42, 0.92)",
            color: "#FFFFFF",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: isSelected ? "12px" : "11px",
            fontWeight: isSelected ? "800" : "700",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.45)",
            border: isSelected ? "1.5px solid #FFC107" : "1px solid rgba(255, 255, 255, 0.18)",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          {name}
          {/* Arrow Triangle pointing down to pin */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: `5px solid ${isSelected ? "#0F172A" : "rgba(15, 23, 42, 0.92)"}`,
            }}
          />
        </div>
      )}

      {/* ── 100% Google Maps Replica SVG (Clean White Pin Body) ── */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 40 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* White Pin Body */}
        <path
          d="M20 0C8.95 0 0 8.95 0 20C0 29 10 39 15 43.5C16.5 44.8 18.2 45.5 20 45.5C21.8 45.5 23.5 44.8 25 43.5C30 39 40 29 40 20C40 8.95 31.05 0 20 0Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* ── Fixed Uniform Inner Badge (Guarantees Equal White Border on ALL Pins) ── */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${badgeSize}px`,
          height: `${badgeSize}px`,
          borderRadius: "50%",
          backgroundColor: isCustomImage ? "transparent" : (color || "#FA7B17"),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <CategoryIcon icon={icon} size={iconSize} color="#FFFFFF" />
      </div>

      {/* ── Lock Badge (if locked) ── */}
      {isLocked && (
        <div
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            background: "#EF4444",
            color: "#fff",
            borderRadius: "50%",
            width: isMobile ? 15 : 18,
            height: isMobile ? 15 : 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid white",
            zIndex: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          <Lock size={isMobile ? 8 : 10} style={{ strokeWidth: 3 }} />
        </div>
      )}
    </div>
  );
}






