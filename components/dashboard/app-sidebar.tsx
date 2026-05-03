"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { adminMenuItems, mapEditorMenuItems } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useAppDispatch } from "@/redux/hook";
import { LogOut } from "lucide-react";
import { broadcastLogout } from "../shared/cross-tab-logout-listener";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: user } = useGetProfileQuery({});

  const menuItems =
    user?.role === "admin" || user?.role === "super_admin"
      ? adminMenuItems
      : user?.role === "map-editor"
        ? mapEditorMenuItems
        : [];

  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap();
    } catch {
    } finally {
      broadcastLogout(); // signal all other tabs
      dispatch(logout());
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <Sidebar className="h-screen bg-[#f5f5f5] border-r border-gray-300/50">
      {/* Logo */}
      <div className="py-3 flex justify-center border-b border-gray-300/50">
        <Link href="/maps">
          <Image
            src={require("@/public/logo.png")}
            alt="Dashboard Logo"
            height={200}
            width={200}
            className="w-48 h-auto"
          />
        </Link>
      </div>

      <SidebarContent className="pt-6">
        <SidebarGroup className="p-0 shadow-none">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3 px-2">
              {menuItems?.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        id="sidebarLink"
                        href={item.url}
                        className={`relative flex items-center gap-2.5 px-4 py-6! text-lg! rounded-2xl font-medium transition-all hover:bg-primary!
                    ${
                      isActive
                        ? "bg-primary text-black shadow-md"
                        : "text-black hover:bg-primary!"
                    }                        
          `}
                      >
                        <item.icon className="size-6!" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Bottom */}
      <div className="mt-auto px-2 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="relative w-full flex items-center gap-2.5 px-4 py-6! text-lg! rounded-2xl font-medium transition-all text-black hover:bg-primary!"
              >
                <LogOut className="size-6!" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
