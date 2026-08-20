"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  clearBusinessDraft,
  fileToStored,
  loadBusinessDraft,
  saveBusinessDraft,
  storedToFile,
} from "@/lib/business-draft";
import { useAddBusinessMutation } from "@/redux/features/business/businessApi";
import { useCreateOfferMutation } from "@/redux/features/offer/offerApi";
import { useCreateCheckoutSessionMutation } from "@/redux/features/subscription/subscriptionApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { appAlert } from "@/lib/app-alert";
import { BusinessFormStep1 } from "./business-form-step1";
import { BusinessFormStep2 } from "./business-form-step2";
import { BusinessFormStep3 } from "./business-form-step3";
import { BusinessFormStep4, step4Inputs } from "./business-form-step4";
import { BusinessFormStep5 } from "./business-form-step5";
import { BusinessFormStep6 } from "./business-form-step6";

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Location" },
  { id: 3, label: "Media" },
  { id: 4, label: "Offer" },
  { id: 5, label: "Private" },
  { id: 6, label: "Plan" },
] as const;

const defaultValues = {
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
  mapUrl: "",
  hoursMonFriStart: "09:00",
  hoursMonFriEnd: "18:00",
  hoursSatSunStart: "10:00",
  hoursSatSunEnd: "16:00",
  offerTitle: "",
  offerDescription: "",
  offerDiscount: "",
  offerValidUntil: "",
  offerMaxRedemptions: "",
  offerDuration: "",
  offerDiscountType: "",
  offerBogoSecondType: "",
  offerValidFrom: "",
  offerNoExpiration: false,
  offerRedemptionRules: "",
  ownerPhone: "",
  invoicingEmail: "",
  selectedPlan: "",
  dailyHours: [
    { day: "Monday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
    { day: "Tuesday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
    { day: "Wednesday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
    { day: "Thursday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
    { day: "Friday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
    { day: "Saturday", isOpen: false, openTime: "09:00", closeTime: "16:00" },
    { day: "Sunday", isOpen: false, openTime: "09:00", closeTime: "16:00" },
  ],
};

export function AddBusinessForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [businessPhotos, setBusinessPhotos] = useState<File[]>([]);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [offerPhoto, setOfferPhoto] = useState<File | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formTopRef = useRef<HTMLDivElement | null>(null);
  const submittingRef = useRef(false);

  const [addBusiness, { isLoading: isSubmitting }] = useAddBusinessMutation();
  const [createOffer, { isLoading: isCreatingOffer }] =
    useCreateOfferMutation();
  const [createCheckoutSession, { isLoading: isCheckoutLoading }] =
    useCreateCheckoutSessionMutation();
  const isLoading = isSubmitting || isCreatingOffer || isCheckoutLoading;

  const { data: user } = useGetProfileQuery({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const form = useForm({
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    if (planParam && hydrated) {
      form.setValue("selectedPlan", planParam);
    }
  }, [planParam, hydrated, form]);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const draft = await loadBusinessDraft();
      if (cancelled) return;

      if (draft?.values) {
        form.reset({ ...defaultValues, ...draft.values });
        setCurrentStep(Math.min(Math.max(draft.step || 1, 1), 6));
        setMaxReachedStep(
          Math.min(Math.max(draft.maxReachedStep || draft.step || 1, 1), 6),
        );
        setBusinessPhotos((draft.photos || []).map(storedToFile));
        setMenuFile(draft.menu ? storedToFile(draft.menu) : null);
        setOfferPhoto(draft.offerPhoto ? storedToFile(draft.offerPhoto) : null);
        setDraftRestored(true);
      }

      setHydrated(true);
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, [form]);

  useEffect(() => {
    if (!hydrated || !user) return;
    if (!form.getValues("invoicingEmail") && user.email) {
      form.setValue("invoicingEmail", user.email);
    }
    if (!form.getValues("ownerPhone") && (user.phone || user.contactNumber)) {
      form.setValue("ownerPhone", user.phone || user.contactNumber);
    }
  }, [hydrated, user, form]);

  useEffect(() => {
    if (!hydrated) return;

    const persist = () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await saveBusinessDraft({
            step: currentStep,
            maxReachedStep,
            values: form.getValues(),
            photos: await Promise.all(businessPhotos.map(fileToStored)),
            menu: menuFile ? await fileToStored(menuFile) : null,
            offerPhoto: offerPhoto ? await fileToStored(offerPhoto) : null,
            savedAt: Date.now(),
          });
        } catch (error) {
          console.error("Failed to save business draft:", error);
        }
      }, 400);
    };

    persist();
    const subscription = form.watch(() => persist());
    return () => {
      subscription.unsubscribe();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [hydrated, currentStep, maxReachedStep, businessPhotos, menuFile, offerPhoto, form]);

  useEffect(() => {
    if (!hydrated) return;
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep, hydrated]);

  const goToStep = (step: number) => {
    if (step < 1 || step > 6) return;
    if (step > maxReachedStep) return;
    setCurrentStep(step);
  };

  const advanceStep = (next: number) => {
    setMaxReachedStep((prev) => Math.max(prev, next));
    setCurrentStep(next);
  };

  const handleClearDraft = async () => {
    await clearBusinessDraft();
    form.reset(defaultValues);
    setCurrentStep(1);
    setMaxReachedStep(1);
    setBusinessPhotos([]);
    setMenuFile(null);
    setOfferPhoto(null);
    setDraftRestored(false);
    toast.success("Draft cleared. You can start again.");
  };

  const step4WatchedValues = form.watch(step4Inputs as any);
  const step4InputValues = step4Inputs.reduce(
    (acc, inputName, index) => {
      acc[inputName] = step4WatchedValues[index];
      return acc;
    },
    {} as Record<(typeof step4Inputs)[number], any>,
  );

  const handleStep5Transition = async () => {
    const isValid = await form.trigger(["ownerPhone", "invoicingEmail"]);
    if (!isValid) return;
    advanceStep(6);
  };

  const onFinalSubmit = async (values: any) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
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
        ...(values.offerTitle
          ? {
              offer: {
                title: values.offerTitle,
                description: values.offerDescription,
                discount: values.offerDiscount,
                validFrom: values.offerValidFrom,
                validUntil: values.offerNoExpiration
                  ? null
                  : values.offerValidUntil,
                maxRedemptions: Number(values.offerMaxRedemptions) || 0,
                redemptionDuration: Number(values.offerDuration) || 0,
                discountType: values.offerDiscountType,
                discountValue:
                  values.offerDiscountType === "BOGO" &&
                  values.offerBogoSecondType !== "percentage"
                    ? 100
                    : Number(values.offerDiscount) || 0,
                bogoSecondType:
                  values.offerDiscountType === "BOGO"
                    ? values.offerBogoSecondType || "free"
                    : undefined,
                noExpiration: values.offerNoExpiration,
                redemptionRules: values.offerRedemptionRules
                  ? [values.offerRedemptionRules]
                  : [],
              },
            }
          : {}),
        plan: values.selectedPlan || undefined,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(businessData));

      if (values.selectedPlan) {
        formData.append("plan", values.selectedPlan);
        formData.append("planID", values.selectedPlan);
      }

      businessPhotos.forEach((photo) => {
        formData.append("images", photo);
      });

      if (menuFile) {
        formData.append("documents", menuFile);
      }

      const res = await addBusiness(formData).unwrap();

      if (res?.success === true) {
        const businessId =
          res?.data?._id ||
          res?.data?.id ||
          (typeof res?.data === "string" ? res?.data : null);

        if (businessId && step4InputValues.offerTitle) {
          try {
            const offerData = {
              title: step4InputValues.offerTitle,
              business: businessId,
              description: step4InputValues.offerDescription,
              discountType: step4InputValues.offerDiscountType,
              discountValue:
                step4InputValues.offerDiscountType === "BOGO" &&
                step4InputValues.offerBogoSecondType !== "percentage"
                  ? 100
                  : Number(step4InputValues.offerDiscount) || 0,
              bogoSecondType:
                step4InputValues.offerDiscountType === "BOGO"
                  ? step4InputValues.offerBogoSecondType || "free"
                  : undefined,
              validFrom:
                step4InputValues.offerValidFrom &&
                step4InputValues.offerValidFrom.trim() !== ""
                  ? new Date(step4InputValues.offerValidFrom).toISOString()
                  : new Date().toISOString(),
              validUntil: step4InputValues.offerNoExpiration
                ? null
                : step4InputValues.offerValidUntil &&
                    step4InputValues.offerValidUntil.trim() !== ""
                  ? new Date(step4InputValues.offerValidUntil).toISOString()
                  : null,
              noExpiration: step4InputValues.offerNoExpiration,
              maxRedemptions: Number(step4InputValues.offerMaxRedemptions) || 0,
              redemptionDuration: Number(step4InputValues.offerDuration) || 0,
              redemptionRules: step4InputValues.offerRedemptionRules
                ? [step4InputValues.offerRedemptionRules]
                : [],
              buttonLabel: "Redeem",
              status: "Active",
              redemptionsCount: 0,
            };

            const offerFormDataPayload = new FormData();
            offerFormDataPayload.append("data", JSON.stringify(offerData));

            if (offerPhoto) {
              offerFormDataPayload.append("images", offerPhoto);
            }

            await createOffer(offerFormDataPayload).unwrap();
            toast.success("Offer created successfully!");
          } catch (offerErr: any) {
            toast.error(
              offerErr?.data?.message ||
                offerErr?.message ||
                "Failed to create offer.",
            );
          }
        }

        await clearBusinessDraft();

        if (values.selectedPlan && businessId) {
          try {
            const checkoutRes = await createCheckoutSession({
              planId: values.selectedPlan,
              businessId,
              successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
              cancelUrl: `${window.location.origin}/profile/my-business`,
            }).unwrap();

            if (checkoutRes.data?.url || checkoutRes.url) {
              window.location.href = checkoutRes.data?.url || checkoutRes.url;
              return;
            }
          } catch {
            toast.error(
              "Failed to redirect to payment page. You can pay from your business list.",
            );
          }
        }

        await appAlert.fire({
          title: "Business created!",
          text: "Your listing is ready. You can view it anytime from My Business.",
          icon: "success",
          confirmButtonText: "View my business",
        });
        router.push("/profile/my-business");
      }
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to create business.";
      toast.error(message);
    } finally {
      submittingRef.current = false;
    }
  };

  const progressPercentage = (currentStep / 6) * 100;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">
            Restoring your progress...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 pb-16">
      <div ref={formTopRef} className="max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center md:text-left">
          Add Your Business
        </h1>

        {draftRestored && (
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-800">
              Your previous progress was restored. You can continue from where you left off.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleClearDraft}
              className="h-9 text-xs font-semibold border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              Clear draft
            </Button>
          </div>
        )}

        <div className="mb-4 md:mb-8 space-y-4 border p-4 md:p-6 rounded-lg border-gray-200/50">
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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {STEPS.map((step) => {
              const reachable = step.id <= maxReachedStep;
              const active = step.id === currentStep;
              const done = step.id < currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(step.id)}
                  disabled={!reachable}
                  className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-yellow-400 text-black"
                      : done
                        ? "bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
                        : reachable
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {step.id}. {step.label}
                </button>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFinalSubmit)}
            className="bg-white rounded-lg border border-gray-200/50 p-4 md:p-8 space-y-8"
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
            {currentStep === 4 && (
              <BusinessFormStep4
                form={form}
                offerPhoto={offerPhoto}
                onOfferPhotoChange={setOfferPhoto}
              />
            )}
            {currentStep === 5 && <BusinessFormStep5 form={form} />}
            {currentStep === 6 && <BusinessFormStep6 form={form} />}

            <div className="flex gap-3 pt-8 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-6 text-base font-semibold"
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}

              {currentStep < 5 && (
                <Button
                  type="button"
                  onClick={async () => {
                    const validationKeys: Record<number, any[]> = {
                      1: [
                        "businessName",
                        "category",
                        "phoneNumber",
                        "businessDescription",
                        "streetAddress",
                        "city",
                        "country",
                      ],
                      2: ["mapLocation"],
                      3: [],
                      4: [],
                    };
                    const isValid = await form.trigger(
                      (validationKeys[currentStep] || []) as any,
                    );
                    if (isValid) {
                      if (currentStep === 2) {
                        const mapLocation = form.getValues("mapLocation");
                        if (!mapLocation) {
                          toast.error("Please set a map location pointer.");
                          return;
                        }
                      }
                      if (currentStep === 3) {
                        if (businessPhotos.length === 0) {
                          toast.error(
                            "Please upload at least one business photo.",
                          );
                          return;
                        }
                        if (!menuFile) {
                          toast.error("Please upload a menu or price list.");
                          return;
                        }
                      }
                      if (currentStep === 4) {
                        const offerTitle = form.getValues("offerTitle");
                        if (offerTitle && offerTitle.trim() !== "") {
                          const offerDescription =
                            form.getValues("offerDescription");
                          const offerDiscountType =
                            form.getValues("offerDiscountType");
                          const offerDiscount = form.getValues("offerDiscount");
                          const offerDuration = form.getValues("offerDuration");
                          const offerMaxRedemptions =
                            form.getValues("offerMaxRedemptions");
                          const offerValidFrom = form.getValues("offerValidFrom");
                          const offerValidUntil =
                            form.getValues("offerValidUntil");
                          const offerNoExpiration =
                            form.getValues("offerNoExpiration");

                          let hasError = false;

                          if (!offerPhoto) {
                            toast.error(
                              "Please upload a photo for this offer.",
                            );
                            hasError = true;
                          }
                          if (
                            !offerDescription ||
                            offerDescription.trim() === ""
                          ) {
                            form.setError("offerDescription", {
                              type: "custom",
                              message: "Please enter an offer description.",
                            });
                            hasError = true;
                          }
                          if (!offerDiscountType) {
                            form.setError("offerDiscountType", {
                              type: "custom",
                              message: "Please select a discount type.",
                            });
                            hasError = true;
                          }
                          if (offerDiscountType === "BOGO") {
                            const bogoSecondType =
                              form.getValues("offerBogoSecondType");
                            if (!bogoSecondType) {
                              form.setError("offerBogoSecondType", {
                                type: "custom",
                                message:
                                  "Choose whether the second item is free or has a % discount.",
                              });
                              hasError = true;
                            } else if (bogoSecondType === "percentage") {
                              if (
                                !offerDiscount ||
                                Number(offerDiscount) <= 0 ||
                                Number(offerDiscount) > 100
                              ) {
                                form.setError("offerDiscount", {
                                  type: "custom",
                                  message:
                                    "Enter 1–100% off the second item.",
                                });
                                hasError = true;
                              }
                            }
                          } else if (offerDiscountType !== "Free item") {
                            if (!offerDiscount || Number(offerDiscount) <= 0) {
                              form.setError("offerDiscount", {
                                type: "custom",
                                message:
                                  "Please enter a valid discount value greater than 0.",
                              });
                              hasError = true;
                            }
                          }
                          if (!offerDuration || Number(offerDuration) <= 0) {
                            form.setError("offerDuration", {
                              type: "custom",
                              message:
                                "Please enter a valid offer duration in minutes.",
                            });
                            hasError = true;
                          }
                          if (
                            !offerMaxRedemptions ||
                            Number(offerMaxRedemptions) < 0
                          ) {
                            form.setError("offerMaxRedemptions", {
                              type: "custom",
                              message:
                                "Please enter a valid max redemptions count.",
                            });
                            hasError = true;
                          }
                          if (!offerValidFrom) {
                            form.setError("offerValidFrom", {
                              type: "custom",
                              message: "Please select a valid from date.",
                            });
                            hasError = true;
                          }
                          if (!offerNoExpiration && !offerValidUntil) {
                            form.setError("offerValidUntil", {
                              type: "custom",
                              message:
                                "Please select a valid until date or check 'No Expiration'.",
                            });
                            hasError = true;
                          }

                          if (hasError) return;
                        }
                      }
                      advanceStep(currentStep + 1);
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  Continue
                </Button>
              )}

              {currentStep === 5 && (
                <Button
                  type="button"
                  onClick={handleStep5Transition}
                  disabled={isLoading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  Continue
                </Button>
              )}

              {currentStep === 6 && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Business...</span>
                    </div>
                  ) : (
                    "Save & Finish"
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
