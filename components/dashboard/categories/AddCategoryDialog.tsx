"use client";

import { useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "@/redux/features/category/categoryApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  categoryName: string;
  color: string;
  icon: string;
}

const colorPalette = [
  "#8b1d5a",
  "#d81b60",
  "#e53935",
  "#fb8c00",
  "#fdd835",
  "#7cb342",
  "#2e7d32",
  "#00796b",
  "#1565c0",
  "#283593",
  "#6a1b9a",
  "#5d4037",
  "#ec407a",
  "#ff7043",
  "#ffca28",
  "#ffeb3b",
  "#9ccc65",
  "#26a69a",
  "#00acc1",
  "#1e88e5",
  "#5c6bc0",
  "#8e24aa",
  "#8d6e63",
  "#bdbdbd",
  "#9e9e9e",
  "#616161",
  "#000000",
];

export function AddCategoryDialog({
  open,
  onOpenChange,
}: AddCategoryDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      color: "#3b82f6",
      icon: "🔘",
    },
  });

  const selectedColor = watch("color");
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.categoryName,
        color: data.color,
        icon: data.icon,
        status: "Active"
      };
      await createCategory(payload).unwrap();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Category Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Category Name
            </Label>
            <Input
              placeholder="e.g., Parks & Nature"
              className="mt-1"
              {...register("categoryName", { required: true })}
            />
          </div>

          {/* Color */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Color (for map pins)
            </Label>

            {/* Selected Color Preview */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <div
                className="w-10 h-10 rounded-md border border-gray-300"
                style={{ backgroundColor: selectedColor }}
              />
              <Input className="flex-1 font-mono" {...register("color")} />
            </div>

            {/* Color Palette */}
            <div className="grid grid-cols-12 gap-1">
              {colorPalette.map((color) => (
                <div
                  key={color}
                  onClick={() => setValue("color", color)}
                  className={`w-6 h-6 cursor-pointer border 
                  ${
                    selectedColor === color
                      ? "border-black ring-2 ring-gray-400"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Icon (emoji)
            </Label>

            <div className="flex items-center gap-2 mt-1">
              <div className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center text-xl">
                {watch("icon")}
              </div>

              <Input className="flex-1" {...register("icon")} />
            </div>

            <p className="text-xs text-gray-500 mt-1">
              You can paste any emoji here
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
