"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BusinessFormStep1 } from "./business-form-step1";
import { BusinessFormStep2 } from "./business-form-step2";
import { BusinessFormStep3 } from "./business-form-step3";
import { BusinessFormStep4 } from "./business-form-step4";
import { BusinessFormStep5 } from "./business-form-step5";
import { BusinessFormStep6 } from "./business-form-step6";
import { useAddBusinessMutation } from "@/redux/features/business/businessApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddBusinessForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessPhotos, setBusinessPhotos] = useState<File[]>([]);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const router = useRouter();

  const [addBusiness, { isLoading: isCreating }] = useAddBusinessMutation();

  const form = useForm({
    defaultValues: {
      businessName: "",
      category: "",
      businessDescription: "",
      phoneNumber: "",
      website: "",
      instagram: "",
      streetAddress: "",
      city: "",
      country: "",
      mapLocation: null as { lat: number; lng: number } | null,
      hoursMonFriStart: "09:00",
      hoursMonFriEnd: "18:00",
      hoursSatSunStart: "10:00",
      hoursSatSunEnd: "16:00",
      offerTitle: "",
      offerDescription: "",
      offerDiscount: "",
      offerValidUntil: "",
      ownerPhone: "",
      invoicingEmail: "",
      selectedPlan: "",
    },
  });

  // Step 5 Creation Logic
  const handleStep5Transition = async () => {
    // Validate Step 5 fields
    const isValid = await form.trigger(["ownerPhone", "invoicingEmail"]);
    if (!isValid) return;

    // If already created, just move forward
    if (businessId) {
      setCurrentStep(6);
      return;
    }

    try {
      const values = form.getValues();
      const businessData = {
        name: values.businessName,
        category: values.category,
        description: values.businessDescription,
        contact: {
          phone: values.phoneNumber,
          website: values.website,
          instagram: values.instagram,
        },
        location: {
          address: values.streetAddress,
          city: values.city,
          country: values.country,
          mapLocation: values.mapLocation
            ? {
                type: "Point",
                coordinates: [values.mapLocation.lng, values.mapLocation.lat],
              }
            : undefined,
        },
        hours: {
          customHours: true,
          schedule: [
            ...["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({
              days: day,
              openTime: values.hoursMonFriStart,
              closeTime: values.hoursMonFriEnd,
            })),
            ...["Saturday", "Sunday"].map((day) => ({
              days: day,
              openTime: values.hoursSatSunStart,
              closeTime: values.hoursSatSunEnd,
            })),
          ],
        },
        privateInfo: {
          ownerPhone: values.ownerPhone,
          contactEmail: values.invoicingEmail,
        },
        offer: values.offerTitle
          ? {
              title: values.offerTitle,
              description: values.offerDescription,
              discount: values.offerDiscount,
              validUntil: values.offerValidUntil,
            }
          : undefined,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(businessData));
      businessPhotos.forEach((p) => formData.append("photos", p));
      if (menuFile) formData.append("menu", menuFile);

      const res = await addBusiness(formData).unwrap();
      const newId = res?.data?._id || res?._id;
      setBusinessId(newId);
      
      toast.success("Business created! Now choose your plan.");
      setCurrentStep(6);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create business.");
    }
  };

  const onFinalSubmit = async (values: any) => {
    if (!values.selectedPlan) {
      toast.error("Please select a pricing plan to continue.");
      return;
    }
    
    try {
      // Here you would typically call a 'subscribe' or 'purchase' API
      // Since we don't have one in the context, we'll simulate success
      toast.success("Package purchased successfully!");
      router.push("/dashboard/business");
    } catch (err) {
      toast.error("Failed to process purchase.");
    }
  };

  const progressPercentage = (currentStep / 6) * 100;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 pb-16">
      <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center md:text-left">
          Add Your Business
        </h1>

        <div className="mb-4 md:mb-8 space-y-2 border p-6 rounded-lg border-gray-200/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm md:text-base text-gray-500/80 uppercase tracking-wider font-bold">
              Business Progress
            </p>
            <p className="text-sm font-semibold text-primary">
              Step {currentStep} of 6 ({progressPercentage.toFixed(0)}%)
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFinalSubmit)}
            className="bg-white rounded-lg border border-gray-200/50 p-8 space-y-8"
          >
            {currentStep === 1 && <BusinessFormStep1 form={form} />}
            {currentStep === 2 && <BusinessFormStep2 form={form} />}
            {currentStep === 3 && (
              <BusinessFormStep3
                businessPhotos={businessPhotos}
                menuFile={menuFile}
                onPhotosChange={setBusinessPhotos}
                onMenuChange={setMenuFile}
              />
            )}
            {currentStep === 4 && <BusinessFormStep4 form={form} />}
            {currentStep === 5 && <BusinessFormStep5 form={form} />}
            {currentStep === 6 && <BusinessFormStep6 form={form} />}

            <div className="flex gap-3 pt-8 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-6 text-base font-semibold"
                  disabled={isCreating}
                >
                  Back
                </Button>
              )}

              {currentStep < 5 && (
                <Button
                  type="button"
                  onClick={async () => {
                    const validationKeys: any = {
                      1: ["businessName", "category", "phoneNumber"],
                      2: ["mapLocation"],
                      3: [],
                      4: [],
                    };
                    const isValid = await form.trigger(validationKeys[currentStep] || []);
                    if (isValid) setCurrentStep(currentStep + 1);
                    else if (currentStep === 2 && !form.getValues("mapLocation")) {
                       toast.error("Please set a map location pointer.");
                    }
                  }}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  Continue
                </Button>
              )}

              {currentStep === 5 && (
                <Button
                  type="button"
                  onClick={handleStep5Transition}
                  disabled={isCreating}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  {isCreating ? "Creating Business..." : "Create and Continue"}
                </Button>
              )}

              {currentStep === 6 && (
                <Button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  Purchase and Finish
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
