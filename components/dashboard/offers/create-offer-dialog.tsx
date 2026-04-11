"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
} from "@/redux/features/offer/offerApi";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

interface CreateOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

interface FormData {
  title: string;
  place: string;
  description: string;
  discountType: string;
  discountValue: string;
  validFrom: string;
  validUntil: string;
  buttonLabel: string;
}

export function CreateOfferDialog({
  open,
  onOpenChange,
  initialData,
}: CreateOfferDialogProps) {
  const isEdit = !!initialData;
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation();
  const { data: placesRes } = useGetPlacesQuery({ limit: 100 });
  const places = placesRes?.data || [];

  // ── Image state — managed manually, NOT via register ─────────────────────
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // ── Redemption rules state ────────────────────────────────────────────────
  const [ruleInput, setRuleInput] = useState("");
  const [ruleError, setRuleError] = useState("");
  const [rules, setRules] = useState<string[]>([]);

  const handleAddRule = () => {
    const trimmed = ruleInput.trim();
    if (!trimmed) {
      setRuleError("Please enter a redemption rule before adding.");
      return;
    }
    setRules((prev) => [...prev, trimmed]);
    setRuleInput("");
    setRuleError("");
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Populate form when editing ────────────────────────────────────────────
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        place: initialData.place?._id || initialData.place,
        description: initialData.description,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue.toString(),
        validFrom: initialData.validFrom
          ? new Date(initialData.validFrom).toISOString().split("T")[0]
          : "",
        validUntil: initialData.validUntil
          ? new Date(initialData.validUntil).toISOString().split("T")[0]
          : "",
        buttonLabel: initialData.buttonLabel,
      });
      setPreview(getImageUrl(initialData.photo));
      setPhotoFile(null);
      setRules(
        Array.isArray(initialData.redemptionRules)
          ? initialData.redemptionRules
          : initialData.redemptionRules
            ? [initialData.redemptionRules]
            : [],
      );
    } else {
      reset({
        title: "",
        place: "",
        description: "",
        discountType: "",
        discountValue: "",
        validFrom: "",
        validUntil: "",
        buttonLabel: "",
      });
      setPreview(null);
      setPhotoFile(null);
      setRules([]);
      setRuleInput("");
      setRuleError("");
    }
  }, [initialData, reset, open]);

  const openFileWindow = () => fileRef.current?.click();

  // Store the actual File object in state so it's always available in onSubmit
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setPhotoFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (data: FormData) => {
    try {
      const offerData = {
        title: data.title,
        place: data.place,
        description: data.description,
        discountType: data.discountType,
        discountValue: Number(data.discountValue) || 0,
        validFrom: new Date(data.validFrom).toISOString(),
        validUntil: new Date(data.validUntil).toISOString(),
        redemptionRules: rules,
        buttonLabel: data.buttonLabel,
        status: "Active",
        redemptionsCount: isEdit ? initialData.redemptionsCount : 0,
      };

      const formDataPayload = new FormData();
      formDataPayload.append("data", JSON.stringify(offerData));

      // Append the file directly from state — not from react-hook-form
      if (photoFile) {
        formDataPayload.append("images", photoFile);
      }

      if (isEdit) {
        await updateOffer({
          id: initialData._id,
          data: formDataPayload,
        }).unwrap();
        toast.success("Offer updated successfully!");
      } else {
        const res = await createOffer(formDataPayload).unwrap();
        toast.success("Offer created successfully!");
        console.log("create offer response", res);
      }

      onOpenChange(false);
      reset();
      setPreview(null);
      setPhotoFile(null);
      setRules([]);
      setRuleInput("");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} offer`,
      );
      console.error(`Failed to ${isEdit ? "update" : "create"} offer:`, error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Update Offer" : "Create New Offer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Offer Photo */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Offer Photo
            </Label>

            <div
              onClick={openFileWindow}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer relative"
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="preview"
                    className="mx-auto max-h-48 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </>
              )}

              {/* Plain file input — no register() spread to avoid ref/onChange conflicts */}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Offer Title */}
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Offer Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., 20% off Coffee"
              className="mt-1"
              {...register("title", { required: "Title is required" })}
            />
          </div>

          {/* Place */}
          <div>
            <Label
              htmlFor="place"
              className="text-sm font-medium text-gray-700"
            >
              Place
            </Label>
            <select
              id="place"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              {...register("place", { required: "Place is required" })}
            >
              <option value="">Select a place</option>
              {places.map((p: any) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Offer Description */}
          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Offer Description
            </Label>
            <textarea
              id="description"
              placeholder="Describe the offer..."
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
            />
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="discountType"
                className="text-sm font-medium text-gray-700"
              >
                Discount Type
              </Label>
              <select
                id="discountType"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("discountType", { required: "Type is required" })}
              >
                <option value="">Select discount type</option>
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat Amount</option>
                <option value="BOGO">Buy One Get One (BOGO)</option>
                <option value="Free item">Free Item</option>
              </select>
            </div>

            <div>
              <Label
                htmlFor="discountValue"
                className="text-sm font-medium text-gray-700"
              >
                Discount Value
              </Label>
              <Input
                id="discountValue"
                type="number"
                min={0}
                placeholder="20"
                className="mt-1"
                {...register("discountValue", {
                  required: "Discount value is required",
                  min: { value: 0, message: "Discount cannot be negative" },
                })}
              />
            </div>
          </div>

          {/* Valid From and Valid Until */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="validFrom"
                className="text-sm font-medium text-gray-700"
              >
                Valid From
              </Label>
              <Input
                id="validFrom"
                type="date"
                className="mt-1"
                {...register("validFrom", {
                  required: "Start date is required",
                })}
              />
            </div>

            <div>
              <Label
                htmlFor="validUntil"
                className="text-sm font-medium text-gray-700"
              >
                Valid Until
              </Label>
              <Input
                id="validUntil"
                type="date"
                className="mt-1"
                {...register("validUntil", {
                  required: "End date is required",
                })}
              />
            </div>
          </div>

          {/* Redemption Rules */}
          <div>
            <Label
              htmlFor="redemptionRules"
              className="text-sm font-medium text-gray-700"
            >
              Redemption Rules
            </Label>

            {/* Input row */}
            <div className="flex gap-2 mt-1">
              <textarea
                id="redemptionRules"
                value={ruleInput}
                onChange={(e) => {
                  setRuleInput(e.target.value);
                  if (e.target.value.trim()) setRuleError("");
                }}
                placeholder="e.g., One per user per visit"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={2}
              />
              <Button
                type="button"
                onClick={handleAddRule}
                className="self-start bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 h-auto"
              >
                Add
              </Button>
            </div>

            {/* Inline error */}
            {ruleError && (
              <p className="text-sm text-red-500 mt-1">{ruleError}</p>
            )}

            {/* Added rules list */}
            {rules.length > 0 && (
              <ul className="mt-3 space-y-2">
                {rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                  >
                    <span className="text-sm text-gray-700 leading-snug">
                      <span className="font-medium text-gray-400 mr-2">
                        {index + 1}.
                      </span>
                      {rule}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                    >
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Button Label */}
          <div>
            <Label
              htmlFor="buttonLabel"
              className="text-sm font-medium text-gray-700"
            >
              Button Label
            </Label>
            <Input
              id="buttonLabel"
              placeholder="Redeem Offer"
              className="mt-1"
              {...register("buttonLabel")}
            />
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
              className="bg-purple-600 hover:bg-purple-700 text-white min-w-32 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? "Saving..." : isEdit ? "Update Offer" : "Save Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
