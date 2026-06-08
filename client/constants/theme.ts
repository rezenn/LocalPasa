export const Colors = {
  primary: "#2C7A3A",
  primaryLight: "#4CAF6B",
  secondary: "#F5A623",
  background: "#F7F4EF",
  surface: "#FFFFFF",
  surfaceWarm: "#FAF7F2",
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#9E9E9E",
  border: "#E8E2D9",
  badge: "#E8F5E9",
  badgeText: "#2C7A3A",
  mustVisit: "#2C7A3A",
  star: "#F5A623",
  freeEntry: "#E8F5E9",
  eventDate: "#3D5A80",
  error: "#D32F2F",
  white: "#FFFFFF",
  black: "#000000",
  brown: "#6B4F3A",
  overlay: "rgba(0,0,0,0.35)",
  gemBadge: "rgba(255,255,255,0.15)",
} as const;

export const Typography = {
  fontBold: { fontWeight: "700" as const },
  fontSemiBold: { fontWeight: "600" as const },
  fontMedium: { fontWeight: "500" as const },
  fontRegular: { fontWeight: "400" as const },
  h1: { fontSize: 24, fontWeight: "700" as const, color: Colors.text },
  h2: { fontSize: 20, fontWeight: "700" as const, color: Colors.text },
  h3: { fontSize: 16, fontWeight: "600" as const, color: Colors.text },
  body: { fontSize: 14, fontWeight: "400" as const, color: Colors.text },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: Colors.textSecondary,
  },
  small: { fontSize: 11, fontWeight: "400" as const, color: Colors.textMuted },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
