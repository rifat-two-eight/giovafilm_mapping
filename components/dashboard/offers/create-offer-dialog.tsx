"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getImageUrl } from "@/lib/utils";
import { useGetBusinessesQuery } from "@/redux/features/business/businessApi";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
} from "@/redux/features/offer/offerApi";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
import { ChevronDown, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

interface FormData {
  title: string;
  business: string;
  place: string;
  description: string;
  discountType: string;
  discountValue: string;
  validFrom: string;
  validUntil?: string;
  noExpiration: boolean;
  maxRedemptions: string;
  redemptionDuration: string;
  buttonLabel: string;
  status: string;
}

export function CreateOfferDialog({
  open,
  onOpenChange,
  initialData,
}: CreateOfferDialogProps) {
  const isEdit = !!initialData;
  const { register, handleSubmit, reset, watch, control, setValue } =
    useForm<FormData>({
      defaultValues: {
        noExpiration: false,
      },
    });
  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation();
  const { data: businessesRes } = useGetBusinessesQuery({ limit: 100 });
  const businesses = businessesRes?.data || [];

  const { data: placeData, isLoading: placeLoading } = useGetPlacesQuery({ limit: 1000 });
  const places = useMemo(() => {
    return placeData?.data || [];
  }, [placeData]);

  console.log("categoryNames", places);

  const noExpiration = watch("noExpiration");

  // ── Image state — managed manually, NOT via register ─────────────────────
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [selectionType, setSelectionType] = useState<"business" | "place">(
    "business",
  );

  // ── Searchable dropdown state ───────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedId = watch("business");

  // Determine the list based on selectionType
  const currentOptions = selectionType === "business" ? businesses : places;

  const selectedEntity = currentOptions.find(
    (item: any) => item._id === selectedId,
  );

  const filteredOptions = currentOptions.filter((item: any) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
    if (!open) return; // Only run when dialog is open

    if (initialData) {
      // Check for both place and business in initialData
      const placeId = initialData.place?._id || initialData.place;
      const businessId = initialData.business?._id || initialData.business;

      let id: string | undefined;
      let detectedType: "business" | "place" = "business";

      if (placeId && places.some((p: any) => p._id === placeId)) {
        id = placeId;
        detectedType = "place";
      } else if (businessId && businesses.some((b: any) => b._id === businessId)) {
        id = businessId;
        detectedType = "business";
      }

      // Only update if different to avoid cycles
      setSelectionType((prev) => (prev !== detectedType ? detectedType : prev));

      reset({
        title: initialData.title,
        business: id || "",
        place: detectedType === "place" ? (id || "") : "",
        description: initialData.description,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue?.toString() || "",
        validFrom: initialData.validFrom
          ? new Date(initialData.validFrom).toISOString().split("T")[0]
          : "",
        validUntil: initialData.validUntil
          ? new Date(initialData.validUntil).toISOString().split("T")[0]
          : "",
        noExpiration: initialData.noExpiration || false,
        maxRedemptions: initialData.maxRedemptions?.toString() || "",
        redemptionDuration: initialData.redemptionDuration?.toString() || "",
        buttonLabel: initialData.buttonLabel || "Redeem Offer",
        status: initialData.status || "Active",
      });
      setPreview(getImageUrl(initialData.images || initialData.photo));
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
        business: "",
        place: "",
        description: "",
        discountType: "",
        discountValue: "",
        validFrom: "",
        validUntil: "",
        noExpiration: false,
        maxRedemptions: "",
        redemptionDuration: "",
        buttonLabel: "Redeem Offer",
        status: "Active",
      });
      setPreview(null);
      setPhotoFile(null);
      setRules([]);
      setRuleInput("");
      setRuleError("");
    }
  }, [initialData, reset, open, places, businesses]);

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
      const offerData: any = {
        title: data.title,
        description: data.description,
        discountType: data.discountType,
        discountValue: Number(data.discountValue) || 0,
        validFrom: new Date(data.validFrom).toISOString(),
        validUntil: data.noExpiration
          ? null
          : data.validUntil
            ? new Date(data.validUntil).toISOString()
            : null,
        noExpiration: data.noExpiration,
        maxRedemptions: Number(data.maxRedemptions) || 0,
        redemptionDuration: Number(data.redemptionDuration) || 0,
        redemptionRules: rules,
        buttonLabel: data.buttonLabel,
        status: data.status || "Active",
        ...(isEdit && {
          redemptionsCount: initialData.redemptionsCount }),
      };

      // Set the correct ID field based on selection type
      if (selectionType === "business") {
        offerData.business = data.business;
      } else {
        offerData.place = data.business;
      }

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
        await createOffer(formDataPayload).unwrap();
        toast.success("Offer created successfully!");
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

          {/* Selection Toggle and Searchable Dropdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Choose {selectionType === "business" ? "Business" : "Place"}
              </Label>
              <div className="flex bg-gray-100 p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => {
                    setSelectionType("business");
                    setValue("business", "");
                    setSearchQuery("");
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    selectionType === "business"
                      ? "bg-white shadow-sm text-blue-600 font-bold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Business
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectionType("place");
                    setValue("business", "");
                    setSearchQuery("");
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    selectionType === "place"
                      ? "bg-white shadow-sm text-blue-600 font-bold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Place
                </button>
              </div>
            </div>

            {/* Hidden input keeps react-hook-form happy */}
            <input
              type="hidden"
              {...register("business", {
                required: `${selectionType === "business" ? "Business" : "Place"} is required`,
              })}
            />

            <div className="relative">
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <span
                  className={selectedEntity ? "text-gray-900" : "text-gray-400"}
                >
                  {selectedEntity
                    ? selectedEntity.name
                    : `Choose ${selectionType === "business" ? "Business" : "Place"}`}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                  {/* Search input */}
                  <div className="p-2 border-b border-gray-100">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${selectionType === "business" ? "business" : "place"}...`}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Options list */}
                  <ul className="max-h-48 overflow-y-auto">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setValue("business", "");
                          setSearchQuery("");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
                      >
                        Choose{" "}
                        {selectionType === "business" ? "Business" : "Place"}
                      </button>
                    </li>

                    {filteredOptions.length === 0 ? (
                      <li className="px-3 py-3 text-sm text-gray-400 text-center">
                        No{" "}
                        {selectionType === "business" ? "businesses" : "places"}{" "}
                        found.
                      </li>
                    ) : (
                      filteredOptions.map((item: any) => (
                        <li key={item._id}>
                          <button
                            type="button"
                            onClick={() => {
                              setValue("business", item._id, {
                                shouldValidate: true,
                              });
                              setSearchQuery("");
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-blue-50 ${
                              selectedId === item._id
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
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

          {/* Redemption Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="maxRedemptions"
                className="text-sm font-medium text-gray-700"
              >
                Max Redemptions
              </Label>
              <Input
                id="maxRedemptions"
                type="number"
                min={0}
                placeholder="e.g., 100"
                className="mt-1"
                {...register("maxRedemptions", {
                  required: "Max redemptions is required",
                })}
              />
            </div>

            <div>
              <Label
                htmlFor="redemptionDuration"
                className="text-sm font-medium text-gray-700"
              >
                Duration (Minutes)
              </Label>
              <Input
                id="redemptionDuration"
                type="number"
                min={0}
                placeholder="e.g., 60"
                className="mt-1"
                {...register("redemptionDuration", {
                  required: "Duration is required",
                })}
              />
            </div>
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
                className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="flex items-end gap-2">
              {!noExpiration && (
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
                      required: !noExpiration ? "End date is required" : false,
                    })}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <Controller
                  name="noExpiration"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="noExpiration"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="noExpiration"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  No Expiration
                </Label>
              </div>
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
              <Input
                id="redemptionRules"
                value={ruleInput}
                onChange={(e) => {
                  setRuleInput(e.target.value);
                  if (e.target.value.trim()) setRuleError("");
                }}
                placeholder="e.g., One per user per visit"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <Button
                type="button"
                onClick={handleAddRule}
                className="self-start bg-primary hover:bg-primary/80 text-white px-4 py-2 h-auto"
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

          {/* Status - only for edit */}
          {isEdit && (
            <div>
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status
              </Label>
              <select
                id="status"
                className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("status")}
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          )}

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
              className="bg-primary hover:bg-primary/80 text-white min-w-32 flex items-center justify-center gap-2"
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
