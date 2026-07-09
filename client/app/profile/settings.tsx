import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

type SettingsItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  route?: string;
  color: string;
  danger?: boolean;
  onPress?: () => void;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

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

  const SECTIONS: { title: string; items: SettingsItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          icon: "person-outline",
          label: "Edit Profile",
          sub: "Name, photo, nationality",
          route: "/profile/edit",
          color: Colors.primary,
        },
        {
          icon: "key-outline",
          label: "Change Password",
          sub: "Update your account password",
          route: "/profile/change-password",
          color: "#8E24AA",
        },
        {
          icon: "shield-checkmark-outline",
          label: "Privacy & Security",
          sub: "Data, permissions & account safety",
          route: "/profile/privacy",
          color: "#607D8B",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "heart-outline",
          label: "My Interests",
          sub: "What you'd like to explore",
          route: "/profile/interests",
          color: "#E91E63",
        },
        {
          icon: "location-outline",
          label: "Preferred Locations",
          sub: "Cities and regions you care about",
          route: "/profile/locations",
          color: "#2196F3",
        },
        {
          icon: "language-outline",
          label: "Language",
          sub: "App and content language",
          route: "/profile/language",
          color: "#9C27B0",
        },
        {
          icon: "notifications-outline",
          label: "Notifications",
          sub: "Manage alerts and reminders",
          route: "/profile/notifications",
          color: "#FF9800",
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          icon: "bookmark-outline",
          label: "Saved Places",
          sub: "Your bookmarked sites & artisans",
          route: "/profile/saved",
          color: "#4CAF50",
        },
        {
          icon: "language-outline",
          label: "Translate",
          sub: "Translate signs, menus & phrases",
          route: "/translate",
          color: "#00BCD4",
        },
        {
          icon: "help-circle-outline",
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
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSub}>Manage your LocalPasa experience</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: Spacing.lg }}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.row,
                    idx < section.items.length - 1 && styles.rowBorder,
                  ]}
                  activeOpacity={0.7}
                  onPress={
                    item.onPress ??
                    (() => item.route && router.push(item.route as any))
                  }
                >
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: item.color + "18" },
                    ]}
                  >
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Text style={styles.rowDesc}>{item.sub}</Text>
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

        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={styles.sectionLabel}>Session</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <View
                style={[styles.iconWrap, { backgroundColor: "#D32F2F18" }]}
              >
                <Ionicons name="log-out-outline" size={18} color="#D32F2F" />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: "#D32F2F" }]}>
                  Log Out
                </Text>
                <Text style={styles.rowDesc}>Sign out of your account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.version}>
          LocalPasa v{Constants.expoConfig?.version ?? "1.0.0"}
        </Text>

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
  header: {
    backgroundColor: Colors.brown,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, color: Colors.white, fontFamily: "CrimsonBold" },
  headerSub: { fontSize: 12, color: "#E2DBDB" },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadow.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: "600", color: Colors.text },
  rowDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
