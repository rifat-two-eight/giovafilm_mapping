import { BaseDocument } from "./common";

export interface Category extends BaseDocument {
  name: string;
  color: string;
  icon: string;
  status: "Active" | "Inactive";
}
