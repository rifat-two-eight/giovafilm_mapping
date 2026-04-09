// "use client";

import MapPage2 from "@/components/Common/maps/map copy";

// import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

// export default function GoogleMapConfig() {
//   // ঢাকা শহরের কোঅর্ডিনেটস (উদাহরণস্বরূপ)
//   const position = { lat: 23.8103, lng: 90.4125 };

//   return (
//     <div style={{ height: "500px", width: "100%" }}>
//       <APIProvider
//         apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
//       >
//         <Map
//           defaultCenter={position}
//           defaultZoom={13}
//           gestureHandling={"greedy"}
//           disableDefaultUI={false}
//         >
//           {/* ম্যাপে একটি মার্কার দেখানোর জন্য */}
//           <Marker position={position} />
//         </Map>
//       </APIProvider>
//     </div>
//   );
// }

export default function page() {
  return (
    <div>
      <MapPage2 />
    </div>
  );
}
