import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (path?: string) => {
  if (!path) return "/placeholder.png";

  const baseURL = process.env.NEXT_PUBLIC_BASEURL as string;

  // Prevent double slashes
  return `${baseURL}${path}`;
};
