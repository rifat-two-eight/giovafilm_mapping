import { FavouriteButton } from "@/components/shared/favourite-button";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { NoImage } from "@/lib/others/others";
import { getUsableMediaUrl } from "@/lib/utils";
import { useGetSingleBusinessQuery } from "@/redux/features/business/businessApi";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import { normalizePinType, trackUsage } from "@/lib/record-visit";
import { useEffect } from "react";
import { Star, X, Lock } from "lucide-react";
import Link from "next/link";

type Props = {
  id: { id: string; type: string };
  onClose: () => void;
  mapId?: string;
};

export default function LocationDialog({ id, onClose, mapId }: Props) {
  const placeId = id?.id;
  const type = normalizePinType(id?.type);

  // Fetch based on type
  const {
    data: businessRes,
    isLoading: isBusinessLoading,
    isFetching: isBusinessFetching,
    status: businessStatus,
  } = useGetSingleBusinessQuery(placeId, {
    skip: type !== "business",
  });

  const {
    data: placeRes,
    isLoading: isPlaceLoading,
    isFetching: isPlaceFetching,
    status: placeStatus,
    error: placeError,
  } = useGetPlaceDetailsQuery(placeId, {
    skip: type !== "place",
  });

  useEffect(() => {
    if (!placeId) return;
    trackUsage(type, placeId);
  }, [placeId, type]);

  const isLoading =
    type === "business"
      ? isBusinessLoading || isBusinessFetching || businessStatus === "pending" || businessStatus === "uninitialized"
      : isPlaceLoading || isPlaceFetching || placeStatus === "pending" || placeStatus === "uninitialized";

  const location: any =
    type === "business" ? businessRes?.data : placeRes?.data;

  // Place: media[]; Business: media.photos[]
  const coverSource =
    type === "business" ? location?.media?.photos : location?.media;
  const coverImage = getUsableMediaUrl(coverSource);
  const locationId = location?._id || location?.id || placeId;

  const isLocked = (placeError as any)?.status === 403;

  if (isLocked) {
    const message = (placeError as any)?.data?.message || "This information and these benefits can be unlocked by purchasing your favorite map.";
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-md pointer-events-auto relative p-8 text-center space-y-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shadow"
          >
            <X size={20} />
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full">
            <Lock size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Locked Location</h2>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              This is a premium spot. {message}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link
              href={mapId ? `/catalog/${mapId}` : "/catalog"}
              onClick={onClose}
              className="w-full"
            >
              <Button className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-xl h-12">
                Unlock Map
              </Button>
            </Link>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl h-12 transition-colors cursor-pointer text-sm"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
        <div className="bg-white rounded-[32px] p-10 shadow-2xl flex items-center justify-center pointer-events-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-md pointer-events-auto relative p-8 text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shadow"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 pt-2">
            Location not found
          </h2>
          <p className="text-sm text-gray-500">
            This location is unavailable or may have been removed.
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-xl h-12"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-end sm:items-center justify-center pointer-events-none p-4 pb-[max(5rem,env(safe-area-inset-bottom))] sm:pb-4">
      <div className="bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl w-full max-w-md pointer-events-auto relative flex flex-col overflow-hidden max-h-full min-h-0">
        {/* Close — always tappable above image + description */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close location"
          className="absolute top-3 right-3 z-[60] w-11 h-11 bg-white/95 rounded-full flex items-center justify-center shadow-lg"
        >
          <X size={22} />
        </button>

        {/* Image stays visible; long copy only scrolls below */}
        <div className="h-40 sm:h-48 shrink-0 grow-0 overflow-hidden rounded-t-[32px]">
          {coverImage ? (
            <SafeImage
              src={coverImage}
              alt={location?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <NoImage />
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
          <h2 className="text-2xl font-black mb-2 pr-6">{location?.name}</h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-sm font-bold">
              <Star size={14} className="fill-black mr-1" />
              {location?.rating ?? "—"}
            </div>

            <span className="text-gray-400 text-sm">
              ({location?.totalReview ?? 0} reviews){" "}
              {location?.map?.name || location?.location?.country || ""}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">{location?.description}</p>

          {type !== "business" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                NOTICE: The information for this place is for informational purposes only. Your visit and activities are at your own risk.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Link href={`/maps/${placeId}?type=${type}`} className="flex-1">
              <Button className="w-full bg-[#FFC107] text-black font-bold rounded-xl h-12">
                View Details
              </Button>
            </Link>

            {locationId && (
              <FavouriteButton
                placeId={locationId}
                type={type === "business" ? "Business" : "Place"}
                Style="w-12 h-12 rounded-xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
