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

export function AddBusinessForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessPhotos, setBusinessPhotos] = useState<File[]>([]);
  const [menuFile, setMenuFile] = useState<File | null>(null);

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

  const onSubmit = async (data: any) => {
    if (currentStep === 4) {
      setIsSubmitting(true);
      try {
        console.log("BUSINESS FORM SUBMISSION", data);

        // Here you would typically send data to a backend API
        alert("Business submitted successfully! Check console for details.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 pb-16">
      <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-lg">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-8">
          Add Your Business
        </h1>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-8 space-y-2 border p-6 rounded-lg border-gray-200/50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm md:text-base text-gray-500/80 uppercase tracking-wider font-bold">
                Business Progress
              </p>
            </div>
            <p className="text-sm font-semibold text-primary">
              Step {currentStep} of 5 ({progressPercentage.toFixed(0)}%)
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-lg border border-gray-200/50 p-8 space-y-8"
          >
            {currentStep === 1 && <BusinessFormStep1 form={form} />}
            {currentStep === 2 && (
              <BusinessFormStep2
                businessPhotos={businessPhotos}
                menuFile={menuFile}
                onPhotosChange={setBusinessPhotos}
                onMenuChange={setMenuFile}
              />
            )}
            {currentStep === 3 && <BusinessFormStep3 form={form} />}
            {currentStep === 4 && <BusinessFormStep4 form={form} />}
            {currentStep === 5 && <BusinessFormStep5 form={form} />}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-8 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-6 text-base font-semibold"
                >
                  Back
                </Button>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={async () => {
                    // Validate current step fields
                    const fieldsToValidate = {
                      1: [
                        "businessName",
                        "category",
                        "businessDescription",
                        "phoneNumber",
                        "streetAddress",
                        "city",
                        "country",
                      ],
                      2: [],
                      3: [],
                      4: ["ownerPhone", "invoicingEmail"],
                    };

                    const stepFields =
                      fieldsToValidate[
                        currentStep as keyof typeof fieldsToValidate
                      ] || [];
                    const isValid = await form.trigger(stepFields as any);

                    if (isValid || currentStep === 2 || currentStep === 3) {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-6 text-base"
                >
                  {isSubmitting ? "Submitting..." : "Submit and Finish"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
