import { api } from "./client";

export interface Event {
  _id: string;
  title: string;
  date: string;
  month: string;
  fullDate: string;
  location: string;
  city: string;
  distance?: string;
  type: string;
  price: string;
  image?: string;
  images?: string[];
  description?: string;
  longDescription?: string;
  organizer?: string;
  contact?: string;
  website?: string;
}

export interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventFilters {
  city?: string;
  type?: string;
  search?: string;
  upcoming?: boolean;
  month?: string;
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

const eventsApi = {
  getAll: (filters: EventFilters = {}) =>
    api.get<PaginatedEvents>(
      `/events${buildQuery(filters as Record<string, unknown>)}`,
    ),

  getById: (id: string) => api.get<Event>(`/events/${id}`),

  getUpcoming: (limit = 10) =>
    api.get<Event[]>(`/events/upcoming?limit=${limit}`),

  getCurrentMonth: () => api.get<Event[]>("/events/current-month"),

  getByType: (type: string, limit = 10) =>
    api.get<Event[]>(`/events/type/${encodeURIComponent(type)}?limit=${limit}`),
};

export default eventsApi;
