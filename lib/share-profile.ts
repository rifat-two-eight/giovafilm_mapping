import { toast } from "sonner";

export function getExplorerProfileUrl(userId: string): string {
  if (typeof window === "undefined") return `/explorer/${userId}`;
  return `${window.location.origin}/explorer/${userId}`;
}

/**
 * Share profile via Web Share API when available, otherwise copy link.
 */
export async function shareProfile(options: {
  userId?: string;
  name?: string;
}): Promise<"shared" | "copied" | "failed"> {
  const { userId, name } = options;

  if (!userId) {
    toast.error("Profile link is not available yet. Please try again.");
    return "failed";
  }

  const url = getExplorerProfileUrl(userId);
  const title = name ? `${name} on Roadtripeado` : "My Roadtripeado profile";
  const text = name
    ? `Check out ${name}'s explorer profile on Roadtripeado`
    : "Check out my explorer profile on Roadtripeado";

  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title, text, url });
      toast.success("Profile shared!");
      return "shared";
    }
  } catch (err: any) {
    // User cancelled the share sheet — not an error
    if (err?.name === "AbortError") return "failed";
  }

  try {
    await navigator.clipboard.writeText(url);
    toast.success("Profile link copied!", {
      description: "You can paste it anywhere to share.",
    });
    return "copied";
  } catch {
    // Fallback for older browsers / insecure contexts
    try {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      toast.success("Profile link copied!", {
        description: "You can paste it anywhere to share.",
      });
      return "copied";
    } catch {
      toast.error("Could not share profile. Please copy the link manually.", {
        description: url,
      });
      return "failed";
    }
  }
}
