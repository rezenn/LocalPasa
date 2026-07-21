import { api, ApiError, tokenStorage } from "./client";
import {
  localAuthStore,
  isLocalToken,
  makeLocalTokens,
  LocalUser,
} from "../utils/LocalAuthFallback";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: "tourist" | "artisan" | "admin";
  avatar?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  tokens: AuthTokens;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "tourist" | "artisan";
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Only real 4xx responses (bad password, duplicate email, etc.) should be
// shown to the user as-is. Anything else — no network, backend down,
// backend erroring, backend not fully built yet — falls back locally so
// signup/login never hard-blocks the app.
const isRealValidationError = (err: unknown): err is ApiError =>
  err instanceof ApiError && err.statusCode >= 400 && err.statusCode < 500;

const toPublicUser = (u: LocalUser): PublicUser => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  phoneNumber: u.phone,
  role: u.role,
  avatar: u.avatar,
  emailVerified: u.emailVerified,
  twoFactorEnabled: u.twoFactorEnabled,
  lastLogin: u.lastLogin,
  createdAt: u.createdAt,
});

const localGenId = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

async function localRegister(payload: RegisterPayload): Promise<AuthResponse> {
  if (payload.password !== payload.confirmPassword) {
    throw new ApiError("Passwords do not match", 400);
  }
  const existing = await localAuthStore.findByEmail(payload.email);
  if (existing) {
    // Same account already exists on-device — just log them in instead of
    // failing registration outright.
    return localLogin({ email: payload.email, password: payload.password });
  }

  const [firstName, ...rest] = payload.fullName.trim().split(" ");
  const user: LocalUser = {
    id: localGenId(),
    firstName: firstName || payload.fullName,
    lastName: rest.join(" "),
    email: payload.email.toLowerCase(),
    password: payload.password,
    phone: payload.phone,
    role: payload.role ?? "tourist",
    emailVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  await localAuthStore.create(user);
  await localAuthStore.setSession(user.id);

  const tokens = makeLocalTokens(user.id);
  await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

  return { user: toPublicUser(user), tokens };
}

async function localLogin(payload: LoginPayload): Promise<AuthResponse> {
  const user = await localAuthStore.findByEmail(payload.email);
  if (!user || user.password !== payload.password) {
    throw new ApiError(
      "Invalid email or password. (Checked on-device account — the server is unreachable right now.)",
      401,
    );
  }
  const updated = await localAuthStore.update(user.id, {
    lastLogin: new Date().toISOString(),
  });
  await localAuthStore.setSession(user.id);

  const tokens = makeLocalTokens(user.id);
  await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

  return { user: toPublicUser(updated ?? user), tokens };
}

async function localMe(): Promise<{ user: PublicUser }> {
  const userId = await localAuthStore.getSession();
  if (!userId) throw new ApiError("Not authenticated", 401);
  const user = await localAuthStore.findById(userId);
  if (!user) throw new ApiError("Not authenticated", 401);
  return { user: toPublicUser(user) };
}

const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const data = await api.post<AuthResponse>("/auth/register", payload);
      await tokenStorage.setTokens(
        data.tokens.accessToken,
        data.tokens.refreshToken,
      );
      return data;
    } catch (err) {
      if (isRealValidationError(err)) throw err;
      console.warn(
        "Register: backend unreachable, creating account on-device instead.",
        err,
      );
      return localRegister(payload);
    }
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const data = await api.post<AuthResponse>("/auth/login", payload);
      await tokenStorage.setTokens(
        data.tokens.accessToken,
        data.tokens.refreshToken,
      );
      return data;
    } catch (err) {
      if (isRealValidationError(err)) {
        // Backend reached and said "no" (wrong password, etc). Still worth
        // checking the on-device fallback in case this account was created
        // there while the backend was down.
        const local = await localAuthStore.findByEmail(payload.email);
        if (local) return localLogin(payload);
        throw err;
      }
      console.warn(
        "Login: backend unreachable, checking on-device account instead.",
        err,
      );
      return localLogin(payload);
    }
  },

  me: async (): Promise<{ user: PublicUser }> => {
    const token = await tokenStorage.getAccess();
    if (isLocalToken(token)) return localMe();

    try {
      return await api.get<{ user: PublicUser }>("/auth/me");
    } catch (err) {
      // Token might be a stale local one from before an app update, or the
      // backend might be down mid-session — check local as a last resort.
      const local = await localAuthStore.getSession();
      if (local) return localMe();
      throw err;
    }
  },

  forgotPassword: (email: string) =>
    api.post<{ devResetToken?: string } | null>("/auth/forgot-password", {
      email,
    }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    api.post<null>("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    }),

  logout: async () => {
    const token = await tokenStorage.getAccess();
    if (!isLocalToken(token)) {
      const refreshToken = await tokenStorage.getRefresh();
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (err) {
        console.warn(
          "Logout: backend unreachable, clearing local session only.",
          err,
        );
      }
    }
    await localAuthStore.clearSession();
    await tokenStorage.clearAll();
  },
};

export default authApi;
