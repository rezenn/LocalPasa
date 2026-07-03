import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";

const KEYS = {
  notifications: "settings_notifications",
  darkMode: "settings_darkmode",
};

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const n = await AsyncStorage.getItem(KEYS.notifications);
        const d = await AsyncStorage.getItem(KEYS.darkMode);
        if (n != null) setNotifications(n === "1");
        if (d != null) setDarkMode(d === "1");
      } catch {}
    })();
  }, []);

  const toggle = async (
    key: string,
    setter: (v: boolean) => void,
    val: boolean,
  ) => {
    setter(val);
    try {
      await AsyncStorage.setItem(key, val ? "1" : "0");
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Notifications</Text>
            <Text style={styles.sub}>Receive push notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={(v) =>
              toggle(KEYS.notifications, setNotifications, v)
            }
          />
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Dark Mode</Text>
            <Text style={styles.sub}>Use dark theme in the app</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={(v) => toggle(KEYS.darkMode, setDarkMode, v)}
          />
        </View>

        <TouchableOpacity
          style={[styles.row, styles.linkRow]}
          onPress={() =>
            Alert.alert(
              "Privacy",
              "Privacy settings can be managed on the server.",
            )
          }
        >
          <Text style={styles.label}>Privacy & Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, styles.linkRow]}
          onPress={() => router.push("/screens/edit-profile" as any)}
        >
          <Text style={styles.label}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 20, fontWeight: "700", color: Colors.text },
  card: {
    margin: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  label: { fontSize: 15, color: Colors.text, fontWeight: "600" },
  sub: { fontSize: 12, color: Colors.textMuted },
  linkRow: { borderTopWidth: 1, borderTopColor: Colors.border },
});
