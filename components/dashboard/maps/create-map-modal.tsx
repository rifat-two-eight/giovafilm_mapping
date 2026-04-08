"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, FileText, MapPin, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  description: string;
  price: number;
  features: string;
  image: FileList;
};

export default function CreateMapModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      features: data.features.split(",").map((f) => f.trim()),
    };

    console.log(formattedData);

    // setOpen(false);
    reset();
    setPreview(null);
  };

  const handleImageChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const removeImage = () => {
    setPreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-3xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Map
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="ml-1">Map Name</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
              <Input
                placeholder="Dhaka Food Guide"
                {...register("name", { required: true })}
                className="pl-12 py-6 bg-gray-100/80"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="ml-1">Description</Label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-[#9E9E9E]" />
              <Textarea
                placeholder="Write description..."
                {...register("description")}
                className="pl-12 bg-gray-100/80"
              />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label className="ml-1">Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
              <Input
                type="number"
                step="0.01"
                min={0}
                {...register("price", { min: 0 })}
                className="pl-12 py-6 bg-gray-100/80"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label className="ml-1">Features</Label>
            <Input
              placeholder="Top rated, Hidden gems"
              {...register("features")}
              className="py-6 bg-gray-100/80"
            />
          </div>

          {/* Image upload - updated field */}
          <div className="space-y-2">
            <Label className="ml-1">Offer Photo</Label>

            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl bg-gray-100/60 hover:bg-gray-100 transition flex flex-col items-center justify-center text-center p-8"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-40 object-contain rounded-md"
                />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}
            </div>

            <Input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              {...register("image")}
              ref={(e) => {
                register("image").ref(e);
                fileRef.current = e;
              }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageChange(file);
              }}
            />

            {preview && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="flex items-center gap-1"
              >
                <X size={14} />
                Remove Image
              </Button>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold h-12"
          >
            Create Map
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
