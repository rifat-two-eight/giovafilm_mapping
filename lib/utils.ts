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
  Ticket,
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

export const isVideoUrl = (url?: string) => {
  if (!url || typeof url !== "string") return false;
  const path = url.split("?")[0].split("#")[0].toLowerCase();
  if (/\.(jpe?g|png|gif|webp|bmp|heic|svg|pdf)$/i.test(path)) return false;
  return /\.(mp4|webm|ogv|mov|mkv|3gp|3gpp|avi|wmv|flv|m4v|mpeg|mpg)$/i.test(
    path,
  );
};

export const getUsableMediaList = (media?: any): string[] => {
  const items = Array.isArray(media) ? media : media ? [media] : [];
  return items.map(extractMediaPath).filter((path) => !isUnusableMediaPath(path));
};

export const getUsableMediaUrl = (media?: any) => {
  const usable = getUsableMediaList(media);
  return usable.length > 0 ? getImageUrl(usable[0]) : "";
};

function isLocalHostname(hostname: string) {
  // Dev machines change LAN IP, so match the whole private range
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

function getFileOrigin() {
  // Use window.location.host which includes port (e.g. "10.10.26.208:3000")
  const pageHost = typeof window !== "undefined" ? window.location.host : "";
  const candidates = [
    env.NEXT_PUBLIC_IMAGE_BASEURL,
    env.NEXT_PUBLIC_BASEURL,
  ];

  for (const raw of candidates) {
    const value = (raw || "").trim();
    if (!value) continue;
    try {
      const url = new URL(value);
      const path = url.pathname.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
      const base = `${url.origin}${path}`;

      // Don't use a leftover LAN IP when the site is on a public host
      if (pageHost && isLocalHostname(url.hostname) && !isLocalHostname(url.hostname.split(":")[0])) {
        continue;
      }

      // Same host:port with no path = Next.js dev server, which does not serve /uploads
      // Use url.host (includes port) so backend on :5004 is NOT skipped when page is on :3000
      if (pageHost && url.host === pageHost && !path) {
        continue;
      }

      return base;
    } catch {
      continue;
    }
  }

  return "";
}

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

  if (mediaPath.startsWith("blob:") || mediaPath.startsWith("data:")) {
    return mediaPath;
  }

  const fileOrigin = getFileOrigin();

  // Full URL: rewrite leftover localhost/dev hosts onto the active API
  if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
    try {
      const parsed = new URL(mediaPath);
      if (fileOrigin && isLocalHostname(parsed.hostname)) {
        return `${fileOrigin}${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // keep original
    }
    return mediaPath;
  }

  const path = mediaPath.startsWith("/") ? mediaPath : `/${mediaPath}`;
  if (!fileOrigin) return path;
  return `${fileOrigin}${path}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB");
};

// Decode a JWT payload (client-side only, no verification)
export function decodeJwtPayload(token: string) {
  try {
    let base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
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
  {
    title: "Promo Links",
    url: "/dashboard/promos",
    icon: Ticket,
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
