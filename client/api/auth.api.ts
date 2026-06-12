import { api, tokenStorage } from "./client";

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

const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const data = await api.post<AuthResponse>("/auth/register", payload);
    await tokenStorage.setTokens(
      data.tokens.accessToken,
      data.tokens.refreshToken,
    );
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const data = await api.post<AuthResponse>("/auth/login", payload);
    await tokenStorage.setTokens(
      data.tokens.accessToken,
      data.tokens.refreshToken,
    );
    return data;
  },

  me: () => api.get<{ user: PublicUser }>("/auth/me"),

  logout: async () => {
    const refreshToken = await tokenStorage.getRefresh();
    try {
      await api.post("/auth/logout", { refreshToken });
    } finally {
      await tokenStorage.clearAll();
    }
  },
};

export default authApi;
