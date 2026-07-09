import { api } from "./client";
import { Site } from "./sites.api";
import { Artisan } from "./artisans.api";
import { Event } from "./events.api";
import { PublicUser } from "./auth.api";

// ─── Saved ────────────────────────────────────────────────────────────────────
export const savedApi = {
  getAll: () =>
    api.get<{ sites: Site[]; artisans: Artisan[]; events: Event[] }>("/saved"),

  save: (itemId: string, itemType: "site" | "artisan" | "event") =>
    api.post("/saved", { itemId, itemType }),

  remove: (itemId: string, itemType: "site" | "artisan" | "event") =>
    api.delete(`/saved/${itemId}?itemType=${itemType}`),
};

// ─── Search ───────────────────────────────────────────────────────────────────
export interface SearchResults {
  sites?: Site[];
  artisans?: Artisan[];
  events?: Event[];
}

export interface SearchSuggestion {
  type: "site" | "artisan" | "event";
  name: string;
  id: string;
  location?: string;
  craft?: string;
}

export const searchApi = {
  search: (
    q: string,
    type: "all" | "sites" | "artisans" | "events" = "all",
    city?: string,
  ) => {
    const params = new URLSearchParams({ q, type });
    if (city) params.set("city", city);
    return api.get<SearchResults>(`/search?${params.toString()}`);
  },

  suggestions: (q: string) =>
    api.get<{ suggestions: SearchSuggestion[] }>(
      `/search/suggestions?q=${encodeURIComponent(q)}`,
    ),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface ProfileData extends PublicUser {
  savedCount: number;
  tourismPreferences: string[];
  preferredLanguage: string;
  nationality?: string;
  phone?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  nationality?: string;
  preferredLanguage?: string;
  tourismPreferences?: string[];
  avatar?: string;
}

export const profileApi = {
  getMe: () => api.get<ProfileData>("/profile/me"),

  update: (payload: UpdateProfilePayload) =>
    api.patch<PublicUser>("/profile/update", payload),

  getSavedStats: () =>
    api.get<{ total: number; sites: number; artisans: number; events: number }>(
      "/profile/saved/stats",
    ),

  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) =>
    api.post<null>("/profile/change-password", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalSites: number;
  totalArtisans: number;
  totalEvents: number;
  totalReviews: number;
  totalUsers: number;
  avgSiteRating: number;
  avgArtisanRating: number;
}

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats"),

  getTopRated: (limit = 5) =>
    api.get<{
      topSites: Pick<
        Site,
        "_id" | "name" | "type" | "city" | "rating" | "ratingCount" | "image"
      >[];
      topArtisans: Pick<
        Artisan,
        "_id" | "name" | "craft" | "city" | "rating" | "ratingCount" | "image"
      >[];
    }>(`/dashboard/top-rated?limit=${limit}`),
};
