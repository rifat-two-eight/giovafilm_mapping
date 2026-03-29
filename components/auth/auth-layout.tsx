import Image from "next/image";
import type { ReactNode } from "react";

import registerImg from "@/public/auth/register.png";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: `
      linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
      url(${registerImg.src})
    `,
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

          <h2 className="text-5xl font-black leading-14 font-public-sans">
            Start Your Journey <br /> With Us Today.
          </h2>
          <p className="text-xl font-public-sans ">
            Join over 50,000 travelers exploring the world's <br /> most scenic
            routes and hidden gems.
          </p>
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-lg ">{children}</div>
      </div>
    </div>
  );
}
