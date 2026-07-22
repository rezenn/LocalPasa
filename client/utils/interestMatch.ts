// Maps the onboarding interest-quiz options to keywords we can match
// against a site's `type`/`name` or an artisan's `craft`, so the selected
// interests can actually reorder the home feed (US-001) instead of just
// being stored and never used.

const INTEREST_KEYWORDS: Record<string, string[]> = {
  "Temples & Heritages": ["temple", "stupa", "monastery", "palace", "square"],
  "Local Food": ["food", "restaurant", "cuisine", "market"],
  Handicrafts: ["pottery", "weav", "craft", "carving", "textile"],
  Festivals: ["festival", "event"],
  History: ["museum", "palace", "heritage", "ancient", "medieval"],
  "Arts & Crafts": ["thangka", "paint", "art", "craft", "sculpture"],
};

function matchesAnyInterest(text: string, interests: string[]): boolean {
  const t = text.toLowerCase();
  return interests.some((interest) =>
    (INTEREST_KEYWORDS[interest] || []).some((kw) => t.includes(kw)),
  );
}

/**
 * Sorts sites so that ones matching the person's selected interests appear
 * first, without dropping anything that doesn't match (stable partial sort).
 */
export function sortSitesByInterest<T extends { type?: string; name?: string }>(
  sites: T[],
  interests: string[],
): T[] {
  if (!interests || interests.length === 0) return sites;
  const scored = sites.map((s) => ({
    site: s,
    match: matchesAnyInterest(`${s.type || ""} ${s.name || ""}`, interests),
  }));
  return [
    ...scored.filter((s) => s.match).map((s) => s.site),
    ...scored.filter((s) => !s.match).map((s) => s.site),
  ];
}
