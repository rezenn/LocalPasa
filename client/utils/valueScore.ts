// Client-side "value for money" heuristic (US-051). A real system would
// use actual community votes; this is a deterministic stand-in based on
// rating vs. price-per-review-confidence, so the UI has something
// meaningful without needing a new backend field yet.

export type ValueScore = "Great Value" | "Fair Price" | "Pricey";

export function getValueForMoneyScore(
  price: number,
  rating: number,
  reviewCount: number,
): { label: ValueScore; color: string } {
  // Normalize: higher rating + more reviews (more confidence) + lower
  // price relative to a typical NPR 500-4000 workshop range => better value.
  const priceScore = Math.max(0, 1 - price / 4000); // 0 (expensive) - 1 (cheap)
  const ratingScore = rating / 5; // 0 - 1
  const confidence = Math.min(1, reviewCount / 20); // caps out at 20 reviews

  const composite = ratingScore * 0.5 + priceScore * 0.3 + confidence * 0.2;

  if (composite >= 0.65) return { label: "Great Value", color: "#2C7A3A" };
  if (composite >= 0.4) return { label: "Fair Price", color: "#B8860B" };
  return { label: "Pricey", color: "#B23B3B" };
}
