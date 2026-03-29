import Image, { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  image?: StaticImageData | undefined;
}
export function AuthLayout({
  children,
  image,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: image
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${image.src})`
            : `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))`,
        }}
      >
        <div className="flex flex-col justify-center space-y-6 ml-28 text-white">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/maps">
              <Image
                src={require("@/public/white-logo.png")}
                alt="Dashboard Logo"
                height={500}
                width={500}
                className="w-96 h-auto"
              />
            </Link>
          </div>

          <h2 className="text-5xl font-black leading-14 font-public-sans w-full md:w-2/3">
            {title}
          </h2>
          <p className="text-xl font-public-sans w-full md:w-2/3">
            {description}
          </p>
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-lg ">{children}</div>
      </div>
    </div>
  );
}
