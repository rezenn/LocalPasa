import { Experience } from "../../types/experience";

// One fully fleshed-out seed experience to start from — copy this shape to
// add more. Keep `id` unique and kebab-case; `image`/`artisanAvatar` can be
// any reachable URL until real artisan photos are uploaded.
export const EXPERIENCES_SEED: Experience[] = [
  {
    id: "traditional-pottery-workshop",
    title: "Traditional Pottery Workshop",
    category: "Pottery",
    badge: "Popular",
    artisanName: "Sanu Maya Shrestha",
    artisanTitle: "Master Potter · Bhaktapur",
    artisanAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    durationLabel: "3 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 148,
    spotsLeft: 3,
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=600&fit=crop",
    ],
    about:
      "Learn the ancient art of Nepali pottery from master artisan Sanu Maya. Shape and decorate a traditional Bhaktapur clay pot to take home. All materials and snacks included.",
    dateOptions: [
      { date: "2025-06-14", weekday: "Mon", day: "14", available: true },
      { date: "2025-06-15", weekday: "Tue", day: "15", available: true },
      { date: "2025-06-16", weekday: "Wed", day: "16", available: false },
      { date: "2025-06-17", weekday: "Thu", day: "17", available: true },
      { date: "2025-06-18", weekday: "Fri", day: "18", available: true },
      { date: "2025-06-19", weekday: "Sat", day: "19", available: true },
      { date: "2025-06-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["9:00 AM", "1:00 PM", "4:00 PM"],
  },
];

export default EXPERIENCES_SEED;
