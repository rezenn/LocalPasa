import { useState, useEffect, useCallback } from "react";
import sitesApi, { Site, SiteDetail, SiteFilters } from "../api/sites.api";
import artisansApi, {
  Artisan,
  ArtisanDetail,
  ArtisanFilters,
} from "../api/artisans.api";
import eventsApi, { Event, EventFilters } from "../api/events.api";
import {
  savedApi,
  searchApi,
  profileApi,
  SearchResults,
  ProfileData,
} from "../api/index";
import authApi, {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../api/auth.api";
import { ApiError } from "../api/client";

// ─── Generic async hook ───────────────────────────────────────────────────────
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
  immediate = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}

// ─── Sites ────────────────────────────────────────────────────────────────────
export const useSites = (filters: SiteFilters = {}) => {
  const key = JSON.stringify(filters);
  return useAsync(() => sitesApi.getAll(filters), [key]);
};

export const useSite = (id: string) =>
  useAsync(() => sitesApi.getById(id), [id], !!id);

export const useHiddenGems = (limit = 10) =>
  useAsync(() => sitesApi.getHiddenGems(limit), [limit]);

export const useMustVisitSites = (limit = 10) =>
  useAsync(() => sitesApi.getMustVisit(limit), [limit]);

export const useSiteQuizzes = (id: string) =>
  useAsync(() => sitesApi.getQuizzes(id), [id], !!id);

export const useSiteReviews = (id: string) =>
  useAsync(() => sitesApi.getReviews(id), [id], !!id);

// ─── Artisans ─────────────────────────────────────────────────────────────────
export const useArtisans = (filters: ArtisanFilters = {}) => {
  const key = JSON.stringify(filters);
  return useAsync(() => artisansApi.getAll(filters), [key]);
};

export const useArtisan = (id: string) =>
  useAsync(() => artisansApi.getById(id), [id], !!id);

export const useArtisansByCraft = (craft: string) =>
  useAsync(() => artisansApi.getByCraft(craft), [craft], !!craft);

// ─── Events ───────────────────────────────────────────────────────────────────
export const useEvents = (filters: EventFilters = {}) => {
  const key = JSON.stringify(filters);
  return useAsync(() => eventsApi.getAll(filters), [key]);
};

export const useEvent = (id: string) =>
  useAsync(() => eventsApi.getById(id), [id], !!id);

export const useUpcomingEvents = (limit = 10) =>
  useAsync(() => eventsApi.getUpcoming(limit), [limit]);

export const useCurrentMonthEvents = () =>
  useAsync(() => eventsApi.getCurrentMonth(), []);

// ─── Saved ────────────────────────────────────────────────────────────────────
export const useSaved = () => {
  const { data, loading, error, refetch } = useAsync(
    () => savedApi.getAll(),
    [],
  );

  const save = useCallback(
    async (itemId: string, itemType: "site" | "artisan" | "event") => {
      await savedApi.save(itemId, itemType);
      refetch();
    },
    [refetch],
  );

  const remove = useCallback(
    async (itemId: string, itemType: "site" | "artisan" | "event") => {
      await savedApi.remove(itemId, itemType);
      refetch();
    },
    [refetch],
  );

  return { data, loading, error, save, remove, refetch };
};

// ─── Search ───────────────────────────────────────────────────────────────────
export const useSearch = () => {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (
      q: string,
      type: "all" | "sites" | "artisans" | "events" = "all",
      city?: string,
    ) => {
      if (!q.trim() || q.trim().length < 2) return;
      setLoading(true);
      setError(null);
      try {
        const data = await searchApi.search(q, type, city);
        setResults(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { results, loading, error, search };
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const useProfile = () => {
  const { data, loading, error, refetch } = useAsync(
    () => profileApi.getMe(),
    [],
  );

  const update = useCallback(
    async (payload: Parameters<typeof profileApi.update>[0]) => {
      await profileApi.update(payload);
      refetch();
    },
    [refetch],
  );

  return { profile: data, loading, error, update, refetch };
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(payload);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Login failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(payload);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Registration failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout };
};
