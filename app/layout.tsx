import type { Metadata } from "next";
import { Inter, Poppins, Public_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ReduxProvider } from "@/redux/ReduxProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const arial = localFont({
  src: [
    {
      path: "./fonts/arial.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-arial",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Roadtripeado – Discover Cities Like a Local | Interactive Travel Maps",
  description:
    "Discover cities like a local with curated interactive travel maps. Explore hidden gems, exclusive local deals, and authentic experiences through Roadtripeado.",
  keywords: [
    "travel maps",
    "interactive city maps",
    "discover cities",
    "hidden gems travel",
    "local city guides",
    "tourist maps",
    "travel planning",
    "city exploration",
  ],

  authors: [{ name: "Roadtripeado Team" }],

  openGraph: {
    title: "Discover Cities Like a Local – Roadtripeado",
    description:
      "Explore curated interactive travel maps, hidden gems, and exclusive local experiences. Travel smarter with Roadtripeado.",
    url: "https://roadtripeado.com",
    siteName: "Roadtripeado",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Discover Cities Like a Local – Roadtripeado",
    description:
      "Interactive travel maps to discover hidden gems and authentic local experiences in cities around the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${arial.variable} ${publicSans.variable} antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
