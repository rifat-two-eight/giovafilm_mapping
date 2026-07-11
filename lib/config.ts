import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BASEURL: z.string().url("NEXT_PUBLIC_BASEURL must be a valid URL"),
  NEXT_PUBLIC_GOOGLE_MAP_API_KEY: z.string().min(1, "NEXT_PUBLIC_GOOGLE_MAP_API_KEY is required"),
  NEXT_PUBLIC_GOOGLE_MAP_ID: z.string().min(1, "NEXT_PUBLIC_GOOGLE_MAP_ID is required"),
  NEXT_PUBLIC_IMAGE_BASEURL: z
    .string()
    .url("NEXT_PUBLIC_IMAGE_BASEURL must be a valid URL")
    .or(z.string().length(0)),
});

const getRawEnv = () => {
  return {
    NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAP_ID: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
    NEXT_PUBLIC_IMAGE_BASEURL: process.env.NEXT_PUBLIC_IMAGE_BASEURL || "",
  };
};

const parseResult = envSchema.safeParse(getRawEnv());

if (!parseResult.success) {
  if (process.env.NODE_ENV === "development") {
    console.error(
      "❌ Invalid environment variables configuration:\n",
      JSON.stringify(parseResult.error.format(), null, 2)
    );
  }
}

export const env = parseResult.success
  ? parseResult.data
  : {
      NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL || "http://localhost:5004",
      NEXT_PUBLIC_GOOGLE_MAP_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
      NEXT_PUBLIC_GOOGLE_MAP_ID: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "",
      NEXT_PUBLIC_IMAGE_BASEURL: process.env.NEXT_PUBLIC_IMAGE_BASEURL || "http://localhost:5004",
    };
