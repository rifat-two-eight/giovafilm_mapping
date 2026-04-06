"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/utils";

export default function ProfileUpdateModal({
  data,
  open,
  onOpenChange,
}: {
  data: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Update Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Clickable Upload Area */}
            <label className="cursor-pointer block w-full h-full border rounded-lg overflow-hidden relative group">
              <Image
                src={getImageUrl(data?.profile)}
                alt={"profile"}
                width={500}
                height={500}
                unoptimized
                className="rounded-lg object-cover"
              />

              {/* Overlay on hover */}
              {/* <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition">
                Change
              </div> */}

              {/* Hidden Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Remove Button */}
            {preview && (
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow"
              >
                ✕
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input placeholder="Enter your name" defaultValue={data?.name} />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2 overflow-hidden">
            <Button
              type="button"
              variant="outline"
              className="w-full flex-1 "
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className=" flex-1 w-full bg-yellow-400 text-black hover:bg-primary hover:text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
