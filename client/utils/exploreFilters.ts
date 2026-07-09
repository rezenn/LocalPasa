import { ExploreFilters } from "../components/common/FilterPanel";

// Reference point used to compute a "distance from you" for the Distance
// filter, since there's no device-geolocation flow wired up yet on the
// frontend. Centered on Kathmandu (Basantapur Durbar Square area) — close
// enough for every seeded site/artisan/event to be meaningfully sortable.
// Swap this for `expo-location`'s real coordinates once that's added.
export const REFERENCE_LOCATION = { lat: 27.7041, lng: 85.3079 };

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Extracts a numeric NPR value from strings like "NPR 1,500", "Rs 400",
// "Free", "Varied". Returns 0 for "Free"/unparseable so it always passes a
// "max price" filter rather than being excluded by default.
export function parsePriceValue(price?: string): number {
  if (!price) return 0;
  if (/free/i.test(price)) return 0;
  const digits = price.replace(/[^0-9.]/g, "");
  const n = parseFloat(digits);
  return Number.isFinite(n) ? n : 0;
}

// Best-effort lat/lng extraction — API responses vary in shape (coordinates
// object vs flat lat/lng vs missing entirely for un-mapped seed data).
export function extractLatLng(
  item: Record<string, any>,
): { lat: number; lng: number } | null {
  const lat =
    item?.coordinates?.lat ?? item?.latitude ?? item?.lat ?? item?.locationLat;
  const lng =
    item?.coordinates?.lng ??
    item?.longitude ??
    item?.lng ??
    item?.locationLng;
  if (lat == null || lng == null) return null;
  return { lat: Number(lat), lng: Number(lng) };
}

export function matchesTextQuery(
  query: string,
  ...fields: (string | undefined)[]
): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export function matchesDistance(
  item: Record<string, any>,
  maxKm: number,
): boolean {
  if (maxKm >= 10) return true; // slider maxed out = no distance constraint
  const coords = extractLatLng(item);
  if (!coords) return true; // un-mapped items aren't excluded, just unsortable
  const km = haversineKm(
    REFERENCE_LOCATION.lat,
    REFERENCE_LOCATION.lng,
    coords.lat,
    coords.lng,
  );
  return km <= maxKm;
}

export function matchesPrice(price: string | undefined, maxPrice: number): boolean {
  if (maxPrice >= 3000) return true; // slider maxed out = no price constraint
  return parsePriceValue(price) <= maxPrice;
}

export function matchesRating(
  rating: number | undefined,
  minRating: number,
): boolean {
  if (minRating <= 0) return true;
  return (rating ?? 0) >= minRating;
}

export function matchesTypeList(
  type: string | undefined,
  selected: string[],
): boolean {
  if (selected.length === 0) return true;
  if (!type) return false;
  const t = type.toLowerCase();
  return selected.some(
    (s) => t.includes(s.toLowerCase()) || s.toLowerCase().includes(t),
  );
}

export function filterSites<T extends Record<string, any>>(
  sites: T[],
  query: string,
  filters: ExploreFilters,
): T[] {
  return sites.filter(
    (s) =>
      matchesTextQuery(query, s.name, s.location, s.type) &&
      matchesDistance(s, filters.maxDistanceKm) &&
      matchesPrice(s.price, filters.maxPrice) &&
      matchesRating(s.rating, filters.minRating) &&
      matchesTypeList(s.type, filters.siteTypes),
  );
}

export function filterArtisans<T extends Record<string, any>>(
  artisans: T[],
  query: string,
  filters: ExploreFilters,
): T[] {
  return artisans.filter(
    (a) =>
      matchesTextQuery(query, a.name, a.craft, a.location) &&
      matchesDistance(a, filters.maxDistanceKm) &&
      matchesRating(a.rating, filters.minRating) &&
      matchesTypeList(a.craft, filters.artisanTypes),
  );
}

export function filterEvents<T extends Record<string, any>>(
  events: T[],
  query: string,
  filters: ExploreFilters,
): T[] {
  return events.filter(
    (e) =>
      matchesTextQuery(query, e.title, e.location, e.type) &&
      matchesDistance(e, filters.maxDistanceKm) &&
      matchesPrice(e.price, filters.maxPrice) &&
      matchesTypeList(e.type, filters.eventTypes),
  );
}
