"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface UserLocationMarkerProps {
  position: { lat: number; lng: number };
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  if (!position || !Number.isFinite(position.lat) || !Number.isFinite(position.lng)) {
    return null;
  }

  return (
    <AdvancedMarker position={position} zIndex={60}>
      <div
        className="relative flex items-center justify-center pointer-events-none select-none"
        style={{ width: 28, height: 28 }}
        title="Your Location"
      >
        {/* Soft animated radar wave */}
        <span className="absolute h-7 w-7 rounded-full bg-blue-500/25 animate-ping" />

        {/* Translucent accuracy aura */}
        <span className="absolute h-6 w-6 rounded-full bg-blue-500/20 border border-blue-400/30" />

        {/* Crisp core dot with white border & shadow */}
        <span className="relative flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 border-[2.5px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          {/* Subtle center specular dot */}
          <span className="h-1 w-1 rounded-full bg-white/90" />
        </span>
      </div>
    </AdvancedMarker>
  );
}
