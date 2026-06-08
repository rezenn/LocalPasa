export interface Site {
  id: string;
  name: string;
  type?: string;
  location: string;
  distance: string;
  price: string;
  mustVisit?: boolean;
  rating?: number;
  image: string;
}

export interface Artisan {
  id: string;
  name: string;
  craft: string;
  location: string;
  distance: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  month: string;
  location: string;
  distance: string;
  type: string;
  price: string;
}

export interface HiddenGem {
  id: string;
  title: string;
  distance: string;
  price: string;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
}

export interface SiteDetail extends Site {
  badge?: string;
  summary: string;
  didYouKnow: string;
  nearbyArtisans: Artisan[];
  reviews: Review[];
}

export type RootStackParamList = {
  Home: undefined;
  SiteDetail: { siteId: string };
  Map: undefined;
  Calendar: undefined;
  Saved: undefined;
  Profile: undefined;
};

export type TabScreenName = "explore" | "map" | "calendar" | "save" | "profile";
