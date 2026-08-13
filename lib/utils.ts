import { clsx, type ClassValue } from "clsx";
import { env } from "@/lib/config";

import {
  LayoutDashboard,
  Map,
  MapPin,
  Tag,
  BadgePercent,
  Users,
  Bell,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  Trophy,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FALLBACK_IMAGE = "/exploring-today.jpg";

const extractMediaPath = (item: any): string => {
  if (!item) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "object") {
    return String(item.url || item.path || item.src || item.secure_url || "").trim();
  }
  return "";
};

export const isUnusableMediaPath = (path?: string) => {
  if (!path || typeof path !== "string") return true;
  const value = path.trim();
  return !value || value === "undefined" || value === "null";
};

export const getUsableMediaList = (media?: any): string[] => {
  const items = Array.isArray(media) ? media : media ? [media] : [];
  return items.map(extractMediaPath).filter((path) => !isUnusableMediaPath(path));
};

export const getUsableMediaUrl = (media?: any) => {
  const usable = getUsableMediaList(media);
  return usable.length > 0 ? getImageUrl(usable[0]) : "";
};

export const getImageUrl = (media?: any) => {
  if (!media) return FALLBACK_IMAGE;

  let mediaPath = "";

  if (Array.isArray(media) && media.length > 0) {
    mediaPath = getUsableMediaList(media)[0] || extractMediaPath(media[0]);
  } else {
    mediaPath = extractMediaPath(media);
  }

  if (isUnusableMediaPath(mediaPath)) {
    return FALLBACK_IMAGE;
  }

  // If it's already a full URL, return it
  if (mediaPath.startsWith("http")) return mediaPath;

  let baseURL = (env.NEXT_PUBLIC_IMAGE_BASEURL || "").trim();

  // If active API baseURL is set, align dev image URLs with the active server
  if (env.NEXT_PUBLIC_BASEURL) {
    try {
      const apiURL = new URL(env.NEXT_PUBLIC_BASEURL);
      const imgURL = baseURL ? new URL(baseURL) : null;
      if (imgURL && (imgURL.hostname === "10.10.26.173" || imgURL.hostname === "localhost")) {
        baseURL = apiURL.origin;
      } else if (!baseURL) {
        baseURL = apiURL.origin;
      }
    } catch (e) {
      // Fallback to active BASEURL if URL parsing failed
      if (baseURL.includes("10.10.26.173") || baseURL.includes("localhost")) {
        baseURL = env.NEXT_PUBLIC_BASEURL;
      }
    }
  }

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

// Extract human-readable error messages from RTK Query error responses
export function getApiErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";

  if (typeof error === "object") {
    // Check for RTK query FetchBaseQueryError
    if ("status" in error) {
      const fetchError = error as any;
      if (fetchError.data && typeof fetchError.data === "object") {
        if ("message" in fetchError.data) {
          return String(fetchError.data.message);
        }
        if ("error" in fetchError.data) {
          return String(fetchError.data.error);
        }
      }
      if (fetchError.error) {
        return String(fetchError.error);
      }
      return `Error: ${fetchError.status}`;
    }

    // Check for SerializedError
    if ("message" in error) {
      const serializedError = error as any;
      return String(serializedError.message);
    }
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred.";
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

export const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Maps",
    url: "/dashboard/maps",
    icon: Map,
  },
  {
    title: "Places",
    url: "/dashboard/places",
    icon: MapPin,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: Tag,
  },
  {
    title: "Offers",
    url: "/dashboard/offers",
    icon: BadgePercent,
  },
  {
    title: "Users & Roles",
    url: "/dashboard/users-roles",
    icon: Users,
  },
  // {
  //   title: "Notification",
  //   url: "/dashboard/notification",
  //   icon: Bell,
  // },
  {
    title: "Business",
    url: "/dashboard/business",
    icon: Building2,
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    icon: Trophy,
  },
  {
    title: "Reviews Verification",
    url: "/dashboard/reviews-verification",
    icon: Bell,
  },
  {
    title: "Reports & Statistics",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Subscription",
    url: "/dashboard/subscription",
    icon: CreditCard,
  },
];

export const mapEditorMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Maps",
    url: "/dashboard/maps",
    icon: Map,
  },
  {
    title: "Places",
    url: "/dashboard/places",
    icon: MapPin,
  },
  {
    title: "Offers",
    url: "/dashboard/offers",
    icon: BadgePercent,
  },
];
