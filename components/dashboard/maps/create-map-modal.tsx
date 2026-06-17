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
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useCreateMapMutation, useUpdateMapMutation } from "@/redux/features/map/mapApi";

type FormValues = {
  name: string;
  description: string;
  price: number;
  features: string;
  tips: string;
  image?: FileList;
};

export default function CreateMapModal({
  open,
  setOpen,
  initialData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: any;
}) {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  
  const [createMap, { isLoading: isCreating }] = useCreateMapMutation();
  const [updateMap, { isLoading: isUpdating }] = useUpdateMapMutation();

  const isEditing = !!initialData;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          features: initialData.features?.join(", "),
          tips: initialData.recommendations?.tips || "",
        });

        // Resolve Image URL
        let imagePath = null;
        if (initialData.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
          imagePath = initialData.images[0];
        } else if (typeof initialData.images === 'string') {
          imagePath = initialData.images;
        } else if (initialData.image) {
          imagePath = initialData.image;
        }
        
        setPreview(imagePath ? getImageUrl(imagePath) : null);
      } else {
        reset({ name: "", description: "", price: 0, features: "", tips: "" });
        setPreview(null);
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    const mapData = {
      name: data.name,
      description: data.description,
      price: Number(data.price) || 0,
      features: data.features ? data.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
      recommendations: { tips: data.tips || "" },
      places: initialData?.places ? initialData.places.map((p: any) => (typeof p === 'string' ? p : p._id)) : [], 
      status: initialData?.status || "Published",
      isPaid: true,
      rating: initialData?.rating || 4.5,
      totalReview: initialData?.totalReview || 120
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(mapData));
    
    if (data.image && data.image.length > 0) {
      formData.append("images", data.image[0]);
    }

    try {
      if (isEditing) {
        await updateMap({ id: initialData._id, data: formData }).unwrap();
        toast.success("Map updated successfully");
      } else {
        await createMap(formData).unwrap();
        toast.success("Map created successfully");
      }
      reset();
      setPreview(null);
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || `Failed to ${isEditing ? 'update' : 'create'} map`);
      console.error(`Failed to ${isEditing ? 'update' : 'create'} map:`, error);
    }
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
            {isEditing ? "Update Map" : "Create New Map"}
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

          {/* Tips */}
          <div className="space-y-2">
            <Label className="ml-1">Tips</Label>
            <Textarea
              placeholder="Write tips for this map..."
              {...register("tips")}
              className="pl-12 bg-gray-100/80"
            />
          </div>

          {/* Image upload - updated field */}
          <div className="space-y-2">
            <Label className="ml-1">
              Offer Photo {!isEditing && <span className="text-red-500">*</span>}
            </Label>

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
              {...register("image", { required: !isEditing })}
              ref={(e) => {
                register("image", { required: !isEditing }).ref(e);
                fileRef.current = e;
              }}
              onChange={(e) => {
                register("image", { required: !isEditing }).onChange(e);
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
            disabled={isLoading}
            className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold h-12"
          >
            {isLoading ? "Saving..." : (isEditing ? "Update Map" : "Create Map")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
