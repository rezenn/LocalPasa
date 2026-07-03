import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";

const PRIVACY_ITEMS = [
  {
    key: "locationSharing",
    icon: "location-outline" as const,
    label: "Location Sharing",
    desc: "Allow app to access your location for nearby sites",
    color: "#2196F3",
    defaultValue: true,
  },
  {
    key: "analyticsTracking",
    icon: "bar-chart-outline" as const,
    label: "Usage Analytics",
    desc: "Help improve the app by sharing anonymous usage data",
    color: "#9C27B0",
    defaultValue: true,
  },
  {
    key: "personalizedContent",
    icon: "sparkles-outline" as const,
    label: "Personalised Content",
    desc: "See content tailored to your interests and past activity",
    color: "#FF9800",
    defaultValue: true,
  },
];

const SECURITY_ITEMS = [
  {
    icon: "key-outline" as const,
    label: "Change Password",
    desc: "Update your account password",
    color: Colors.primary,
  },
  {
    icon: "phone-portrait-outline" as const,
    label: "Two-Factor Auth",
    desc: "Add an extra layer of security",
    color: "#4CAF50",
  },
  {
    icon: "mail-outline" as const,
    label: "Connected Accounts",
    desc: "Manage linked social logins",
    color: "#2196F3",
  },
  {
    icon: "trash-outline" as const,
    label: "Delete Account",
    desc: "Permanently remove your account",
    color: "#D32F2F",
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    locationSharing: true,
    analyticsTracking: true,
    personalizedContent: true,
  });

  const toggle = (key: string) => {
    setSettings((p) => ({ ...p, [key]: !p[key as keyof typeof p] }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <Text style={styles.headerSub}>Manage your data and security</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Privacy */}
        <Text style={styles.sectionLabel}>Privacy</Text>
        <View style={styles.card}>
          {PRIVACY_ITEMS.map((item, idx) => (
            <View
              key={item.key}
              style={[
                styles.row,
                idx < PRIVACY_ITEMS.length - 1 && styles.rowBorder,
              ]}
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
                <Text style={styles.rowDesc}>{item.desc}</Text>
              </View>
              <Switch
                value={settings[item.key as keyof typeof settings]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: Colors.border, true: item.color + "60" }}
                thumbColor={
                  settings[item.key as keyof typeof settings]
                    ? item.color
                    : "#ccc"
                }
              />
            </View>
          ))}
        </View>

        {/* Security */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
          Security
        </Text>
        <View style={styles.card}>
          {SECURITY_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.row,
                idx < SECURITY_ITEMS.length - 1 && styles.rowBorder,
              ]}
              onPress={
                item.label === "Delete Account"
                  ? handleDeleteAccount
                  : undefined
              }
              activeOpacity={0.7}
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
                <Text
                  style={[
                    styles.rowLabel,
                    item.label === "Delete Account" && { color: "#D32F2F" },
                  ]}
                >
                  {item.label}
                </Text>
                <Text style={styles.rowDesc}>{item.desc}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Data & legal */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
          Legal
        </Text>
        <View style={styles.card}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
            (label, idx) => (
              <TouchableOpacity
                key={label}
                style={[styles.row, idx < 2 && styles.rowBorder]}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrap, { backgroundColor: "#F0EAE2" }]}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <Text style={[styles.rowLabel, { flex: 1 }]}>{label}</Text>
                <Ionicons
                  name="open-outline"
                  size={16}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            ),
          )}
        </View>

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
});
