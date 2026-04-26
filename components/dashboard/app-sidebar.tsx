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

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Map,
  MapPin,
  Tag,
  BadgePercent,
  Users,
  Bell,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { broadcastLogout } from "@/components/shared/cross-tab-logout-listener";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Maps",
    url: "/dashboard/maps",
    icon: Map,
  },
  {
    title: "Places",
    url: "/dashboard/places",
    icon: MapPin,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: Tag,
  },
  {
    title: "Offers",
    url: "/dashboard/offers",
    icon: BadgePercent,
  },
  {
    title: "Users & Roles",
    url: "/dashboard/users-roles",
    icon: Users,
  },
  // {
  //   title: "Notification",
  //   url: "/dashboard/notification",
  //   icon: Bell,
  // },
  {
    title: "Business",
    url: "/dashboard/business",
    icon: Building2,
  },
  {
    title: "Reports & Statistics",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  // {
  //   title: "Subscription",
  //   url: "/dashboard/subscription",
  //   icon: CreditCard,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

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
        <Link href="/">
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
              {menuItems.map((item) => {
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
