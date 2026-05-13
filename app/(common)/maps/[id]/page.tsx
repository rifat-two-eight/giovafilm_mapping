"use client";

import MapDetails from "@/components/Common/maps/map-details";
import BusinessDetails from "@/components/Common/profile/my-business/business-details";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  if (type === "business") {
    return <BusinessDetails />;
  }

  return <MapDetails />;
}
