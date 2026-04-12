export type Status = "Published" | "Draft" | "Inactive";

export interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
