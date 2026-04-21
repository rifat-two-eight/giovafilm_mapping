import { BillingSettings } from "@/components/dashboard/settings/billing-settings";

export default function Subscription() {
  return (
    <div className="max-w-360 mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-10">SUBSCRIPTION</h1>
      <BillingSettings />
    </div>
  );
}
