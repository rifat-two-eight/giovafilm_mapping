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
  placeId: string | undefined;
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
    if (!placeId) {
      toast.error("Place ID is missing");
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
          placeId,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[700px] rounded-3xl p-5 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-gray-900 uppercase tracking-tight">
            {initialData ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="flex flex-col items-center gap-4">
            <p className="font-bold text-gray-500 uppercase text-xs tracking-widest">
              Rate your experience
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-all active:scale-90"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    size={40}
                    strokeWidth={1.5}
                    className={`${
                      (hover || rating) >= star
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-200"
                    } transition-all duration-200`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-gray-500 uppercase text-xs tracking-widest">
              Review details
            </p>
            <Textarea
              placeholder="What did you like or dislike? How was the service?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="resize-none h-40 rounded-2xl border-gray-100 bg-gray-50 focus-visible:ring-primary/50 focus-visible:bg-white transition-all p-4 text-base"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 font-bold text-gray-400 hover:text-gray-600 rounded-2xl h-14 bg-gray-200"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-black rounded-2xl h-14 text-sm tracking-widest shadow-lg shadow-yellow-200 hover:shadow-yellow-300 transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              {isLoading
                ? "SAVING..."
                : initialData
                  ? "UPDATE REVIEW"
                  : "POST REVIEW"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
