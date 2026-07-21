import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AppPreferences {
  language: string; // e.g. "English", "नेपाली"
  languageCode: string; // e.g. "en", "ne"
  interests: string[]; // e.g. ["Temples & Heritages", "Local Food"]
  preferredLocations: string[]; // e.g. ["Kathmandu Valley", "Pokhara"]
  nationality: string;
  avatarUri: string; // local device URI/data-URI for the profile photo
  notificationsEnabled: boolean;
  hasCompletedOnboarding: boolean;
}

interface PreferencesContextValue {
  prefs: AppPreferences;
  setLanguage: (name: string, code: string) => Promise<void>;
  setInterests: (interests: string[]) => Promise<void>;
  setLocations: (locations: string[]) => Promise<void>;
  setNationality: (nationality: string) => Promise<void>;
  setAvatar: (uri: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  loading: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULTS: AppPreferences = {
  language: "English",
  languageCode: "en",
  interests: [],
  preferredLocations: [],
  nationality: "",
  avatarUri: "",
  notificationsEnabled: true,
  hasCompletedOnboarding: false,
};

const STORAGE_KEY = "localpasa_prefs";

// ─── Context ──────────────────────────────────────────────────────────────────
const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<AppPreferences>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (updated: AppPreferences) => {
    setPrefs(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const setLanguage = useCallback(
    async (name: string, code: string) => {
      await persist({ ...prefs, language: name, languageCode: code });
    },
    [prefs, persist],
  );

  const setInterests = useCallback(
    async (interests: string[]) => {
      await persist({ ...prefs, interests });
    },
    [prefs, persist],
  );

  const setLocations = useCallback(
    async (preferredLocations: string[]) => {
      await persist({ ...prefs, preferredLocations });
    },
    [prefs, persist],
  );

  const setNationality = useCallback(
    async (nationality: string) => {
      await persist({ ...prefs, nationality });
    },
    [prefs, persist],
  );

  const setAvatar = useCallback(
    async (avatarUri: string) => {
      await persist({ ...prefs, avatarUri });
    },
    [prefs, persist],
  );

  const completeOnboarding = useCallback(async () => {
    await persist({ ...prefs, hasCompletedOnboarding: true });
  }, [prefs, persist]);

  const toggleNotifications = useCallback(async () => {
    await persist({
      ...prefs,
      notificationsEnabled: !prefs.notificationsEnabled,
    });
  }, [prefs, persist]);

  return (
    <PreferencesContext.Provider
      value={{
        prefs,
        setLanguage,
        setInterests,
        setLocations,
        setNationality,
        setAvatar,
        completeOnboarding,
        toggleNotifications,
        loading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}
