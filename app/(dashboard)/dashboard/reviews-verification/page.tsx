"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetPendingReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
} from "@/redux/features/review/reviewApi";
import { getImageUrl } from "@/lib/utils";
import { Check, X, Star } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsVerificationPage() {
  const { data: reviews, isLoading, refetch } = useGetPendingReviewsQuery({});
  const [approveReview, { isLoading: isApproving }] = useApproveReviewMutation();
  const [rejectReview, { isLoading: isRejecting }] = useRejectReviewMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id).unwrap();
      toast.success("Review approved successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve review");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id).unwrap();
      toast.success("Review rejected successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject review");
    }
  };

  const reviewList = reviews?.data || [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews Verification</h1>
        <p className="text-muted-foreground mt-2">
          Verify and approve or reject pending user reviews. approved reviews will award points to users.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : reviewList.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-muted-foreground">No pending reviews to verify</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewList.map((review: any) => (
            <Card key={review._id} className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold mb-1 line-clamp-1">
                      {review.businessId
                        ? `Business: ${review.businessId?.name || "Unknown Business"}`
                        : `Place: ${review.placeId?.name || "Unknown Place"}`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      By: <span className="font-medium text-foreground">{review.reviewer?.name || "Anonymous"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                    <span>{review.rating}.0</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-gray-700 italic border-l-4 border-primary pl-3 py-1">
                  "{review.review || "No review content provided (Star rating only)"}"
                </p>

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {review.media.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={getImageUrl(img)}
                        alt="Review upload"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(review._id)}
                    disabled={isApproving || isRejecting}
                    className="flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full"
                  >
                    <X className="w-4 h-4" /> Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(review._id)}
                    disabled={isApproving || isRejecting}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full border-none"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
