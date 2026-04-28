import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (media?: any) => {
  if (!media) return "/placeholder.png";

  let mediaPath = "";

  if (Array.isArray(media) && media.length > 0) {
    mediaPath = media[0];
  } else if (typeof media === "string") {
    mediaPath = media;
  }

  // Handle common junk strings or non-string paths
  if (
    !mediaPath ||
    typeof mediaPath !== "string" ||
    mediaPath === "undefined" ||
    mediaPath === "null" ||
    mediaPath.trim() === ""
  ) {
    return "/placeholder.png";
  }

  // If it's already a full URL, return it
  if (mediaPath.startsWith("http")) return mediaPath;

  const baseURL = (process.env.NEXT_PUBLIC_BASEURL || "").trim();

  // Ensure there's a leading slash on media if not present and baseURL doesn't end with one
  const separator =
    baseURL && !baseURL.endsWith("/") && !mediaPath.startsWith("/") ? "/" : "";

  // If no baseURL, ensure mediaPath starts with a slash for Next.js Image
  if (!baseURL && !mediaPath.startsWith("/")) {
    return `/${mediaPath}`;
  }

  return `${baseURL}${separator}${mediaPath}`;
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

export const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "on" }],
  },
];
