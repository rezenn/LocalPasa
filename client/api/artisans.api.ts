import { api } from "./client";
import { Review } from "./sites.api";

export interface Artisan {
  _id: string;
  name: string;
  craft: string;
  location: string;
  city: string;
  distance?: string;
  image: string;
  images?: string[];
  bio?: string;
  longBio?: string;
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
  rating: number;
  ratingCount: number;
  experience?: number;
  priceRange?: string;
}

export interface ArtisanDetail extends Artisan {
  associatedSites: import("./sites.api").Site[];
  reviews: Review[];
  computedRating: number;
  reviewCount: number;
}

export interface PaginatedArtisans {
  artisans: Artisan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArtisanFilters {
  city?: string;
  craft?: string;
  search?: string;
  minRating?: number;
  sortBy?: "rating" | "experience" | "name";
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

const artisansApi = {
  getAll: (filters: ArtisanFilters = {}) =>
    api.get<PaginatedArtisans>(
      `/artisans${buildQuery(filters as Record<string, unknown>)}`,
    ),

  getById: (id: string) => api.get<ArtisanDetail>(`/artisans/${id}`),

  getByCraft: (craft: string, limit = 10) =>
    api.get<Artisan[]>(
      `/artisans/craft/${encodeURIComponent(craft)}?limit=${limit}`,
    ),

  getProducts: (id: string) =>
    api.get<{ artisanName: string; products: Artisan["products"] }>(
      `/artisans/${id}/products`,
    ),

  getWorkshops: (id: string) =>
    api.get<{ artisanName: string; workshops: Artisan["workshops"] }>(
      `/artisans/${id}/workshops`,
    ),

  getReviews: (id: string, page = 1, limit = 10) =>
    api.get<{ reviews: Review[]; total: number; totalPages: number }>(
      `/artisans/${id}/reviews?page=${page}&limit=${limit}`,
    ),

  addReview: (id: string, payload: { rating: number; text: string }) =>
    api.post<Review>(`/artisans/${id}/reviews`, payload),
};

export default artisansApi;
