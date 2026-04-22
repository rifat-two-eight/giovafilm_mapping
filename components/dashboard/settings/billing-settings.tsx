"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function BillingSettings() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg border border-blue-500 bg-blue-500/10">
          <p className="font-semibold">Pro Plan</p>
          <p className="text-sm text-muted-foreground">
            $49/month • Next billing date: March 14, 2026
          </p>
        </div>

        <Link href={"/pricing"}>
          <Button variant="outline" className="py-5 w-full justify-start">
            Manage Subscription
          </Button>
        </Link>

        {/* <Button variant="outline" className="py-5 w-full justify-start">
          Update Payment Method
        </Button> */}

        {/* <Button variant="outline" className="py-5 w-full justify-start">
          View Billing History
        </Button> */}
      </CardContent>
    </Card>
  );
}
