import { BaseDocument } from "./place/common";

/** A single favourite item as returned by GET /favourite */
export interface TFavouriteItem extends BaseDocument {
  type: "Map" | "Place" | "Offer";
  /** Present when type === "Map" */
  map?: string | { _id: string; name?: string };
  /** Present when type === "Place" */
  place?: string | { _id: string; name?: string };
  /** Present when type === "Offer" */
  offer?: string | { _id: string; name?: string };
  user: string;
}

/** Payload for POST /favourite (toggle) */
export type TAddFavouritePayload =
  | { type: "Map"; map: string }
  | { type: "Place"; place: string }
  | { type: "Offer"; offer: string };
