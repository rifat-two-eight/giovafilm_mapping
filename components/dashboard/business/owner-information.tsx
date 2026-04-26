"use client";

import { NoImage } from "@/lib/others/others";
import { getImageUrl } from "@/lib/utils";
import { Mail, CheckCircle, X } from "lucide-react";
import Image from "next/image";

export default function OwnerInformation({ user }: any) {
  console.log("user", user);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail size={20} className="text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Owner Information</h2>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {user.profile ? (
            <Image
              src={getImageUrl(user?.profile)}
              alt={user.name}
              width={48}
              height={48}
              unoptimized
              className="rounded-full w-12 h-12 object-cover"
            />
          ) : (
            <NoImage />
          )}
        </div>

        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.title}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Private Email
          </p>

          <p className="text-gray-700 mt-1">{user.email}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Mobile Phone
          </p>

          <p className="text-gray-700 mt-1">{user.phone || "N/A"}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Identity Verified
          </p>

          {user?.verified ? (
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-600 font-medium">Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <X size={16} className="text-red-600" />
              <span className="text-red-600 font-medium">Not Verified</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
