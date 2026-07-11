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
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (media?: any) => {
  if (!media) return "/exploring-today.jpg";

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
    return "/exploring-today.jpg";
  }

  // If it's already a full URL, return it
  if (mediaPath.startsWith("http")) return mediaPath;

  const baseURL = (env.NEXT_PUBLIC_IMAGE_BASEURL || "").trim();

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
