import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { usePreferences } from "../../context/PreferencesContext";
import Toast from "react-native-toast-message";

export const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "ne", name: "Nepali", native: "नेपाली", flag: "🇳🇵" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { prefs, setLanguage } = usePreferences();
  const [selected, setSelected] = useState(prefs.languageCode);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const lang = LANGUAGES.find((l) => l.code === selected);
    if (!lang) return;
    setSaving(true);
    try {
      await setLanguage(lang.name, lang.code);
      Toast.show({
        type: "success",
        text1: "Language updated",
        text2: `App language set to ${lang.name}`,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Language</Text>
          <Text style={styles.headerSub}>Choose your preferred language</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <Text style={styles.hint}>
          This will change the display language for content across the app,
          including translations and common phrases.
        </Text>

        {LANGUAGES.map((lang) => {
          const isSelected = selected === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => setSelected(lang.code)}
              activeOpacity={0.75}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.itemText}>
                <Text
                  style={[
                    styles.langName,
                    isSelected && styles.langNameSelected,
                  ]}
                >
                  {lang.name}
                </Text>
                <Text style={styles.langNative}>{lang.native}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer save */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            selected === prefs.languageCode && styles.saveBtnDisabled,
          ]}
          onPress={handleSave}
          disabled={saving || selected === prefs.languageCode}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Language</Text>
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
  item: {
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
  itemSelected: { borderColor: Colors.primary, backgroundColor: "#FDFBF8" },
  flag: { fontSize: 28 },
  itemText: { flex: 1 },
  langName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  langNameSelected: { color: Colors.primary },
  langNative: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.primary,
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
