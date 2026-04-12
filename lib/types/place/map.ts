

export interface MapLocation extends BaseDocument {
  id: string;

  name: string;
  description: string;

  images: string[];
  features: string[];

  places: string[];

  price: number;
  rating: number;
  totalReview: number;
  viewCount: number;

  isPaid: boolean;
  status: Status;
}
