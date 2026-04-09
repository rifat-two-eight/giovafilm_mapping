// "use client";

// import { ViewContext } from "@/components/context/view-context";
// import BottomNavbar from "@/components/shared/bottom-navbar";
// import TopHeader from "@/components/shared/top-header";
// import { usePathname } from "next/navigation";
// import React, { useState } from "react";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const [largeView, setLargeView] = useState(false);
//   const pathName = usePathname();

//   return (
//     <ViewContext.Provider value={{ largeView, setLargeView }}>
//       <div
//         className={`bg-white  w-full mx-auto transition-all duration-300 ${
//           largeView ? "max-w-7xl" : "max-w-107.5 shadow-2xl"
//         }`}
//       >
//         {pathName !== "/profile" && <TopHeader />}

//         <div className="flex justify-end px-4 pt-2">
//           <button
//             onClick={() => setLargeView(!largeView)}
//             className="text-xs px-3 py-1 border rounded-md"
//           >
//             {largeView ? "Switch to Default View" : "Switch to Large View"}
//           </button>
//         </div>

//         {children}

//         {pathName !== "/profile" && <BottomNavbar />}
//         {/* {largeView ? "" : <BottomNavbar />} */}
//       </div>
//     </ViewContext.Provider>
//   );
// }
