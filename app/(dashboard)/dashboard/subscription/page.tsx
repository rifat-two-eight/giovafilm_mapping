// "use client";

// import {
//   useGetSubscriptionPlansQuery,
//   useCreateCheckoutSessionMutation,
// } from "@/redux/features/subscription/subscriptionApi";
// import { Check, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// export default function SubscriptionPage() {
//   const { data: plansRes, isLoading: isLoadingPlans } =
//     useGetSubscriptionPlansQuery();
//   const [createCheckoutSession, { isLoading: isCreatingSession }] =
//     useCreateCheckoutSessionMutation();

//   const plans = plansRes?.data || [];

//   // Mock subscription history data
//   const subscriptionHistory = [
//     {
//       id: "SUB-12345",
//       plan: "Professional Plan",
//       amount: "$49.00",
//       date: "2024-03-15",
//       status: "Active",
//       nextBilling: "2024-04-15",
//     },
//     {
//       id: "SUB-12122",
//       plan: "Professional Plan",
//       amount: "$49.00",
//       date: "2024-02-15",
//       status: "Completed",
//       nextBilling: "-",
//     },
//   ];

//   const handleSubscribe = async (planId: string) => {
//     try {
//       const res = await createCheckoutSession({ planId }).unwrap();
//       if (res.data?.url) {
//         window.location.href = res.data.url;
//       }
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to initiate subscription");
//     }
//   };

//   return (
//     <div className="p-6 space-y-10">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
//           Subscription Plans
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Choose the best plan for your business needs.
//         </p>
//       </div>

//       {/* Plans Grid */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {isLoadingPlans ? (
//           <div className="col-span-full flex items-center justify-center py-20">
//             <Loader2 className="w-10 h-10 animate-spin text-primary" />
//           </div>
//         ) : (
//           plans.map((plan: any) => (
//             <div
//               key={plan._id}
//               className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col relative overflow-hidden group"
//             >
//               {plan.isPopular && (
//                 <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-widest">
//                   Popular
//                 </div>
//               )}

//               <div className="mb-8">
//                 <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
//                   {plan.name}
//                 </h3>
//                 <div className="flex items-baseline gap-1">
//                   <span className="text-4xl font-black text-gray-900">
//                     ${plan.price}
//                   </span>
//                   <span className="text-gray-500 font-medium lowercase">
//                     /{plan.duration}
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-4 mb-10 flex-1">
//                 {plan.features?.map((feature: string, idx: number) => (
//                   <div key={idx} className="flex items-start gap-3">
//                     <div className="mt-1 bg-green-100 p-0.5 rounded-full">
//                       <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />
//                     </div>
//                     <p className="text-sm text-gray-600 font-medium">
//                       {feature}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <Button
//                 onClick={() => handleSubscribe(plan._id)}
//                 disabled={isCreatingSession}
//                 className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest py-6 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform"
//               >
//                 {isCreatingSession ? "Processing..." : "Subscribe Now"}
//               </Button>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Subscription Table */}
//       <div className="space-y-6">
//         <div>
//           <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
//             Subscription History
//           </h2>
//           <p className="text-gray-500 mt-1">
//             Manage and view your past transactions.
//           </p>
//         </div>

//         <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-200">
//                   <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
//                     Transaction ID
//                   </th>
//                   <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
//                     Plan
//                   </th>
//                   <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
//                     Amount
//                   </th>
//                   <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
//                     Date
//                   </th>
//                   <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
//                     Next Billing
//                   </th>
//                   <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {subscriptionHistory.map((sub) => (
//                   <tr
//                     key={sub.id}
//                     className="hover:bg-gray-50/50 transition-colors"
//                   >
//                     <td className="px-6 py-5 text-sm font-bold text-gray-900 uppercase">
//                       {sub.id}
//                     </td>
//                     <td className="px-6 py-5 text-sm font-medium text-gray-600">
//                       {sub.plan}
//                     </td>
//                     <td className="px-6 py-5 text-sm font-black text-gray-900">
//                       {sub.amount}
//                     </td>
//                     <td className="px-6 py-5 text-sm text-gray-500">
//                       {sub.date}
//                     </td>
//                     <td className="px-6 py-5 text-sm text-gray-500">
//                       {sub.nextBilling}
//                     </td>
//                     <td className="px-6 py-5">
//                       <span
//                         className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//                           sub.status === "Active"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {sub.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { PricingCard } from "@/components/Common/pricing/PricingCard";
import { SubscriptionTable } from "@/components/dashboard/subscription/all-subscription-table";
import { SubscriptionCard } from "@/components/dashboard/subscription/subscription-card";
import {
  useGetSubscriptionPlansQuery,
  useCreateCheckoutSessionMutation,
} from "@/redux/features/subscription/subscriptionApi";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";

export default function SubscriptionPage() {
  const { data: plansRes, isLoading } = useGetSubscriptionPlansQuery();
  const [createCheckoutSession, { isLoading: isCreating }] =
    useCreateCheckoutSessionMutation();

  const plans = plansRes?.data || [];

  // console.log(plans);

  const subscriptionHistory = [
    {
      id: "SUB-12345",
      plan: "Professional Plan",
      amount: "$49.00",
      date: "2024-03-15",
      status: "Active",
      nextBilling: "2024-04-15",
    },
  ];

  const handleSubscribe = async (planId: string) => {
    try {
      const res = await createCheckoutSession({ planId }).unwrap();
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to initiate subscription");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-black uppercase">Subscription Plans</h1>
      </div>

      {/* <PricingCard key={plans?.[0]?._id} plan={plans?.[0]} /> */}

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          plans.map((plan: any) => (
            <SubscriptionCard
              key={plan._id}
              plan={plan}
              onSubscribe={handleSubscribe}
              isLoading={isCreating}
            />
          ))
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase">Subscription History</h2>

        <SubscriptionTable data={subscriptionHistory} />
      </div>
    </div>
  );
}
