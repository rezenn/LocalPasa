// On-device fallback used only when the real backend can't be reached (not
// running yet, still being built, network hiccup, etc). This guarantees
// registration → onboarding → dashboard always works from the frontend
// side, even with no backend behind it. Once the real backend auth flow is
// solid end-to-end, this fallback simply stops being needed — accounts
// created here don't sync anywhere else, so it's a stopgap, not a
// replacement.
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "lp_local_users";
const SESSION_KEY = "lp_local_session";

export interface LocalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: "tourist" | "artisan" | "admin";
  avatar?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin?: string;
}

async function getUsers(): Promise<LocalUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalUser[]) : [];
  } catch {
    return [];
  }
}

async function saveUsers(users: LocalUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const localAuthStore = {
  findByEmail: async (email: string) => {
    const users = await getUsers();
    return (
      users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
    );
  },

  findById: async (id: string) => {
    const users = await getUsers();
    return users.find((u) => u.id === id) ?? null;
  },

  create: async (user: LocalUser) => {
    const users = await getUsers();
    users.push(user);
    await saveUsers(users);
    return user;
  },

  update: async (id: string, patch: Partial<LocalUser>) => {
    const users = await getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...patch };
    await saveUsers(users);
    return users[idx];
  },

  setSession: (id: string) => AsyncStorage.setItem(SESSION_KEY, id),
  getSession: () => AsyncStorage.getItem(SESSION_KEY),
  clearSession: () => AsyncStorage.removeItem(SESSION_KEY),
};

export const LOCAL_TOKEN_PREFIX = "local-access-";

export const isLocalToken = (token: string | null) =>
  !!token && token.startsWith(LOCAL_TOKEN_PREFIX);

export const makeLocalTokens = (userId: string) => ({
  accessToken: `${LOCAL_TOKEN_PREFIX}${userId}-${Date.now()}`,
  refreshToken: `local-refresh-${userId}-${Date.now()}`,
  expiresIn: 60 * 60 * 24 * 7,
});
