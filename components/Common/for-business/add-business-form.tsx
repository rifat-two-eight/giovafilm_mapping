"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAddBusinessMutation } from "@/redux/features/business/businessApi";
import { useCreateCheckoutSessionMutation } from "@/redux/features/subscription/subscriptionApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BusinessFormStep1 } from "./business-form-step1";
import { BusinessFormStep2 } from "./business-form-step2";
import { BusinessFormStep3 } from "./business-form-step3";
import { BusinessFormStep4 } from "./business-form-step4";
import { BusinessFormStep5 } from "./business-form-step5";
import { BusinessFormStep6 } from "./business-form-step6";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useRouter } from "next/navigation";

export function AddBusinessForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessPhotos, setBusinessPhotos] = useState<File[]>([]);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [addBusiness, { isLoading: isCreating }] = useAddBusinessMutation();
  const [createCheckoutSession, { isLoading: isSubmitting }] =
    useCreateCheckoutSessionMutation();

  const { data: user } = useGetProfileQuery({});
  const router = useRouter();

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
      dailyHours: [
        { day: "Monday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
        {
          day: "Tuesday",
          isOpen: false,
          openTime: "09:00",
          closeTime: "18:00",
        },
        {
          day: "Wednesday",
          isOpen: false,
          openTime: "09:00",
          closeTime: "18:00",
        },
        {
          day: "Thursday",
          isOpen: false,
          openTime: "09:00",
          closeTime: "18:00",
        },
        { day: "Friday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
        {
          day: "Saturday",
          isOpen: false,
          openTime: "09:00",
          closeTime: "18:00",
        },
        { day: "Sunday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
      ],
    },
  });

  // Step 5 Creation Logic
  const handleStep5Transition = async () => {
    // Validate Step 5 fields
    const isValid = await form.trigger(["ownerPhone", "invoicingEmail"]);
    if (!isValid) return;

    const userData = user?.data || user;
    const hasActiveSubscription =
      userData?.subscriptionStatus === "active" ||
      userData?.subscribe === "true" ||
      userData?.subscribe === true;

    // If already created, just move forward
    if (businessId) {
      if (hasActiveSubscription) {
        toast.success("Redirecting to maps...");
        router.push("/maps");
      } else {
        setCurrentStep(6);
      }
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
          schedule: values.dailyHours
            .filter((h: any) => h.isOpen)
            .map((h: any) => ({
              days: h.day,
              openTime: h.openTime,
              closeTime: h.closeTime,
            })),
        },
        privateInfo: {
          ownerPhone: values.ownerPhone,
          contactEmail: values.invoicingEmail,
        },
        // Only include offer if title is provided
        ...(values.offerTitle
          ? {
              offer: {
                title: values.offerTitle,
                description: values.offerDescription,
                discount: values.offerDiscount,
                validUntil: values.offerValidUntil,
              },
            }
          : {}),
      };

      const formData = new FormData();

      // ✅ "data" must match exactly what your backend expects (e.g. upload.fields + body parser)
      formData.append("data", JSON.stringify(businessData));

      // ✅ "images" — append each photo individually under the SAME field name
      businessPhotos.forEach((photo) => {
        formData.append("images", photo);
      });

      if (menuFile) {
        formData.append("images", menuFile);
      }

      const res = await addBusiness(formData).unwrap();
      const newId = res?.data?._id || res?._id;
      setBusinessId(newId);

      if (hasActiveSubscription) {
        toast.success("Business created successfully!");
        router.push("/maps");
      } else {
        toast.success("Business created! Now choose your plan.");
        setCurrentStep(6);
      }
    } catch (err: any) {
      // Show the exact backend error message for easier debugging
      const message =
        err?.data?.message || err?.message || "Failed to create business.";
      toast.error(message);
      console.error("Business creation error:", err);
    }
  };

  const onFinalSubmit = async (values: any) => {
    if (!values.selectedPlan) {
      toast.error("Please select a pricing plan to continue.");
      return;
    }

    try {
      const res = await createCheckoutSession({
        planId: values.selectedPlan,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }).unwrap();

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Something went wrong. Please try again.",
      );
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
                    const validationKeys: Record<number, any[]> = {
                      1: ["businessName", "category", "phoneNumber"],
                      2: ["mapLocation"],
                      3: [],
                      4: [],
                    };
                    const isValid = await form.trigger(
                      (validationKeys[currentStep] || []) as any,
                    );
                    if (isValid) {
                      setCurrentStep(currentStep + 1);
                    } else if (
                      currentStep === 2 &&
                      !form.getValues("mapLocation")
                    ) {
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
                  disabled={isSubmitting}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Purchase and Finish"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
