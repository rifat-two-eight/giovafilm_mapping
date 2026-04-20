// components/shared/maps/CategoryMarker.tsx

interface CategoryMarkerProps {
  icon: string;
  color?: string;
  isTemp?: boolean;
  isSelected?: boolean;
}

export function CategoryMarker({
  icon,
  color = "#3B82F6",
  isTemp = false,
  isSelected = false,
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
      {/* Pin Head */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          background: bgColor,
          border: "3px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            transform: "rotate(45deg)",
            fontSize: 18,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {icon}
        </span>
      </div>

      {/* Pin Tail */}
      <div
        style={{
          width: 2,
          height: 8,
          background: bgColor,
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
