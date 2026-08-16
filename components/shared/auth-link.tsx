"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { useAppSelector } from "@/redux/hook";
import { useLoginRequired } from "@/components/shared/login-required-modal";

export function AuthLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const token = useAppSelector((state) => state.auth.accessToken);
  const { openLoginRequired } = useLoginRequired();
  const path = typeof href === "string" ? href : href.pathname || "/";
  const clickedName = typeof props.children === "string" ? props.children : undefined;

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        if (!token) {
          event.preventDefault();
          openLoginRequired(path, clickedName);
        }
        onClick?.(event);
      }}
    />
  );
}
