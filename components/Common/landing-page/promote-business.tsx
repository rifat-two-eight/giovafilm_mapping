import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: "High-Quality Traffic",
    description: "Reach intentional travelers who want what you offer.",
  },
  {
    title: "Brand Storytelling",
    description: "Share your story through rich media on our platform.",
  },
  {
    title: "Actionable Data",
    description: "Understand visitor trends and preferences.",
  },
];

export default function PromoteBusiness() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Yellow Container */}
        <div className="bg-primary rounded-[48px] p-10 md:py-16 px-8 text-center font-inter">
          {/* Heading */}
          <h2 className="text-4xl font-bold mb-4">Promote Your Business</h2>

          <p className="text-gray-800 max-w-2xl mx-auto mb-9 md:mb-12">
            Get discovered by travelers looking for authentic local experiences.
            Join our network of curated partners and grow your reach.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-yellow-200/40 border-none rounded-2xl shadow-none"
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-800">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          <Link href={"/for-business"}>
            <Button className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-6 rounded-xl">
              Add Your Business
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
