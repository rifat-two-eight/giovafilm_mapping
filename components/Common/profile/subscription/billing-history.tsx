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
  const sub = data?.data;

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
        ) : sub ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Next Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {sub.planId?.name || "Premium"}
                  </TableCell>
                  <TableCell>${sub.planId?.price || 0}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full uppercase ${
                        sub.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(sub.currentPeriodStart).toLocaleDateString()} -{" "}
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {sub.cancelAtPeriodEnd
                      ? "Canceled"
                      : new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </TableCell>
                </TableRow>
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
