"use client";

import { AddSubscriptionModal } from "@/components/dashboard/subscription/add-subscription-modal";
import { SubscriptionTable } from "@/components/dashboard/subscription/all-subscription-table";
import { SubscriptionCard } from "@/components/dashboard/subscription/subscription-card";
import { Button } from "@/components/ui/button";
import {
  useCreateCheckoutSessionMutation,
  useDeleteSubscriptionPlanMutation,
  useGetSubscriptionPlansQuery,
} from "@/redux/features/subscription/subscriptionApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function SubscriptionPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingPlan(null);
  };
  const { data: plansRes, isLoading } = useGetSubscriptionPlansQuery();
  const [createCheckoutSession, { isLoading: isCreating }] =
    useCreateCheckoutSessionMutation();
  const [deleteSubscriptionPlan, { isLoading: isDeleting }] =
    useDeleteSubscriptionPlanMutation();

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

  const handleDeletePlan = async (planId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this plan deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteSubscriptionPlan(planId).unwrap();
          if (res.success || res.data) {
            Swal.fire({
              title: "Deleted!",
              text: "Subscription plan has been deleted.",
              icon: "success",
            });
          }
        } catch (error: any) {
          toast.error(
            error?.data?.message || "Failed to delete subscription plan",
          );
        }
      }
    });
  };

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase">Subscription Plans</h1>
        <Button
          onClick={() => {
            setEditingPlan(null);
            setIsAddModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest py-6 px-6 rounded-xl"
        >
          + Add New Plan
        </Button>
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
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
              isLoading={isCreating || isDeleting}
            />
          ))
        )}
      </div>
      {/* <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase">Subscription History</h2>
        <SubscriptionTable data={subscriptionHistory} />
      </div> */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        plan={editingPlan}
      />
    </div>
  );
}
