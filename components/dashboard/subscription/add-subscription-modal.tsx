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
import { useCreateSubscriptionPlanMutation } from "@/redux/features/subscription/subscriptionApi";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSubscriptionModal({
  isOpen,
  onClose,
}: AddSubscriptionModalProps) {
  const [createSubscriptionPlan, { isLoading }] =
    useCreateSubscriptionPlanMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    currency: "usd",
    interval: "month",
    intervalCount: 1,
    trialPeriodDays: 0,
  });

  const [features, setFeatures] = useState<string[]>([""]);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "intervalCount" ||
        name === "trialPeriodDays"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: features.filter((f) => f.trim() !== ""),
    };

    try {
      const res = await createSubscriptionPlan(payload).unwrap();
      if (res.success || res.data) {
        toast.success("Subscription plan created successfully!");
        onClose();
        setFormData({
          name: "",
          description: "",
          price: 0,
          currency: "usd",
          interval: "month",
          intervalCount: 1,
          trialPeriodDays: 0,
        });
        setFeatures([""]);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create subscription plan");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase">
            Add New Subscription Plan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Free Plan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Interval</Label>
              <select
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Interval Count</Label>
              <Input
                name="intervalCount"
                type="number"
                value={formData.intervalCount}
                onChange={handleChange}
                min={1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Trial Period Days</Label>
              <Input
                name="trialPeriodDays"
                type="number"
                value={formData.trialPeriodDays}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Basic access to the platform with limited features."
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Features</Label>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  required
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Feature
            </Button>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-black font-black uppercase"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Plan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
