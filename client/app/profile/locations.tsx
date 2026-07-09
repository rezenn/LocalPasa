import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { usePreferences } from "../../context/PreferencesContext";
import Toast from "react-native-toast-message";

const LOCATIONS = [
  {
    id: "Kathmandu Valley",
    label: "Kathmandu Valley",
    emoji: "🏙️",
    desc: "UNESCO World Heritage sites, temples & durbar squares",
  },
  {
    id: "Pokhara",
    label: "Pokhara",
    emoji: "⛵",
    desc: "Lakeside city with mountain panoramas",
  },
  {
    id: "Chitwan",
    label: "Chitwan",
    emoji: "🐅",
    desc: "National Park, jungle safari & culture",
  },
  {
    id: "Mustang",
    label: "Mustang",
    emoji: "🏔️",
    desc: "Hidden Himalayan kingdom, caves & monasteries",
  },
  {
    id: "Lumbini",
    label: "Lumbini",
    emoji: "☸️",
    desc: "Birthplace of Buddha, sacred gardens",
  },
  {
    id: "Bhaktapur",
    label: "Bhaktapur",
    emoji: "🏺",
    desc: "Medieval city of devotees, pottery & art",
  },
  {
    id: "Patan",
    label: "Patan (Lalitpur)",
    emoji: "🕌",
    desc: "City of fine arts, courtyard temples",
  },
  {
    id: "Nagarkot",
    label: "Nagarkot",
    emoji: "🌄",
    desc: "Mountain viewpoint, sunrise & sunset",
  },
  {
    id: "Bandipur",
    label: "Bandipur",
    emoji: "🌿",
    desc: "Newari hilltop village, panoramic views",
  },
  {
    id: "Other Places",
    label: "Other Places",
    emoji: "🗺️",
    desc: "Explore beyond the usual destinations",
  },
];

export default function LocationsScreen() {
  const router = useRouter();
  const { prefs, setLocations } = usePreferences();
  const [selected, setSelected] = useState<string[]>(prefs.preferredLocations);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setLocations(selected);
      Toast.show({
        type: "success",
        text1: "Locations saved",
        text2: `${selected.length} location${selected.length !== 1 ? "s" : ""} selected`,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Preferred Locations</Text>
          <Text style={styles.headerSub}>
            {selected.length > 0
              ? `${selected.length} selected`
              : "Where do you want to explore?"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <Text style={styles.hint}>
          We'll show you sites, artisans and events near your preferred
          locations first.
        </Text>

        {LOCATIONS.map((loc) => {
          const isSelected = selected.includes(loc.id);
          return (
            <TouchableOpacity
              key={loc.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => toggle(loc.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{loc.emoji}</Text>
              <View style={styles.cardText}>
                <Text
                  style={[
                    styles.cardLabel,
                    isSelected && styles.cardLabelSelected,
                  ]}
                >
                  {loc.label}
                </Text>
                <Text style={styles.cardDesc}>{loc.desc}</Text>
              </View>
              <View style={[styles.check, isSelected && styles.checkSelected]}>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            selected.length === 0 && styles.saveBtnDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>
              Save Locations {selected.length > 0 ? `(${selected.length})` : ""}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
  list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    backgroundColor: "#EEF2FF",
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: "#FDFBF8" },
  emoji: { fontSize: 28 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 15, fontWeight: "700", color: Colors.text },
  cardLabelSelected: { color: Colors.primary },
  cardDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
});
