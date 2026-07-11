"use client";

import { Twitter, Instagram, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/maps") return null;

  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="max-w-360 mx-auto px-4 md:px-6 py-16">
        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div>
              <Link href="/">
                <Image
                  src={logo}
                  alt="Dashboard Logo"
                  width={200}
                  height={200}
                  className="w-48 h-auto -ml-3"
                  priority
                />
              </Link>
            </div>

            <p className="mt-4 text-sm leading-relaxed">
              Curating the world's most authentic travel experiences through
              interactive, community-driven digital maps.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <div className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 cursor-pointer">
                <Twitter size={18} />
              </div>

              <div className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 cursor-pointer">
                <Instagram size={18} />
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-black tracking-wide mb-4">
              PLATFORM
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="hover:text-black cursor-pointer">
                <Link href="/catalog">Map Catalog</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href="/how-it-works">How it Works</Link>
              </li>

            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-sm font-semibold text-black tracking-wide mb-4">
              FOR BUSINESSES
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="hover:text-black cursor-pointer">
                <Link href={"/for-business"}>Add Your Business</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href={"/pricing"}>Pricing Plan</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-black tracking-wide mb-4">
              COMPANY
            </h3>

            <ul className="space-y-3 text-sm">

              <li className="hover:text-black cursor-pointer">
                <Link href={"/contact"}>Contact</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href={"/privacy-policy"}>Privacy Policy</Link>
              </li>
              <li className="hover:text-black cursor-pointer">
                <Link href={"/terms-of-service"}>Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Roadtripeado Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              English (US)
            </div>
            <span>USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
