import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (media?: File | string) => {
  if (!media) return "/placeholder.png";

  const baseURL = process.env.NEXT_PUBLIC_BASEURL as string;

  // Prevent double slashes
  return `${baseURL}${media}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB");
};

// Decode a JWT payload (client-side only, no verification)
export function decodeJwtPayload(token: string) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// mapStyles.ts  (or inline in your component)
export const CLEAN_MAP_STYLES = [
  // ── Hide ALL points of interest ──────────────────────────────────
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },

  // ── Hide transit (stations, bus stops, metro, etc.) ──────────────
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },

  // ── Keep roads — just clean them up slightly ──────────────────────
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },

  // ── Keep administrative labels (countries, states, cities) ────────
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },

  // ── Keep water & landscape for context ───────────────────────────
  { featureType: "water", elementType: "all", stylers: [{ visibility: "on" }] },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
];
