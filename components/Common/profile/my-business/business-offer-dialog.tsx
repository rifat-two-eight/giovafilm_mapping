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
import { getImageUrl } from "@/lib/utils";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
} from "@/redux/features/offer/offerApi";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  existingOffer?: any | null;
};

export function BusinessOfferDialog({
  open,
  onOpenChange,
  businessId,
  existingOffer,
}: Props) {
  const isEdit = !!existingOffer?._id;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [bogoSecondType, setBogoSecondType] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [noExpiration, setNoExpiration] = useState(false);
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [redemptionDuration, setRedemptionDuration] = useState("");
  const [redemptionRules, setRedemptionRules] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    if (existingOffer) {
      setTitle(existingOffer.title || "");
      setDescription(existingOffer.description || "");
      setDiscountType(existingOffer.discountType || "");
      setDiscountValue(
        existingOffer.discountValue != null
          ? String(existingOffer.discountValue)
          : existingOffer.discount != null
            ? String(existingOffer.discount)
            : "",
      );
      setBogoSecondType(existingOffer.bogoSecondType || "");
      setValidFrom(
        existingOffer.validFrom
          ? new Date(existingOffer.validFrom).toISOString().split("T")[0]
          : "",
      );
      setValidUntil(
        existingOffer.validUntil
          ? new Date(existingOffer.validUntil).toISOString().split("T")[0]
          : "",
      );
      setNoExpiration(!!existingOffer.noExpiration);
      setMaxRedemptions(
        existingOffer.maxRedemptions != null
          ? String(existingOffer.maxRedemptions)
          : "",
      );
      setRedemptionDuration(
        existingOffer.redemptionDuration != null
          ? String(existingOffer.redemptionDuration)
          : "",
      );
      setRedemptionRules(
        Array.isArray(existingOffer.redemptionRules)
          ? existingOffer.redemptionRules.join("\n")
          : existingOffer.redemptionRules || "",
      );
      setPreview(
        existingOffer.photo || existingOffer.images
          ? getImageUrl(existingOffer.images || existingOffer.photo)
          : null,
      );
      setPhotoFile(null);
    } else {
      setTitle("");
      setDescription("");
      setDiscountType("");
      setDiscountValue("");
      setBogoSecondType("");
      setValidFrom("");
      setValidUntil("");
      setNoExpiration(false);
      setMaxRedemptions("");
      setRedemptionDuration("");
      setRedemptionRules("");
      setPreview(null);
      setPhotoFile(null);
    }

    if (fileRef.current) fileRef.current.value = "";
  }, [open, existingOffer]);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    if (!file && fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !discountType) {
      toast.error("Please fill in title, description, and discount type.");
      return;
    }
    if (!photoFile && !isEdit) {
      toast.error("Please add a photo for this offer.");
      return;
    }
    if (discountType === "BOGO" && !bogoSecondType) {
      toast.error("Choose whether the second item is free or has a % discount.");
      return;
    }
    if (
      (discountType === "Percentage" ||
        discountType === "Flat" ||
        (discountType === "BOGO" && bogoSecondType === "percentage")) &&
      (!discountValue || Number(discountValue) <= 0)
    ) {
      toast.error("Please enter a valid discount value.");
      return;
    }
    if (discountType === "BOGO" && bogoSecondType === "percentage") {
      const pct = Number(discountValue);
      if (pct > 100) {
        toast.error("Second-item discount must be between 1 and 100.");
        return;
      }
    }
    if (!redemptionDuration || Number(redemptionDuration) <= 0) {
      toast.error("Please enter redemption duration in minutes.");
      return;
    }
    if (!maxRedemptions || Number(maxRedemptions) < 0) {
      toast.error("Please enter max redemptions.");
      return;
    }
    if (!validFrom) {
      toast.error("Please select a valid from date.");
      return;
    }
    if (!noExpiration && !validUntil) {
      toast.error("Select a valid until date, or check No Expiration.");
      return;
    }

    const offerData: any = {
      title: title.trim(),
      description: description.trim(),
      business: businessId,
      discountType,
      discountValue:
        discountType === "BOGO" && bogoSecondType !== "percentage"
          ? 100
          : Number(discountValue) || 0,
      ...(discountType === "BOGO"
        ? { bogoSecondType: bogoSecondType || "free" }
        : {}),
      validFrom: new Date(validFrom).toISOString(),
      validUntil: noExpiration
        ? null
        : validUntil
          ? new Date(validUntil).toISOString()
          : null,
      noExpiration,
      maxRedemptions: Number(maxRedemptions) || 0,
      redemptionDuration: Number(redemptionDuration) || 0,
      redemptionRules: redemptionRules
        .split("\n")
        .map((rule) => rule.trim())
        .filter(Boolean),
      buttonLabel: "Redeem",
      status: existingOffer?.status || "Active",
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(offerData));
    if (photoFile) {
      formData.append("images", photoFile);
    }

    try {
      if (isEdit) {
        await updateOffer({ id: existingOffer._id, data: formData }).unwrap();
        toast.success("Offer updated successfully.");
      } else {
        await createOffer(formData).unwrap();
        toast.success("Offer created successfully.");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} offer`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Offer" : "Add Offer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Offer Photo
            </Label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-yellow-400 transition-colors cursor-pointer bg-gray-50"
            >
              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Offer preview"
                    className="max-h-40 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePhotoChange(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                    aria-label="Remove offer photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto mb-2 text-gray-400" size={28} />
                  <p className="text-sm font-medium text-gray-700">
                    Upload offer photo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG or JPG, up to 10MB
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="offer-title">Offer Title</Label>
            <Input
              id="offer-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 20% off Coffee"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="offer-description">Description</Label>
            <textarea
              id="offer-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the offer..."
              rows={4}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <Label htmlFor="offer-discount-type">Discount Type</Label>
            <select
              id="offer-discount-type"
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                setBogoSecondType("");
                if (e.target.value === "BOGO" || e.target.value === "Free item") {
                  setDiscountValue("");
                }
              }}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Select type</option>
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat Amount</option>
              <option value="BOGO">Buy One Get One (BOGO)</option>
              <option value="Free item">Free Item</option>
            </select>
          </div>

          {discountType === "BOGO" && (
            <div className="space-y-3 rounded-xl border border-yellow-200 bg-yellow-50/70 p-4">
              <div>
                <Label htmlFor="offer-bogo-type">Second item</Label>
                <select
                  id="offer-bogo-type"
                  value={bogoSecondType}
                  onChange={(e) => setBogoSecondType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Choose how the second item is discounted</option>
                  <option value="free">Second item is free</option>
                  <option value="percentage">Second item has a % discount</option>
                </select>
              </div>
              {bogoSecondType === "percentage" && (
                <div>
                  <Label htmlFor="offer-discount-value">% off second item</Label>
                  <Input
                    id="offer-discount-value"
                    type="number"
                    min={1}
                    max={100}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="e.g., 50"
                    className="mt-1 bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {discountType !== "BOGO" && discountType !== "Free item" && discountType && (
            <div>
              <Label htmlFor="offer-discount-value">Discount Value</Label>
              <Input
                id="offer-discount-value"
                type="number"
                min={0}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="e.g., 10"
                className="mt-1"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offer-max">Max Redemptions</Label>
              <Input
                id="offer-max"
                type="number"
                min={0}
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                placeholder="e.g., 100"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="offer-duration">Duration (Minutes)</Label>
              <Input
                id="offer-duration"
                type="number"
                min={0}
                value={redemptionDuration}
                onChange={(e) => setRedemptionDuration(e.target.value)}
                placeholder="e.g., 60"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offer-from">Valid From</Label>
              <Input
                id="offer-from"
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              {!noExpiration && (
                <div>
                  <Label htmlFor="offer-until">Valid Until</Label>
                  <Input
                    id="offer-until"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={noExpiration}
                  onChange={(e) => setNoExpiration(e.target.checked)}
                />
                No Expiration
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="offer-rules">Redemption Rules</Label>
            <textarea
              id="offer-rules"
              value={redemptionRules}
              onChange={(e) => setRedemptionRules(e.target.value)}
              placeholder="One rule per line"
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-32">
              {isLoading ? "Saving..." : isEdit ? "Update Offer" : "Save Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
