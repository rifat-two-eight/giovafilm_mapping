import { Accessibility } from "./accessibility";
import { Category } from "./category";
import { BaseDocument, Status } from "./common";
import { GeoLocation } from "./location";
import { MapLocation } from "./map";

export type MediaItem = File | string;

export interface TPlace extends BaseDocument {
  id: string;

  name: string;
  description: string;
  address: string;

  category: Category;

  location: GeoLocation;

  accessibility: Accessibility;

  services: string[];

  media: MediaItem[];

  map: MapLocation;

  rating: number;
  totalReview: number;

  openCount: number;
  viewCount?: number;

  price: number;
  isPaid: boolean;

  status: Status;
}
