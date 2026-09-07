"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/features/review/reviewApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeId?: string;
  businessId?: string;
  initialData?: {
    _id: string;
    rating: number;
    review: string;
  };
}

export function ReviewModal({
  isOpen,
  onClose,
  placeId,
  businessId,
  initialData,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (initialData && isOpen) {
      setRating(initialData.rating);
      setReview(initialData.review);
    } else if (!initialData && isOpen) {
      setRating(0);
      setReview("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    if (!placeId && !businessId) {
      toast.error("Location ID is missing");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      let res;
      if (initialData) {
        res = await updateReview({
          id: initialData._id,
          data: { rating, review },
        }).unwrap();
      } else {
        res = await createReview({
          ...(placeId ? { placeId } : { businessId }),
          rating,
          review,
        }).unwrap();
      }

      if (res.success) {
        toast.success(
          initialData
            ? "Review updated successfully!"
            : "Review submitted successfully!",
        );
        if (!initialData) {
          setRating(0);
          setReview("");
        }
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save review");
    }
  };

  const RATING_LABELS: Record<number, string> = {
    1: "Terrible",
    2: "Poor",
    3: "Average",
    4: "Very Good",
    5: "Excellent",
  };

  const currentRating = hover || rating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl rounded-3xl p-6 sm:p-8 border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-gray-900 uppercase tracking-tight">
            {initialData ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
          <p className="text-center text-xs text-gray-500 font-medium">
            Share your authentic experience to help other explorers
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Star Rating Section */}
          <div className="flex flex-col items-center gap-2 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
            <p className="font-bold text-gray-700 uppercase text-xs tracking-wider">
              Rate your experience
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform active:scale-90 p-1"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${star} star`}
                >
                  <Star
                    size={36}
                    strokeWidth={1.5}
                    className={`${
                      currentRating >= star
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-300 hover:text-gray-400"
                    } transition-all duration-150`}
                  />
                </button>
              ))}
            </div>
            <span
              className={`text-xs font-bold transition-opacity ${
                currentRating > 0
                  ? "text-amber-700 opacity-100"
                  : "text-gray-400 opacity-60"
              }`}
            >
              {currentRating > 0
                ? `${currentRating} Stars — ${RATING_LABELS[currentRating] || ""}`
                : "Select your rating"}
            </span>
          </div>

          {/* Review Details Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                Review details
              </p>
              <span
                className={`text-xs font-medium ${
                  review.trim().length >= 200
                    ? "text-green-600 font-bold"
                    : "text-gray-400"
                }`}
              >
                {review.trim().length >= 200
                  ? "🎉 +10 Bonus points unlocked!"
                  : `${review.trim().length}/200 chars for +10 bonus pts`}
              </span>
            </div>
            <Textarea
              placeholder="What did you like or dislike? How was the atmosphere, trail, or service? (Write 200+ characters to earn bonus points!)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="resize-none h-36 rounded-2xl border-gray-200 bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:bg-white transition-all p-4 text-sm sm:text-base leading-relaxed"
            />
          </div>

          {/* Verification Process Notice */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5 text-left">
            <span className="text-base shrink-0 mt-0.5">🛡️</span>
            <div className="text-xs text-blue-900 leading-relaxed">
              <p className="font-bold">Moderation & Verification Notice</p>
              <p className="text-blue-700 mt-0.5">
                Your review will be reviewed by our team before going public. Once approved, you will earn explorer points towards your level!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="flex-1 font-bold text-gray-600 hover:text-gray-900 border-gray-200 rounded-xl h-12 text-xs sm:text-sm uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl h-12 text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:translate-y-0.5 disabled:opacity-50 border-none"
            >
              {isLoading
                ? "Saving..."
                : initialData
                  ? "Update Review"
                  : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
