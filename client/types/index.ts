// ─── Core domain types (aligned with backend _id) ────────────────────────────

export interface Site {
  latitude: any;
  _id: string;
  name: string;
  type?: string;
  location: string;
  city?: string;
  distance?: string;
  price: string;
  mustVisit?: boolean;
  isHiddenGem?: boolean;
  rating?: number;
  ratingCount?: number;
  image: string;
  images?: string[];
  summary?: string;
}

export interface Artisan {
  _id: string;
  name: string;
  craft: string;
  location: string;
  city?: string;
  distance?: string;
  image: string;
  rating?: number;
  ratingCount?: number;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  month: string;
  fullDate?: string;
  location: string;
  city?: string;
  distance?: string;
  type: string;
  price: string;
  image?: string;
  description?: string;
}

export interface Review {
  _id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  createdAt?: string;
}

export interface SiteDetail extends Site {
  longDescription?: string;
  history?: string;
  myth?: string;
  didYouKnow?: string;
  openingHours?: string;
  quizzes?: Array<{ question: string; options: string[]; correct: number }>;
  nearbyArtisans: Artisan[];
  reviews: Review[];
  computedRating?: number;
  reviewCount?: number;
}

export interface ArtisanDetail extends Artisan {
  bio?: string;
  longBio?: string;
  experience?: number;
  priceRange?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  products?: Array<{
    name: string;
    price: string;
    description: string;
    image?: string;
    inStock?: boolean;
  }>;
  workshops?: Array<{
    name: string;
    duration: string;
    price: string;
    maxParticipants: number;
    description?: string;
  }>;
  associatedSites: Site[];
  reviews: Review[];
  computedRating?: number;
  reviewCount?: number;
}

export type TabScreenName = "explore" | "map" | "calendar" | "save" | "profile";

export type RootStackParamList = {
  Home: undefined;
  SiteDetail: { siteId: string };
  Map: undefined;
  Calendar: undefined;
  Saved: undefined;
  Profile: undefined;
};
