// Cultural "experiences" — bookable, hands-on workshops led by an artisan
// (pottery, thanka painting, cooking classes, weaving, etc). This is
// frontend-only for now: seeded locally in `constants/data/experiencesSeed.ts`
// and bookings are persisted to AsyncStorage (see `context/BookingsContext.tsx`)
// rather than a backend collection.

export interface ExperienceDateOption {
  /** ISO date, e.g. "2025-06-14" */
  date: string;
  /** Short weekday label shown on the date chip, e.g. "Mon" */
  weekday: string;
  /** Day-of-month label shown on the date chip, e.g. "14" */
  day: string;
  available: boolean;
}

export interface Experience {
  id: string;
  title: string;
  category: "Pottery" | "Thanka" | "Cooking" | "Weaving" | string;
  badge?: "New" | "Best Seller" | "Popular";
  artisanName: string;
  artisanTitle?: string; // e.g. "Master Potter · Bhaktapur"
  artisanAvatar?: string;
  location: string;
  city?: string;
  durationLabel: string; // e.g. "3 Hours"
  maxPeople: number;
  materialsIncluded: boolean;
  rating: number;
  reviewCount: number;
  spotsLeft?: number;
  price: number; // NPR, per person
  image: string;
  gallery?: string[];
  about: string;
  dateOptions: ExperienceDateOption[];
  timeOptions: string[]; // e.g. ["9:00 AM", "1:00 PM", "4:00 PM"]
}
