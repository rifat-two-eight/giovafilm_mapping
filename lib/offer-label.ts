export type OfferDiscountFields = {
  discountType?: string;
  discountValue?: string | number;
  discount?: string | number;
  bogoSecondType?: string;
};

export function resolveBogoSecondType(offer: OfferDiscountFields): "free" | "percentage" {
  if (offer.bogoSecondType === "percentage") return "percentage";
  return "free";
}

export function formatOfferDiscountLabel(offer: OfferDiscountFields): string {
  const type = offer.discountType || "";
  const value = offer.discountValue ?? offer.discount;

  if (type === "Percentage") return `${value}% OFF`;
  if (type === "Flat") return `$${value} OFF`;
  if (type === "Free item") return "Free item";
  if (type === "BOGO") {
    const second = resolveBogoSecondType(offer);
    if (second === "percentage") return `Buy 1 Get 1 · ${value}% off 2nd`;
    return "Buy 1 Get 1 Free";
  }

  return value !== undefined && value !== null && value !== "" ? String(value) : "Offer";
}
