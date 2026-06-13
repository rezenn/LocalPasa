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
          style={styles.loader}
          color={Colors.primary}
          size="large"
        />
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Could not load profile</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtnAlt} onPress={handleLogout}>
            <Text style={styles.logoutBtnAltText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const initials = profile.firstName
    ? `${profile.firstName[0]}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : profile.email[0].toUpperCase();

  const stats = [
    { label: "Saved", value: profile.savedCount ?? 0 },
    {
      label: "Language",
      value: profile.preferredLanguage?.toUpperCase() ?? "EN",
    },
    {
      label: "Role",
      value: profile.role.charAt(0).toUpperCase() + profile.role.slice(1),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            {profile.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.email}>{profile.email}</Text>
          {profile.nationality ? (
            <Text style={styles.nationality}>{profile.nationality}</Text>
          ) : null}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Preferences */}
        {(profile.tourismPreferences?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.chips}>
              {profile.tourismPreferences!.map((pref: any) => (
                <View key={pref} style={styles.chip}>
                  <Text style={styles.chipText}>{pref}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Menu items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {[
            { icon: "person-outline" as const, label: "Edit Profile" },
            { icon: "heart-outline" as const, label: "Saved Places" },
            { icon: "notifications-outline" as const, label: "Notifications" },
            { icon: "language-outline" as const, label: "Language" },
            { icon: "shield-outline" as const, label: "Privacy & Security" },
            { icon: "help-circle-outline" as const, label: "Help & Support" },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
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
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
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
  loader: { flex: 1 },
  hero: {
    backgroundColor: Colors.brown,
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  avatarWrapper: {
    marginBottom: Spacing.md,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 32, color: Colors.white, fontWeight: "700" },
  name: { fontSize: 22, color: Colors.white, fontFamily: "CrimsonBold" },
  email: { fontSize: 13, color: "#E2DBDB", marginTop: 2 },
  nationality: { fontSize: 12, color: "#D0C5C5", marginTop: 2 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    borderRadius: Radius.lg,
    ...Shadow.md,
    overflow: "hidden",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  section: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  menuLabel: { fontSize: 14, color: Colors.text, fontWeight: "500" },
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
  bottomPad: { height: 40 },
});
