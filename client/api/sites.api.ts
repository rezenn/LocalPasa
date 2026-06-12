import { api } from "./client";

export interface Site {
  _id: string;
  name: string;
  type: string;
  location: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  distance?: string;
  price: string;
  mustVisit: boolean;
  isHiddenGem: boolean;
  rating: number;
  ratingCount: number;
  image: string;
  images: string[];
  summary: string;
  longDescription?: string;
  history?: string;
  myth?: string;
  didYouKnow?: string;
  openingHours?: string;
  quizzes?: Array<{ question: string; options: string[]; correct: number }>;
  translations?: Record<string, string>;
}

export interface SiteDetail extends Site {
  nearbyArtisans: import("./artisans.api").Artisan[];
  reviews: Review[];
  computedRating: number;
  reviewCount: number;
}

export interface Review {
  _id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  createdAt: string;
}

export interface PaginatedSites {
  sites: Site[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SiteFilters {
  city?: string;
  type?: string;
  search?: string;
  hidden?: boolean;
  mustVisit?: boolean;
  minRating?: number;
  sortBy?: "rating" | "newest" | "oldest" | "name";
  page?: number;
  limit?: number;
}

const buildQuery = (params: Record<string, unknown>): string => {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return q ? `?${q}` : "";
};

const sitesApi = {
  getAll: (filters: SiteFilters = {}) =>
    api.get<PaginatedSites>(
      `/sites${buildQuery(filters as Record<string, unknown>)}`,
    ),

  getById: (id: string) => api.get<SiteDetail>(`/sites/${id}`),

  getHiddenGems: (limit = 10) =>
    api.get<Site[]>(`/sites/hidden-gem?limit=${limit}`),

  getMustVisit: (limit = 10) =>
    api.get<Site[]>(`/sites/must-visit?limit=${limit}`),

  getByType: (type: string, limit = 10) =>
    api.get<Site[]>(`/sites/type/${encodeURIComponent(type)}?limit=${limit}`),

  getQuizzes: (id: string) =>
    api.get<{ siteName: string; quizzes: Site["quizzes"] }>(
      `/sites/${id}/quizzes`,
    ),

  getReviews: (id: string, page = 1, limit = 10) =>
    api.get<{ reviews: Review[]; total: number; totalPages: number }>(
      `/sites/${id}/reviews?page=${page}&limit=${limit}`,
    ),

  addReview: (id: string, payload: { rating: number; text: string }) =>
    api.post<Review>(`/sites/${id}/reviews`, payload),
};

export default sitesApi;
