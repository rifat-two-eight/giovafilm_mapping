import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Use manual redirect to avoid full page load and timeout/bot-blocking issues
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    // In manual redirect, the location header contains the expanded URL
    let expandedUrl = response.headers.get("location");
    
    // If there is no location header (maybe not a redirect), fallback to response.url
    if (!expandedUrl) {
      expandedUrl = response.url;
    }

    return NextResponse.json({ expandedUrl });
  } catch (error: any) {
    console.error("Error expanding URL:", error);
    return NextResponse.json(
      { error: "Failed to expand URL" },
      { status: 500 },
    );
  }
}
