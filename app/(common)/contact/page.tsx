import { ContactForm } from "@/components/Common/contact/contact-form";
import {
  ContactInfo,
  ContactInfoCard,
} from "@/components/Common/contact/contact-info-card";
import { ContactMapSection } from "@/components/Common/contact/contact-map-section";

const contactInfoData: ContactInfo[] = [
  {
    id: 1,
    icon: "mail",
    title: "Email Support",
    description: "Our team usually responds within 24 hours.",
    content: "Roadtripeado@gmail.com",
    contentType: "email",
  },
  {
    id: 2,
    icon: "globe",
    title: "Social Media",
    description: "Follow our latest updates and travel tips.",
    content: ["facebook", "instagram", "youtube", "tiktok"],
    contentType: "social",
  },
];

export default function GetInTouchPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-360 mx-auto px-4 py-12 md:py-16 flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1 space-y-8">
          <div className="space-y-6">
            <div className="">
              <span className="bg-primary/40 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Connect With Us
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-black">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              Have questions about our maps or your next adventure? We are here
              to help you plan the ultimate road trip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactInfoData.map((item) => (
              <ContactInfoCard data={item} key={item.id} />
            ))}
          </div>

          <ContactMapSection />
        </div>

        <div className="flex-1">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
