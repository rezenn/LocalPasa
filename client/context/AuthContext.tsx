import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import authApi, {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/api/auth.api";
import { ApiError, tokenStorage } from "@/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthState {
  user: AuthResponse["user"] | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (patch: Partial<AuthResponse["user"]>) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    initializing: true,
    error: null,
  });

  // On mount: if we have an access token, restore the user via /auth/me
  useEffect(() => {
    (async () => {
      try {
        const token = await tokenStorage.getAccess();
        if (token) {
          const result = await authApi.me();
          setState((s) => ({
            ...s,
            user: result.user,
            initializing: false,
          }));
        } else {
          setState((s) => ({ ...s, initializing: false }));
        }
      } catch {
        // token expired or invalid — clear and boot fresh
        await tokenStorage.clearAll();
        setState((s) => ({ ...s, initializing: false }));
      }
    })();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await authApi.login(payload);
      setState((s) => ({ ...s, user: data.user, loading: false }));
      return data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Login failed";
      setState((s) => ({ ...s, error: msg, loading: false }));
      throw err;
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await authApi.register(payload);
      setState((s) => ({ ...s, user: data.user, loading: false }));
      return data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Registration failed";
      setState((s) => ({ ...s, error: msg, loading: false }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    await authApi.logout();
    setState({ user: null, loading: false, initializing: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  // Applies edits locally right away (e.g. from Edit Profile) so the UI
  // reflects changes instantly even if the backend call is slow, unreachable,
  // or not wired up yet. Safe to call alongside a background API call.
  const updateUser = useCallback((patch: Partial<AuthResponse["user"]>) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, clearError, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
