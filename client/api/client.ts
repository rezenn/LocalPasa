import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.0.2.2:5000/api/v1";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "lp_access_token",
  REFRESH_TOKEN: "lp_refresh_token",
};

// ─── Token helpers ────────────────────────────────────────────────────────────
export const tokenStorage = {
  getAccess: () => AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  getRefresh: () => AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setAccess: (t: string) => AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, t),
  setRefresh: (t: string) =>
    AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, t),
  setTokens: (access: string, refresh: string) =>
    Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh),
    ]),
  clearAll: () =>
    Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]),
};

// ─── API Response types ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

async function tryRefresh(): Promise<string> {
  const refreshToken = await tokenStorage.getRefresh();
  if (!refreshToken) throw new ApiError("No refresh token", 401);

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data: ApiResponse<{
    tokens: { accessToken: string; refreshToken: string };
  }> = await res.json();

  if (!res.ok || !data.success || !data.data) {
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  const { accessToken, refreshToken: newRefresh } = data.data.tokens;
  await tokenStorage.setTokens(accessToken, newRefresh);
  return accessToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const accessToken = await tokenStorage.getAccess();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 401 → attempt token refresh once
  if (res.status === 401 && retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: async (token) => {
            headers["Authorization"] = `Bearer ${token}`;
            const retried = await fetch(`${BASE_URL}${path}`, {
              ...options,
              headers,
            });
            resolve(parseResponse<T>(retried));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await tryRefresh();
      processQueue(null, newToken);
      return apiFetch<T>(path, options, false); // retry with new token
    } catch (err) {
      processQueue(err);
      await tokenStorage.clearAll();
      throw new ApiError("Session expired. Please log in again.", 401);
    } finally {
      isRefreshing = false;
    }
  }

  return parseResponse<T>(res);
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data: ApiResponse<T> = await res.json();

  if (!res.ok || !data.success) {
    throw new ApiError(
      data.message ?? "Something went wrong",
      res.status,
      data.errors as { field: string; message: string }[] | undefined,
    );
  }

  return data.data as T;
}

// ─── Convenience methods ──────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
