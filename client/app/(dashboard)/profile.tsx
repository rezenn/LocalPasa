import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { profileApi } from "../../api/index";
import { useAuth } from "../../context/AuthContext";
import { usePreferences } from "../../context/PreferencesContext";
import { useAsync } from "../../hooks/index";

const LANGUAGE_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  ne: "🇳🇵",
  hi: "🇮🇳",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  ar: "🇸🇦",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { prefs } = usePreferences();

  // The screen renders instantly from AuthContext (populated at login/
  // register and restored on app boot) instead of blocking on a network
  // call. profileApi.getMe() only fills in the saved-items count in the
  // background — if it's slow or the backend is unreachable, the rest of
  // the profile still works.
  const { data: profile } = useAsync(() => profileApi.getMe(), []);
  const savedCount = profile?.savedCount ?? 0;

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } finally {
            router.replace("/(auth)/LoginScreen");
          }
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.primary}
          size="large"
        />
      </SafeAreaView>
    );
  }

  const initials = user.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : user.email[0].toUpperCase();

  // Use prefs.language if set, otherwise default
  const displayLang = prefs.language || "English";
  const displayLangCode = prefs.languageCode || "en";
  const langFlag = LANGUAGE_FLAGS[displayLangCode] ?? "🌐";

  // Interests/locations/nationality all live in PreferencesContext — set
  // during onboarding and editable afterwards from Profile.
  const displayInterests = prefs.interests;
  const displayLocations = prefs.preferredLocations;

  const stats = [
    { label: "Sites", value: savedCount },
    { label: "Saved", value: savedCount },
    { label: "Reviews", value: 0 },
  ];

  const MENU_SECTIONS = [
    {
      title: "Preferences",
      items: [
        {
          icon: "heart-outline" as const,
          label: "My Interests",
          sub:
            displayInterests.length > 0
              ? displayInterests.slice(0, 2).join(", ")
              : "Set your interests",
          route: "/profile/interests",
          color: "#E91E63",
        },
        {
          icon: "location-outline" as const,
          label: "Preferred Locations",
          sub:
            displayLocations.length > 0
              ? displayLocations.slice(0, 2).join(", ")
              : "Set preferred locations",
          route: "/profile/locations",
          color: "#2196F3",
        },
        {
          icon: "language-outline" as const,
          label: "Language",
          sub: `${langFlag} ${displayLang}`,
          route: "/profile/language",
          color: "#9C27B0",
        },
        {
          icon: "notifications-outline" as const,
          label: "Notifications",
          sub: prefs.notificationsEnabled ? "On" : "Off",
          route: "/profile/notifications",
          color: "#FF9800",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: "person-outline" as const,
          label: "Edit Profile",
          sub: "Name, photo, nationality",
          route: "/profile/edit",
          color: Colors.primary,
        },
        {
          icon: "bookmark-outline" as const,
          label: "Saved Places",
          sub: "Your bookmarks",
          route: "/profile/saved",
          color: "#4CAF50",
        },
        {
          icon: "sparkles-outline" as const,
          label: "My Experiences",
          sub: "Booked workshops & activities",
          route: "/profile/my-experiences",
          color: "#F5A623",
        },
        {
          icon: "language-outline" as const,
          label: "Translate",
          sub: "Translate content",
          route: "/translate",
          color: "#00BCD4",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: "shield-checkmark-outline" as const,
          label: "Privacy & Security",
          sub: "Data & permissions",
          route: "/profile/privacy",
          color: "#607D8B",
        },
        {
          icon: "help-circle-outline" as const,
          label: "Help & Support",
          sub: "FAQ, contact us",
          route: "/profile/help",
          color: "#795548",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.brown} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.settingsHeroBtn}
            onPress={() => router.push("/profile/settings" as any)}
          >
            <Ionicons name="settings-outline" size={16} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editHeroBtn}
            onPress={() => router.push("/profile/edit" as any)}
          >
            <Ionicons name="pencil" size={14} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.avatarWrapper}>
            {prefs.avatarUri || user.avatar ? (
              <Image
                source={{ uri: prefs.avatarUri || user.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.avatarEditBtn}
              onPress={() => router.push("/profile/edit" as any)}
            >
              <Ionicons name="camera" size={12} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          {prefs.nationality ? (
            <View style={styles.nationalityBadge}>
              <Text style={styles.nationalityText}>{prefs.nationality}</Text>
            </View>
          ) : null}
        </View>

        {/* Stats card */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View
              key={s.label}
              style={[
                styles.statBox,
                i < stats.length - 1 && styles.statBoxBorder,
              ]}
            >
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuGroup}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuItem,
                    idx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIconWrap,
                      { backgroundColor: item.color + "18" },
                    ]}
                  >
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.sub ? (
                      <Text style={styles.menuSub} numberOfLines={1}>
                        {item.sub}
                      </Text>
                    ) : null}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App version */}
        <Text style={styles.version}>LocalPasa v1.0.0</Text>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight || 0,
  },
  hero: {
    backgroundColor: Colors.brown,
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl + Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    position: "relative",
  },
  editHeroBtn: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsHeroBtn: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.lg + 32 + Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: { marginBottom: Spacing.md, position: "relative" },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 34, color: Colors.white, fontWeight: "700" },
  avatarEditBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: "CrimsonBold",
    marginBottom: 2,
  },
  email: { fontSize: 13, color: "#E2DBDB" },
  nationalityBadge: {
    marginTop: Spacing.sm,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  nationalityText: { fontSize: 12, color: Colors.white, fontWeight: "500" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: -(Spacing.xl + 4),
    borderRadius: Radius.lg,
    ...Shadow.md,
    overflow: "hidden",
  },
  statBox: { flex: 1, alignItems: "center", paddingVertical: Spacing.md },
  statBoxBorder: { borderRightWidth: 1, borderRightColor: Colors.border },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  interestPreview: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  interestPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  interestPreviewTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  interestPreviewEdit: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  chip: {
    backgroundColor: "#F0EAE2",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  chipText: { fontSize: 12, color: Colors.primary, fontWeight: "500" },
  section: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuGroup: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextWrap: { flex: 1 },
  menuLabel: { fontSize: 14, color: Colors.text, fontWeight: "600" },
  menuSub: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xl,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: "#FEF2F2",
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: { fontSize: 15, color: Colors.error, fontWeight: "700" },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  errorText: { fontSize: 15, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
  logoutBtnAlt: { marginTop: Spacing.sm },
  logoutBtnAltText: { color: Colors.error, fontWeight: "600", fontSize: 14 },
});
