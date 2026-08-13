"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useId, useRef, useState } from "react";

type LatLng = { lat: number; lng: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function distanceKm(a: LatLng, b: LatLng) {
  const dLat = (b.lat - a.lat) * 111.32;
  const dLng = (b.lng - a.lng) * 111.32 * Math.cos((a.lat * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

export function AnimatedMapPin({
  position,
  draggable = false,
  variant = "solid",
  onDragEnd,
}: {
  position: LatLng;
  draggable?: boolean;
  variant?: "solid" | "preview";
  onDragEnd?: (lat: number, lng: number) => void | Promise<void>;
}) {
  const shineId = useId().replace(/:/g, "");
  const isPreview = variant === "preview";
  const [displayPos, setDisplayPos] = useState(position);
  const [motion, setMotion] = useState<"none" | "drop" | "hop">(
    isPreview ? "none" : "drop",
  );
  const [rippleKey, setRippleKey] = useState(1);
  const prevRef = useRef(position);
  const draggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const firstMount = useRef(true);

  const land = () => {
    if (isPreview) return;
    setMotion("none");
    requestAnimationFrame(() => {
      setMotion("drop");
      setRippleKey((key) => key + 1);
    });
  };

  useEffect(() => {
    if (isPreview) {
      prevRef.current = position;
      setDisplayPos(position);
      return;
    }

    if (draggingRef.current) {
      prevRef.current = position;
      setDisplayPos(position);
      return;
    }

    const from = prevRef.current;
    const to = position;
    if (from.lat === to.lat && from.lng === to.lng) {
      if (firstMount.current) {
        firstMount.current = false;
        land();
      }
      return;
    }

    firstMount.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const km = distanceKm(from, to);
    const duration = Math.min(900, Math.max(420, 280 + km * 28));
    const startAt = performance.now();
    setMotion("hop");

    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = easeInOutCubic(t);
      setDisplayPos({
        lat: lerp(from.lat, to.lat, eased),
        lng: lerp(from.lng, to.lng, eased),
      });
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      prevRef.current = to;
      setDisplayPos(to);
      land();
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [position.lat, position.lng, isPreview]);

  const fill = isPreview ? "#F59E0B" : "#E53935";
  const shineStart = isPreview ? "#FCD34D" : "#FF6B63";
  const shineEnd = isPreview ? "#D97706" : "#C62828";

  return (
    <AdvancedMarker
      position={displayPos}
      draggable={!isPreview && draggable}
      zIndex={isPreview ? 1 : 10}
      onDragStart={() => {
        draggingRef.current = true;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setMotion("none");
      }}
      onDragEnd={(event) => {
        draggingRef.current = false;
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat == null || lng == null) return;
        prevRef.current = position;
        setDisplayPos(position);
        setMotion("none");
        void onDragEnd?.(lat, lng);
      }}
    >
      <div
        className={`relative flex flex-col items-center ${
          isPreview ? "pointer-events-none opacity-80" : ""
        }`}
      >
        {!isPreview ? (
          <span
            key={rippleKey}
            className={motion === "drop" ? "animate-pin-ripple" : "opacity-0"}
            style={{
              position: "absolute",
              bottom: 2,
              width: 18,
              height: 8,
              borderRadius: 999,
              background: "rgba(250, 191, 19, 0.5)",
            }}
          />
        ) : (
          <span
            className="absolute bottom-1 h-3 w-3 animate-ping rounded-full bg-amber-400/70"
            style={{ animationDuration: "1.4s" }}
          />
        )}
        <div
          className={
            motion === "drop"
              ? "animate-pin-drop"
              : motion === "hop"
                ? "animate-pin-hop"
                : ""
          }
        >
          <svg
            width={isPreview ? 30 : 36}
            height={isPreview ? 40 : 48}
            viewBox="0 0 36 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={
              isPreview
                ? "drop-shadow-[0_6px_10px_rgba(217,119,6,0.35)]"
                : "drop-shadow-[0_8px_14px_rgba(185,28,28,0.35)]"
            }
          >
            <path
              d="M18 46C18 46 33 29.6 33 18.5C33 9.94 26.28 3 18 3C9.72 3 3 9.94 3 18.5C3 29.6 18 46 18 46Z"
              fill={fill}
            />
            <path
              d="M18 46C18 46 33 29.6 33 18.5C33 9.94 26.28 3 18 3C9.72 3 3 9.94 3 18.5C3 29.6 18 46 18 46Z"
              fill={`url(#${shineId})`}
            />
            <circle cx="18" cy="18.5" r="7.5" fill="white" />
            <defs>
              <linearGradient
                id={shineId}
                x1="10"
                y1="4"
                x2="28"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={shineStart} stopOpacity="0.55" />
                <stop offset="1" stopColor={shineEnd} stopOpacity="0.15" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </AdvancedMarker>
  );
}
