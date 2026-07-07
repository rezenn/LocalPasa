import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { usePreferences } from "../../context/PreferencesContext";
import Toast from "react-native-toast-message";

const NOTIF_GROUPS = [
  {
    title: "Events & Activities",
    items: [
      {
        key: "events",
        label: "Upcoming Events",
        desc: "Festivals and cultural events near you",
        icon: "calendar-outline" as const,
      },
      {
        key: "newSites",
        label: "New Sites",
        desc: "Newly added heritage sites",
        icon: "location-outline" as const,
      },
      {
        key: "artisans",
        label: "Artisan Updates",
        desc: "New products and workshops",
        icon: "brush-outline" as const,
      },
    ],
  },
  {
    title: "App & Account",
    items: [
      {
        key: "reminders",
        label: "Saved Reminders",
        desc: "Reminders for your saved places",
        icon: "bookmark-outline" as const,
      },
      {
        key: "tips",
        label: "Travel Tips",
        desc: "Local tips and travel advice",
        icon: "bulb-outline" as const,
      },
    ],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { prefs, toggleNotifications } = usePreferences();
  const [settings, setSettings] = React.useState({
    events: true,
    newSites: true,
    artisans: false,
    reminders: true,
    tips: false,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleMasterToggle = async () => {
    await toggleNotifications();
    Toast.show({
      type: "success",
      text1: prefs.notificationsEnabled
        ? "Notifications disabled"
        : "Notifications enabled",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>
            Manage your notification preferences
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Master toggle */}
        <View style={styles.masterCard}>
          <View style={styles.masterLeft}>
            <View
              style={[
                styles.masterIcon,
                {
                  backgroundColor: prefs.notificationsEnabled
                    ? "#EEF2FF"
                    : "#F5F5F5",
                },
              ]}
            >
              <Ionicons
                name={
                  prefs.notificationsEnabled
                    ? "notifications"
                    : "notifications-off"
                }
                size={24}
                color={
                  prefs.notificationsEnabled ? Colors.primary : Colors.textMuted
                }
              />
            </View>
            <View>
              <Text style={styles.masterLabel}>All Notifications</Text>
              <Text style={styles.masterSub}>
                {prefs.notificationsEnabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={prefs.notificationsEnabled}
            onValueChange={handleMasterToggle}
            trackColor={{ false: Colors.border, true: Colors.primary + "60" }}
            thumbColor={prefs.notificationsEnabled ? Colors.primary : "#ccc"}
          />
        </View>

        {/* Groups */}
        {NOTIF_GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, idx) => (
                <View
                  key={item.key}
                  style={[
                    styles.notifRow,
                    idx < group.items.length - 1 && styles.notifRowBorder,
                  ]}
                >
                  <View style={styles.notifIcon}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={Colors.primary}
                    />
                  </View>
                  <View style={styles.notifText}>
                    <Text
                      style={[
                        styles.notifLabel,
                        !prefs.notificationsEnabled && styles.disabled,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.notifDesc}>{item.desc}</Text>
                  </View>
                  <Switch
                    value={
                      settings[item.key as keyof typeof settings] &&
                      prefs.notificationsEnabled
                    }
                    onValueChange={() => {
                      if (prefs.notificationsEnabled) toggleSetting(item.key);
                    }}
                    disabled={!prefs.notificationsEnabled}
                    trackColor={{
                      false: Colors.border,
                      true: Colors.primary + "60",
                    }}
                    thumbColor={
                      settings[item.key as keyof typeof settings] &&
                      prefs.notificationsEnabled
                        ? Colors.primary
                        : "#ccc"
                    }
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
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
  masterCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
  },
  masterLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  masterIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  masterLabel: { fontSize: 16, fontWeight: "700", color: Colors.text },
  masterSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  group: { marginBottom: Spacing.lg },
  groupTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  groupCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadow.sm,
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  notifRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  notifText: { flex: 1 },
  notifLabel: { fontSize: 14, fontWeight: "600", color: Colors.text },
  notifDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  disabled: { color: Colors.textMuted },
});
