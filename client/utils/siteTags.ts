// Derives lightweight "era / religion / architecture style" tags for a site
// on the client, purely from fields we already have (site.type, site.city).
// This is a frontend-only stand-in for a proper curated `tags` field on the
// backend (US-014) — swap for real data once the backend model has one.

export interface SiteTag {
  label: string;
  category: "era" | "religion" | "style";
}

const TYPE_TAG_MAP: Record<
  string,
  { era: string; religion: string; style: string }
> = {
  temple: {
    era: "Medieval (12th–18th c.)",
    religion: "Hindu",
    style: "Pagoda Architecture",
  },
  stupa: {
    era: "Ancient",
    religion: "Buddhist",
    style: "Stupa Architecture",
  },
  monastery: {
    era: "Medieval",
    religion: "Buddhist",
    style: "Monastic Architecture",
  },
  palace: {
    era: "Malla Period (14th–18th c.)",
    religion: "Secular",
    style: "Newari Palace Architecture",
  },
  museum: {
    era: "20th century",
    religion: "Secular",
    style: "Colonial / Modern",
  },
  square: {
    era: "Malla Period (14th–18th c.)",
    religion: "Mixed",
    style: "Newari Courtyard Architecture",
  },
};

const DEFAULT_TAGS = {
  era: "Historic",
  religion: "Nepali Heritage",
  style: "Traditional Architecture",
};

export function getSiteTags(site: { type?: string; name?: string }): SiteTag[] {
  const key = (site.type || "").toLowerCase().trim();
  const match =
    Object.keys(TYPE_TAG_MAP).find((k) => key.includes(k)) ?? null;
  const tags = match ? TYPE_TAG_MAP[match] : DEFAULT_TAGS;

  return [
    { label: tags.era, category: "era" },
    { label: tags.religion, category: "religion" },
    { label: tags.style, category: "style" },
  ];
}
