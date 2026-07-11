"use client";

import Image from "next/image";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import ProfileUpdateModal from "../Common/profile/profile-update-modal";
import { SidebarTrigger } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { broadcastLogout } from "@/components/shared/cross-tab-logout-listener";
import { persistor } from "@/redux/store";
import { baseApi } from "@/redux/api/baseApi";

export default function DashTopHeader() {
  const [open, setOpen] = useState(false);
  const { data: user } = useGetProfileQuery({});
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
      dispatch(baseApi.util.resetApiState());
      await persistor.purge();
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <div className="p-4 md:px-8 border-b border-gray-300/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="lg:hidden" />
          <h1 className="text-xl font-bold font-arial">Administrator Panel</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="w-10 h-10 cursor-pointer">
              <Image
                src={getImageUrl(user?.profile)}
                alt="Profile"
                width={40}
                height={40}
                unoptimized
                className="object-cover"
              />
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>{user?.name}</DropdownMenuItem>
            <DropdownMenuItem>{user?.email}</DropdownMenuItem>
            <DropdownMenuItem>{user?.role}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Edit Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ProfileUpdateModal open={open} onOpenChange={setOpen} data={user} />
    </div>
  );
}
