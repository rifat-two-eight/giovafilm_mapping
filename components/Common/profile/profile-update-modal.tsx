// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { getImageUrl } from "@/lib/utils";
// import { useUpdateProfileMutation } from "@/redux/features/user/userApi";

// export default function ProfileUpdateModal({
//   data,
//   open,
//   onOpenChange,
// }: {
//   data: any;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [updatProfile] = useUpdateProfileMutation();

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Profile updated", e);
//     // onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md rounded-lg">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold text-center">
//             Update Profile
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={onSubmit} className="space-y-5">
//           {/* Avatar Upload */}
//           <div className="relative w-32 h-32 mx-auto">
//             {/* Clickable Upload Area */}
//             <label className="cursor-pointer block w-full h-full border rounded-lg overflow-hidden relative group">
//               <Image
//                 src={preview || getImageUrl(data?.profile)}
//                 alt={"profile"}
//                 width={500}
//                 height={500}
//                 unoptimized
//                 className="rounded-lg object-cover"
//               />

//               {/* Hidden Input */}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>

//             {/* Remove Button */}
//             {preview && (
//               <button
//                 type="button"
//                 onClick={() => setPreview(null)}
//                 className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow"
//               >
//                 ✕
//               </button>
//             )}
//           </div>

//           {/* Name */}
//           <div>
//             <label className="text-sm font-medium">Full Name</label>
//             <Input placeholder="Enter your name" defaultValue={data?.name} />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-center gap-3 pt-2 overflow-hidden">
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full flex-1 "
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               className=" flex-1 w-full bg-yellow-400 text-black hover:bg-primary hover:text-white"
//             >
//               Save Changes
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useRef, useState } from "react";
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
import { useUpdateProfileMutation } from "@/redux/features/user/userApi";

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
  const [name, setName] = useState<string>(data?.name ?? "");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImageFile(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("images", imageFile);
    }


    try {
      const res = await updateProfile(formData).unwrap();
      console.log("Profile updated successfully:", res);
      // onOpenChange(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
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
            <label className="cursor-pointer block w-full h-full border rounded-lg overflow-hidden relative group">
              <Image
                src={preview || getImageUrl(data?.profile)}
                alt="profile"
                width={500}
                height={500}
                unoptimized
                className="rounded-lg object-cover w-full h-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow"
              >
                ✕
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 w-full bg-yellow-400 text-black hover:bg-primary hover:text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
