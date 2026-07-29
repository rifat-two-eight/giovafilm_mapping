"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";

const BillingHistory = () => {
  const { data, isLoading } = useGetMySubscriptionQuery();
  
  const subs = Array.isArray(data?.data)
    ? data.data
    : data?.data
    ? [data.data]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6 text-gray-500">
            Loading billing history...
          </div>
        ) : subs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Next Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.map((sub: any) => (
                  <TableRow key={sub._id}>
                    <TableCell className="font-medium">
                      {sub.planId?.name || "Premium Plan"}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {sub.businessId?.name || "—"}
                    </TableCell>
                    <TableCell>
                      {sub.planId?.price != null ? `$${sub.planId.price}` : "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full uppercase ${
                          sub.status === "active"
                            ? "bg-green-100 text-green-700"
                            : sub.status === "canceled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs">
                      {sub.currentPeriodStart
                        ? new Date(sub.currentPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                      {" - "}
                      {sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs">
                      {sub.status === "canceled"
                        ? "Canceled"
                        : sub.cancelAtPeriodEnd
                        ? "Canceling at period end"
                        : sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500 border rounded-lg bg-gray-50">
            No billing history found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillingHistory;
