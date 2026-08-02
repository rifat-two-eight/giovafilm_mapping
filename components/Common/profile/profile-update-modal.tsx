"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";
import { useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (open && data) {
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
      setWebsite(data.website ?? "");
      setInstagram(data.instagram ?? "");
      setPreview(null);
      setImageFile(null);
    }
  }, [data, open]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImageFile(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", trimmedName);
    formData.append("phone", phone.trim());
    formData.append("website", website.trim());
    formData.append("instagram", instagram.trim());

    if (imageFile) {
      const safeFile = new File([imageFile], imageFile.name, {
        type: imageFile.type || "image/jpeg",
      });
      formData.append("images", safeFile);
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      onOpenChange(false);
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Profile update failed.";
      toast.error(message);
    }
  };

  const currentImage = preview || (data?.profile ? getImageUrl(data.profile) : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            Update your photo and public details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative w-32 h-32 mx-auto">
            <label className="cursor-pointer block w-full h-full border-2 border-dashed border-gray-200 rounded-xl overflow-hidden relative group bg-gray-50">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt="profile"
                  width={500}
                  height={500}
                  unoptimized
                  className="rounded-xl object-cover w-full h-full"
                />
              ) : (
                <NoImage />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                <Camera size={22} />
                <span className="text-xs font-medium">Change photo</span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-600"
                aria-label="Remove selected photo"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 -mt-2">
            JPEG, PNG or WebP · max 5MB
          </p>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Name *</label>
            <Input
              placeholder="Your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <Input
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <Input
              placeholder="https://yoursite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              type="url"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Instagram</label>
            <Input
              placeholder="@username"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
