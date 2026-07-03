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
import { useAsync } from "../../hooks/index";

const MENU_ITEMS = [
  {
    icon: "heart-outline" as const,
    label: "My Interests",
    route: "/screens/notifications",
  },
  {
    icon: "location-outline" as const,
    label: "Preferred Locations",
    route: null,
  },
  {
    icon: "language-outline" as const,
    label: "Language · English",
    route: "/screens/translate",
  },
  {
    icon: "notifications-outline" as const,
    label: "Notifications",
    route: "/screens/settings",
  },
  {
    icon: "compass-outline" as const,
    label: "Experiences",
    route: "/screens/events-list",
  },
  {
    icon: "create-outline" as const,
    label: "Edit Profile",
    route: "/screens/edit-profile",
  },
  {
    icon: "globe-outline" as const,
    label: "Translate",
    route: "/screens/translate",
  },
  {
    icon: "lock-closed-outline" as const,
    label: "Change Password",
    route: null,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    data: profile,
    loading,
    error,
    refetch,
  } = useAsync(() => profileApi.getMe(), []);

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

  if (loading) {
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

  const initials = profile?.firstName
    ? `${profile.firstName[0]}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : (profile?.email?.[0] ?? "U").toUpperCase();

  const statsData = [
    { label: "Sites visited", value: "12" },
    { label: "Saved", value: "23" },
    { label: "Reviews", value: "9" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarCircle}>
            {profile?.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatarImg}
              />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </View>
          <Text style={styles.heroName}>
            {profile?.firstName
              ? `${profile.firstName} ${profile.lastName ?? ""}`
              : "LocalPasa User"}
          </Text>
          <Text style={styles.heroEmail}>{profile?.email ?? ""}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {statsData.map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
                {i < statsData.length - 1 && (
                  <View style={styles.statDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuRow,
                idx < MENU_ITEMS.length - 1 && styles.menuBorder,
              ]}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Ionicons name={item.icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl + 8,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.white + "30",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white + "60",
    marginBottom: Spacing.md,
  },
  avatarImg: { width: 90, height: 90, borderRadius: 45 },
  avatarInitials: { fontSize: 32, fontWeight: "700", color: Colors.white },
  heroName: {
    fontSize: 22,
    fontFamily: "CrimsonBold",
    color: Colors.white,
    marginBottom: 2,
  },
  heroEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.white + "20",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "700", color: Colors.white },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.3)" },
  menuCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: Radius.xl,
    ...Shadow.sm,
    marginTop: Spacing.xl,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { fontSize: 14, color: Colors.text, fontWeight: "500" },
  logoutBtn: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.error,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
    ...Shadow.sm,
  },
  logoutText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
