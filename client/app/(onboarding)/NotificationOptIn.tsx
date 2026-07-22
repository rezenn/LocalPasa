import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { SimpleGradientButton } from "@/components/ui/GradientButton";
import { usePreferences } from "@/context/PreferencesContext";
import { requestNotificationPermission } from "@/utils/notifications";

export default function NotificationOptIn() {
  const { toggleNotifications, prefs, completeOnboarding } = usePreferences();
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    await completeOnboarding();
    router.replace("/(dashboard)/explore");
  };

  const enable = async () => {
    setBusy(true);
    const granted = await requestNotificationPermission();
    if (granted && !prefs.notificationsEnabled) {
      await toggleNotifications();
    }
    setBusy(false);
    finish();
  };

  const skip = async () => {
    finish();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="notifications" size={40} color={Colors.button.primary} />
      </View>
      <Text style={styles.title}>Never miss a local moment</Text>
      <Text style={styles.subtitle}>
        Get notified about festivals and events happening near you, plus
        reminders for the places you've saved to visit.
      </Text>

      <View style={styles.benefitRow}>
        <Ionicons name="calendar-outline" size={18} color={Colors.button.primary} />
        <Text style={styles.benefitText}>Events happening close to you</Text>
      </View>
      <View style={styles.benefitRow}>
        <Ionicons name="bookmark-outline" size={18} color={Colors.button.primary} />
        <Text style={styles.benefitText}>Reminders for saved places</Text>
      </View>

      <View style={styles.actions}>
        <SimpleGradientButton
          title={busy ? "Enabling…" : "Enable notifications"}
          onPress={enable}
        />
        <TouchableOpacity onPress={skip} style={styles.skipBtn} disabled={busy}>
          <Text style={styles.skipText}>Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F5E6D3",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  benefitText: { fontSize: 14, color: "#333333", fontWeight: "500" },
  actions: { marginTop: "auto", marginBottom: 40, gap: 12 },
  skipBtn: { alignItems: "center", paddingVertical: 10 },
  skipText: { color: "#6B6B6B", fontWeight: "600", fontSize: 14 },
});
