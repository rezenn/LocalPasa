// seed/experiences.seed.ts
import { Experience } from "../../types/experience";

// Define the allowed badge types
type BadgeType =
  | "New"
  | "Best Seller"
  | "Popular"
  | "Heritage"
  | "Unique"
  | "Cultural"
  | "Creative"
  | "Eco"
  | "Luxury"
  | "Sustainable"
  | "Transformational"
  | "Exquisite"
  | "Peaceful"
  | "Therapeutic"
  | "Wellness"
  | "Foodie"
  | "Must Try";

export const EXPERIENCES_SEED: Experience[] = [
  // ===== Pottery & Ceramics =====
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
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: false },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["9:00 AM", "1:00 PM", "4:00 PM"],
  },
  {
    id: "clay-sculpture-workshop",
    title: "Clay Sculpture & Modeling",
    category: "Pottery",
    badge: "New",
    artisanName: "Prakash Shakya",
    artisanTitle: "Sculptor · Patan",
    artisanAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    location: "Patan, Bagmati",
    city: "Lalitpur",
    durationLabel: "4 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.5,
    reviewCount: 56,
    spotsLeft: 5,
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&h=600&fit=crop",
    ],
    about:
      "Learn the art of clay sculpture. Create your own figurines and decorative items inspired by Nepali mythology and culture.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: false },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["10:00 AM", "2:00 PM"],
  },

  // ===== Thangka & Painting =====
  {
    id: "thangka-painting-masterclass",
    title: "Thangka Painting Masterclass",
    category: "Painting",
    badge: "Best Seller",
    artisanName: "Karma Gurung",
    artisanTitle: "Thangka Artist · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "4 Hours",
    maxPeople: 4,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 89,
    spotsLeft: 2,
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&h=600&fit=crop",
    ],
    about:
      "Immerse yourself in the sacred art of Thangka painting. Learn traditional techniques, mineral pigment preparation, and the symbolism behind Buddhist iconography.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: false },
      { date: "2026-07-22", weekday: "Tue", day: "22", available: true },
    ],
    timeOptions: ["10:00 AM", "2:00 PM"],
  },
  {
    id: "mandala-painting-workshop",
    title: "Mandala Painting Workshop",
    category: "Painting",
    badge: "Popular",
    artisanName: "Tenzin Wangmo",
    artisanTitle: "Mandala Artist · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "3 Hours",
    maxPeople: 8,
    materialsIncluded: true,
    rating: 4.8,
    reviewCount: 112,
    spotsLeft: 5,
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&h=600&fit=crop",
    ],
    about:
      "Create intricate mandala designs inspired by Buddhist and Hindu traditions. A meditative art experience suitable for all skill levels.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: false },
      { date: "2026-07-22", weekday: "Tue", day: "22", available: true },
    ],
    timeOptions: ["10:00 AM", "2:00 PM", "5:00 PM"],
  },
  {
    id: "charcoal-painting-kathmandu",
    title: "Charcoal & Pastel Portrait Art",
    category: "Painting",
    badge: "Popular",
    artisanName: "Prakash Tamang",
    artisanTitle: "Portrait Artist · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "4 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.7,
    reviewCount: 93,
    spotsLeft: 4,
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1536924940841-227d8b9b5f5f?w=900&h=600&fit=crop",
    ],
    about:
      "Learn traditional Nepali portrait techniques using charcoal and pastels. Capture the essence of Nepali faces and landscapes under expert guidance.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: false },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["10:00 AM", "3:00 PM"],
  },

  // ===== Woodwork & Carving =====
  {
    id: "wood-carving-workshop",
    title: "Traditional Wood Carving Workshop",
    category: "Woodwork",
    badge: "New",
    artisanName: "Ram Bahadur Shrestha",
    artisanTitle: "Wood Carver · Patan",
    artisanAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    location: "Patan, Bagmati",
    city: "Lalitpur",
    durationLabel: "5 Hours",
    maxPeople: 8,
    materialsIncluded: true,
    rating: 4.8,
    reviewCount: 67,
    spotsLeft: 5,
    price: 2000,
    image:
      "https://images.unsplash.com/photo-1581567473484-98c40f9b30c5?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581567473484-98c40f9b30c5?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533067191832-82a5bf746f81?w=900&h=600&fit=crop",
    ],
    about:
      "Master the ancient craft of Newari wood carving. Create intricate designs inspired by Patan's historic temples while learning about traditional tools and techniques.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: true },
    ],
    timeOptions: ["8:00 AM", "1:00 PM"],
  },
  {
    id: "bamboo-craft-workshop",
    title: "Bamboo Craft & Weaving",
    category: "Woodwork",
    badge: "New",
    artisanName: "Krishna Tamang",
    artisanTitle: "Bamboo Artisan · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "3 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.6,
    reviewCount: 58,
    spotsLeft: 5,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533067191832-82a5bf746f81?w=900&h=600&fit=crop",
    ],
    about:
      "Learn sustainable bamboo crafting techniques. Create baskets, furniture, and decorative items using traditional methods.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: false },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["10:00 AM", "2:00 PM"],
  },
  {
    id: "stone-carving-workshop",
    title: "Stone Carving & Sculpture",
    category: "Sculpture",
    badge: "Best Seller",
    artisanName: "Ramesh Shrestha",
    artisanTitle: "Stone Carver · Bhaktapur",
    artisanAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    durationLabel: "6 Hours",
    maxPeople: 4,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 45,
    spotsLeft: 2,
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580902393997-8addb7ba98a1?w=900&h=600&fit=crop",
    ],
    about:
      "Learn the ancient art of stone carving from a master artisan. Create your own sculpture using traditional tools and techniques.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: true },
    ],
    timeOptions: ["8:00 AM", "1:00 PM"],
  },

  // ===== Textile & Weaving =====
  {
    id: "handloom-weaving-experience",
    title: "Handloom Weaving Experience",
    category: "Weaving",
    badge: "Popular",
    artisanName: "Goma Tamang",
    artisanTitle: "Weaving Master · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "4 Hours",
    maxPeople: 4,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 112,
    spotsLeft: 4,
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1605281627216-10fb4a54cb83?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1605281627216-10fb4a54cb83?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580880154716-3385d3b0b1f5?w=900&h=600&fit=crop",
    ],
    about:
      "Experience the centuries-old tradition of Nepali handloom weaving. Learn to operate a traditional loom and create your own woven fabric using natural dyes.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: false },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["9:00 AM", "2:00 PM"],
  },
  {
    id: "dhaka-weaving-bhaktapur",
    title: "Dhaka Weaving & Textile Design",
    category: "Weaving",
    badge: "Best Seller",
    artisanName: "Laxmi Maharjan",
    artisanTitle: "Dhaka Weaver · Bhaktapur",
    artisanAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    durationLabel: "4 Hours",
    maxPeople: 4,
    materialsIncluded: true,
    rating: 4.8,
    reviewCount: 94,
    spotsLeft: 2,
    price: 2000,
    image:
      "https://images.unsplash.com/photo-1611650885848-63c7a3f28dcd?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1611650885848-63c7a3f28dcd?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605281627216-10fb4a54cb83?w=900&h=600&fit=crop",
    ],
    about:
      "Learn the intricate art of Dhaka weaving. Create traditional Nepali patterns using the backstrap loom and natural dyes.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
    ],
    timeOptions: ["9:00 AM", "1:00 PM"],
  },
  {
    id: "natural-dye-workshop",
    title: "Natural Dye & Fabric Coloring",
    category: "Textile",
    badge: "New",
    artisanName: "Mina Rai",
    artisanTitle: "Dye Master · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "5 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.8,
    reviewCount: 89,
    spotsLeft: 3,
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1580880154716-3385d3b0b1f5?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1580880154716-3385d3b0b1f5?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605281627216-10fb4a54cb83?w=900&h=600&fit=crop",
    ],
    about:
      "Explore the art of natural dyeing using plants, flowers, and minerals. Create vibrant colors for fabric and yarn using traditional techniques.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: false },
    ],
    timeOptions: ["8:00 AM", "12:00 PM"],
  },
  {
    id: "pashmina-scarf-making",
    title: "Pashmina Scarf Making Workshop",
    category: "Textile",
    badge: "Popular",
    artisanName: "Tsering Dolma",
    artisanTitle: "Pashmina Artisan · Pokhara",
    artisanAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    location: "Pokhara, Gandaki",
    city: "Pokhara",
    durationLabel: "3 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.7,
    reviewCount: 54,
    spotsLeft: 6,
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1611650885848-63c7a3f28dcd?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1611650885848-63c7a3f28dcd?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604110837357-d81b53ae03d6?w=900&h=600&fit=crop",
    ],
    about:
      "Work with the finest Pashmina wool from the Himalayas. Learn spinning, dyeing, and weaving techniques to create your own luxury scarf.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-22", weekday: "Tue", day: "22", available: true },
    ],
    timeOptions: ["10:00 AM", "3:00 PM"],
  },

  // ===== Jewelry & Metalwork =====
  {
    id: "silver-jewelry-making",
    title: "Silver Jewelry Making Workshop",
    category: "Jewelry",
    badge: "Best Seller",
    artisanName: "Krishna Maharjan",
    artisanTitle: "Silver Smith · Patan",
    artisanAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    location: "Patan, Bagmati",
    city: "Lalitpur",
    durationLabel: "6 Hours",
    maxPeople: 5,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 203,
    spotsLeft: 2,
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=600&fit=crop",
    ],
    about:
      "Learn traditional Newari silver crafting techniques. Design and create your own silver ring or pendant using ancient methods passed down through generations.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: false },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["8:00 AM", "12:00 PM"],
  },
  {
    id: "filigree-jewelry-making",
    title: "Filigree Jewelry Workshop",
    category: "Jewelry",
    badge: "New",
    artisanName: "Padma Shakya",
    artisanTitle: "Filigree Artist · Patan",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Patan, Bagmati",
    city: "Lalitpur",
    durationLabel: "6 Hours",
    maxPeople: 4,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 78,
    spotsLeft: 2,
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=600&fit=crop",
    ],
    about:
      "Master the delicate art of filigree jewelry making. Create intricate silver ornaments using ancient Newari techniques.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: false },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["8:00 AM", "12:00 PM"],
  },
  {
    id: "pea-beads-necklace-making",
    title: "Pea Beads Necklace Workshop",
    category: "Jewelry",
    badge: "Best Seller",
    artisanName: "Gita Shakya",
    artisanTitle: "Bead Artist · Bhaktapur",
    artisanAvatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    durationLabel: "3 Hours",
    maxPeople: 8,
    materialsIncluded: true,
    rating: 4.7,
    reviewCount: 64,
    spotsLeft: 5,
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=600&fit=crop",
    ],
    about:
      "Learn the art of creating traditional pea bead necklaces. Discover the significance of these beads in Newari culture.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-22", weekday: "Tue", day: "22", available: true },
    ],
    timeOptions: ["10:00 AM", "2:00 PM"],
  },
  {
    id: "bead-jewelry-making",
    title: "Traditional Bead Jewelry Making",
    category: "Jewelry",
    badge: "Popular",
    artisanName: "Sita Pradhan",
    artisanTitle: "Bead Artisan · Patan",
    artisanAvatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
    location: "Patan, Bagmati",
    city: "Lalitpur",
    durationLabel: "3 Hours",
    maxPeople: 8,
    materialsIncluded: true,
    rating: 4.5,
    reviewCount: 72,
    spotsLeft: 6,
    price: 1400,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=600&fit=crop",
    ],
    about:
      "Create beautiful traditional bead jewelry. Learn stringing techniques, color combinations, and traditional Newari designs.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-22", weekday: "Tue", day: "22", available: true },
    ],
    timeOptions: ["9:00 AM", "1:00 PM"],
  },
  {
    id: "copper-utensil-crafting",
    title: "Copper Utensil Crafting",
    category: "Metalwork",
    badge: "New",
    artisanName: "Gyan Bahadur Shakya",
    artisanTitle: "Coppersmith · Bhaktapur",
    artisanAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    durationLabel: "5 Hours",
    maxPeople: 4,
    materialsIncluded: true,
    rating: 4.8,
    reviewCount: 76,
    spotsLeft: 3,
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1580902393997-8addb7ba98a1?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1580902393997-8addb7ba98a1?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&h=600&fit=crop",
    ],
    about:
      "Master the ancient art of copper beating. Create traditional Newari utensils and decorative items while learning the unique hammering techniques.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: true },
    ],
    timeOptions: ["9:00 AM", "2:00 PM"],
  },

  // ===== Culinary Experiences =====
  {
    id: "newari-feast-cooking",
    title: "Newari Feast Cooking Class",
    category: "Cooking",
    badge: "Popular",
    artisanName: "Maya Shrestha",
    artisanTitle: "Newari Chef · Bhaktapur",
    artisanAvatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    durationLabel: "5 Hours",
    maxPeople: 8,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 167,
    spotsLeft: 3,
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&h=600&fit=crop",
    ],
    about:
      "Learn to prepare a traditional Newari feast. Cook authentic dishes like yomari, choyla, and bara while learning about Newari food culture.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: false },
    ],
    timeOptions: ["8:00 AM", "12:00 PM"],
  },
  {
    id: "momo-making-masterclass",
    title: "Momos & Dumpling Making Class",
    category: "Cooking",
    badge: "Popular",
    artisanName: "Tara Lama",
    artisanTitle: "Momo Expert · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "3 Hours",
    maxPeople: 10,
    materialsIncluded: true,
    rating: 4.8,
    reviewCount: 234,
    spotsLeft: 5,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=900&h=600&fit=crop",
    ],
    about:
      "Master the art of making the perfect Nepali momos. Learn to prepare the dough, fillings, and create beautiful pleats. Includes tasting session.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: true },
    ],
    timeOptions: ["9:00 AM", "2:00 PM", "6:00 PM"],
  },
  {
    id: "dal-bhat-cooking-experience",
    title: "Dal Bhat & Nepali Cuisine Class",
    category: "Cooking",
    badge: "New",
    artisanName: "Gita Poudel",
    artisanTitle: "Home Chef · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "4 Hours",
    maxPeople: 8,
    materialsIncluded: true,
    rating: 4.7,
    reviewCount: 134,
    spotsLeft: 4,
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&h=600&fit=crop",
    ],
    about:
      "Learn to cook Nepal's national dish - Dal Bhat. Master the perfect tempering, vegetable curries, and traditional accompaniments.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: true },
    ],
    timeOptions: ["9:00 AM", "1:00 PM"],
  },

  // ===== Music & Performance =====
  {
    id: "traditional-music-lesson",
    title: "Traditional Nepali Music Lesson",
    category: "Music",
    badge: "New",
    artisanName: "Kiran Shrestha",
    artisanTitle: "Madal Master · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "2 Hours",
    maxPeople: 4,
    materialsIncluded: true,
    rating: 4.6,
    reviewCount: 45,
    spotsLeft: 2,
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&h=600&fit=crop",
    ],
    about:
      "Learn to play the Madal, Nepal's traditional drum. Discover rhythmic patterns and folk songs from Kathmandu Valley's rich musical heritage.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
    ],
    timeOptions: ["10:00 AM", "3:00 PM"],
  },

  // ===== Meditation & Spiritual =====
  {
    id: "buddhist-meditation-retreat",
    title: "Buddhist Meditation & Mindfulness",
    category: "Spiritual",
    badge: "Best Seller",
    artisanName: "Bhante Sumedha",
    artisanTitle: "Buddhist Monk · Kopan",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Kopan, Bagmati",
    city: "Kathmandu",
    durationLabel: "6 Hours",
    maxPeople: 15,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 178,
    spotsLeft: 8,
    price: 2000,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=600&fit=crop",
    ],
    about:
      "Experience authentic Buddhist meditation at Kopan Monastery. Learn mindfulness techniques, walking meditation, and the philosophy of compassion.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: false },
    ],
    timeOptions: ["6:00 AM", "10:00 AM"],
  },
  {
    id: "yoga-meditation-pokhara",
    title: "Yoga & Meditation in Pokhara",
    category: "Spiritual",
    badge: "Popular",
    artisanName: "Sita Dahal",
    artisanTitle: "Yoga Instructor · Pokhara",
    artisanAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    location: "Pokhara, Gandaki",
    city: "Pokhara",
    durationLabel: "2 Hours",
    maxPeople: 12,
    materialsIncluded: false,
    rating: 4.9,
    reviewCount: 134,
    spotsLeft: 6,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=600&fit=crop",
    ],
    about:
      "Experience yoga with breathtaking Himalayan views. Practice meditation techniques with a certified instructor in peaceful Pokhara.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: true },
    ],
    timeOptions: ["6:00 AM", "5:00 PM"],
  },
  {
    id: "shamanic-healing-workshop",
    title: "Shamanic Healing & Drum Journey",
    category: "Spiritual",
    badge: "New",
    artisanName: "Bhairav Gurung",
    artisanTitle: "Shaman · Pokhara",
    artisanAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    location: "Pokhara, Gandaki",
    city: "Pokhara",
    durationLabel: "3 Hours",
    maxPeople: 8,
    materialsIncluded: false,
    rating: 4.8,
    reviewCount: 92,
    spotsLeft: 4,
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=600&fit=crop",
    ],
    about:
      "Experience traditional shamanic healing practices. Learn drum journey techniques and connect with ancient spiritual traditions.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: false },
    ],
    timeOptions: ["9:00 AM", "2:00 PM"],
  },

  // ===== Nature =====
  {
    id: "sustainable-farming-experience",
    title: "Sustainable Farming & Organic Living",
    category: "Nature",
    badge: "Best Seller",
    artisanName: "Gopal Sharma",
    artisanTitle: "Organic Farmer · Kathmandu Valley",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Kathmandu Valley, Bagmati",
    city: "Kathmandu",
    durationLabel: "4 Hours",
    maxPeople: 10,
    materialsIncluded: false,
    rating: 4.5,
    reviewCount: 56,
    spotsLeft: 7,
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533067191832-82a5bf746f81?w=900&h=600&fit=crop",
    ],
    about:
      "Learn organic farming techniques in the Kathmandu Valley. Experience traditional farming methods and sustainable living practices.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-21", weekday: "Mon", day: "21", available: true },
    ],
    timeOptions: ["7:00 AM", "1:00 PM"],
  },

  // ===== Paper Art =====
  {
    id: "handmade-paper-workshop",
    title: "Handmade Paper & Calligraphy",
    category: "Paper Art",
    badge: "New",
    artisanName: "Sunita Pradhan",
    artisanTitle: "Paper Artist · Patan",
    artisanAvatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
    location: "Patan, Bagmati",
    city: "Lalitpur",
    durationLabel: "4 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.7,
    reviewCount: 82,
    spotsLeft: 4,
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1534595038511-9f219fe0c979?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1534595038511-9f219fe0c979?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561651821-6d0dcfc3bf07?w=900&h=600&fit=crop",
    ],
    about:
      "Learn the ancient art of Lokta paper making. Create beautiful handmade paper and practice traditional Newari calligraphy.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: false },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["10:00 AM", "2:00 PM"],
  },

  // ===== Tours & Heritage =====
  {
    id: "kathmandu-valley-heritage-walk",
    title: "Kathmandu Valley Heritage Walk",
    category: "Tour",
    badge: "Popular",
    artisanName: "Ram Prasad Acharya",
    artisanTitle: "Heritage Guide · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "3 Hours",
    maxPeople: 10,
    materialsIncluded: false,
    rating: 4.6,
    reviewCount: 156,
    spotsLeft: 7,
    price: 800,
    image:
      "https://images.unsplash.com/photo-1543157145-f78c636d023d?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1543157145-f78c636d023d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559770425-490e6e88e75d?w=900&h=600&fit=crop",
    ],
    about:
      "Explore the hidden courtyards and ancient temples of Kathmandu Valley. Discover the rich history and architectural wonders of Nepal.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: true },
    ],
    timeOptions: ["8:00 AM", "2:00 PM"],
  },
  {
    id: "kathmandu-photography-tour",
    title: "Kathmandu Street Photography Tour",
    category: "Photography",
    badge: "Popular",
    artisanName: "Nabin Sharma",
    artisanTitle: "Photographer · Kathmandu",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Kathmandu, Bagmati",
    city: "Kathmandu",
    durationLabel: "4 Hours",
    maxPeople: 6,
    materialsIncluded: false,
    rating: 4.6,
    reviewCount: 89,
    spotsLeft: 4,
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1559770425-490e6e88e75d?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1559770425-490e6e88e75d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543157145-f78c636d023d?w=900&h=600&fit=crop",
    ],
    about:
      "Explore Kathmandu's vibrant streets through your lens. Learn photography techniques and capture the essence of Nepali life.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
      { date: "2026-07-22", weekday: "Tue", day: "22", available: true },
    ],
    timeOptions: ["6:00 AM", "2:00 PM"],
  },

  // ===== Dance =====
  {
    id: "newari-dance-lesson",
    title: "Newari Traditional Dance Lesson",
    category: "Dance",
    badge: "New",
    artisanName: "Sarita Maharjan",
    artisanTitle: "Dance Instructor · Bhaktapur",
    artisanAvatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    durationLabel: "2 Hours",
    maxPeople: 10,
    materialsIncluded: false,
    rating: 4.7,
    reviewCount: 67,
    spotsLeft: 8,
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1518834107813-67b0e7c58434?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518834107813-67b0e7c58434?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45d8f27f2925?w=900&h=600&fit=crop",
    ],
    about:
      "Learn traditional Newari dance movements. Experience the grace and rhythm of Nepal's cultural dances in a fun, interactive session.",
    dateOptions: [
      { date: "2026-07-14", weekday: "Mon", day: "14", available: true },
      { date: "2026-07-16", weekday: "Wed", day: "16", available: true },
      { date: "2026-07-18", weekday: "Fri", day: "18", available: true },
      { date: "2026-07-20", weekday: "Sun", day: "20", available: false },
    ],
    timeOptions: ["10:00 AM", "3:00 PM"],
  },

  // ===== Healing =====
  {
    id: "herbal-medicine-workshop",
    title: "Traditional Herbal Medicine Workshop",
    category: "Healing",
    badge: "Popular",
    artisanName: "Dr. Kamal Adhikari",
    artisanTitle: "Ayurvedic Practitioner · Pokhara",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Pokhara, Gandaki",
    city: "Pokhara",
    durationLabel: "4 Hours",
    maxPeople: 6,
    materialsIncluded: true,
    rating: 4.9,
    reviewCount: 67,
    spotsLeft: 3,
    price: 2000,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=600&fit=crop",
    ],
    about:
      "Discover the healing power of Himalayan herbs. Learn to identify medicinal plants and create traditional remedies and natural medicines.",
    dateOptions: [
      { date: "2026-07-15", weekday: "Tue", day: "15", available: true },
      { date: "2026-07-17", weekday: "Thu", day: "17", available: true },
      { date: "2026-07-19", weekday: "Sat", day: "19", available: true },
    ],
    timeOptions: ["8:00 AM", "1:00 PM"],
  },
];

export default EXPERIENCES_SEED;
