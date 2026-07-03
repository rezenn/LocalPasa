import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { usePreferences } from "../../context/PreferencesContext";
import Toast from "react-native-toast-message";

const INTERESTS = [
  {
    id: "Temples & Heritages",
    label: "Temples & Heritages",
    emoji: "🏛️",
    desc: "Ancient temples and heritage sites",
  },
  {
    id: "Local Food",
    label: "Local Food",
    emoji: "🍜",
    desc: "Traditional cuisine and street food",
  },
  {
    id: "Handicrafts",
    label: "Handicrafts",
    emoji: "🎨",
    desc: "Traditional crafts and artisanship",
  },
  {
    id: "Festivals",
    label: "Festivals",
    emoji: "🎉",
    desc: "Cultural celebrations and events",
  },
  {
    id: "History",
    label: "History",
    emoji: "📜",
    desc: "Historical sites and stories",
  },
  {
    id: "Arts & Crafts",
    label: "Arts & Crafts",
    emoji: "🖼️",
    desc: "Art galleries and craft studios",
  },
  {
    id: "Trekking",
    label: "Trekking",
    emoji: "🥾",
    desc: "Hiking and mountain treks",
  },
  {
    id: "Wildlife",
    label: "Wildlife",
    emoji: "🐘",
    desc: "National parks and wildlife",
  },
  {
    id: "Photography",
    label: "Photography",
    emoji: "📷",
    desc: "Scenic spots and photo walks",
  },
  {
    id: "Meditation",
    label: "Meditation & Yoga",
    emoji: "🧘",
    desc: "Spiritual retreats and wellness",
  },
];

export default function InterestsScreen() {
  const router = useRouter();
  const { prefs, setInterests } = usePreferences();
  const [selected, setSelected] = useState<string[]>(prefs.interests);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setInterests(selected);
      Toast.show({
        type: "success",
        text1: "Interests saved",
        text2: `${selected.length} interest${selected.length !== 1 ? "s" : ""} selected`,
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
          <Text style={styles.headerTitle}>My Interests</Text>
          <Text style={styles.headerSub}>
            {selected.length > 0
              ? `${selected.length} selected`
              : "Select what you love"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        <Text style={styles.hint}>
          We'll personalise your explore feed based on your interests.
        </Text>

        {INTERESTS.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <View style={styles.cardText}>
                  <Text
                    style={[
                      styles.cardLabel,
                      isSelected && styles.cardLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
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
              Save Interests {selected.length > 0 ? `(${selected.length})` : ""}
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
  grid: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
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
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: "#FDFBF8" },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
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
