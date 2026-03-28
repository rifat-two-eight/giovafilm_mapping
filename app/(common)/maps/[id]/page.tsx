"use client";

import { markers } from "@/components/Common/maps/map";
import MapDetails from "@/components/Common/maps/map-details";
import RestaurantDetail from "@/components/Common/maps/restaurant-detail";
import { useParams } from "next/navigation";

export default function page() {
  const params = useParams();
  const id = Number(params?.id);
  console.log(id);

  const marker = markers.find((marker) => marker.id === id);

  if (!marker) {
    return <div>Marker not found</div>;
  }

  return (
    <div>
      {marker.type === "restaurant" ? <RestaurantDetail /> : <MapDetails />}
    </div>
  );
}
