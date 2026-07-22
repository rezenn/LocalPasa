import AsyncStorage from "@react-native-async-storage/async-storage";
import { haversineKm } from "./exploreFilters";

const STORAGE_KEY = "localpasa_itinerary";

export interface ItineraryStop {
  siteId: string;
}

// Small fallback city-center table (mirrors the one in map.tsx) so we can
// still estimate a travel order/time for sites that don't have precise
// coordinates saved yet.
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  kathmandu: { lat: 27.7172, lng: 85.324 },
  lalitpur: { lat: 27.6588, lng: 85.3247 },
  patan: { lat: 27.6588, lng: 85.3247 },
  bhaktapur: { lat: 27.671, lng: 85.4298 },
  pokhara: { lat: 28.2096, lng: 83.9856 },
};

export function getApproxCoords(
  site: Record<string, any>,
): { lat: number; lng: number } | null {
  const lat = site?.coordinates?.lat ?? site?.latitude ?? site?.lat;
  const lng = site?.coordinates?.lng ?? site?.longitude ?? site?.lng;
  if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
    return { lat: Number(lat), lng: Number(lng) };
  }
  const key = (site?.city || "").trim().toLowerCase();
  return CITY_COORDINATES[key] ?? null;
}

/** Walking-time estimate between two sites, in minutes, at ~4.5km/h. */
export function estimateWalkMinutes(
  a: Record<string, any>,
  b: Record<string, any>,
): number | null {
  const c1 = getApproxCoords(a);
  const c2 = getApproxCoords(b);
  if (!c1 || !c2) return null;
  const km = haversineKm(c1.lat, c1.lng, c2.lat, c2.lng);
  return Math.max(1, Math.round((km / 4.5) * 60));
}

/**
 * Auto-suggests a visiting order (US-034) using a simple nearest-neighbor
 * greedy walk starting from the first stop — minimizes zig-zagging between
 * sites without needing a full routing API.
 */
export function suggestVisitOrder<T extends Record<string, any>>(
  sites: T[],
  idKey = "_id",
): T[] {
  if (sites.length <= 2) return sites;
  const remaining = [...sites];
  const ordered: T[] = [remaining.shift()!];

  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    const lastCoords = getApproxCoords(last);
    let bestIdx = 0;
    if (lastCoords) {
      let bestDist = Infinity;
      remaining.forEach((s, i) => {
        const c = getApproxCoords(s);
        if (!c) return;
        const d = haversineKm(lastCoords.lat, lastCoords.lng, c.lat, c.lng);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
    }
    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }
  return ordered;
}

export async function getItinerary(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveItinerary(siteIds: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(siteIds));
  } catch {
    // Best-effort local persistence.
  }
}
