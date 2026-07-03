import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { api } from "../../api/client";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ne", label: "Nepali", flag: "🇳🇵" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
];

const COMMON_PHRASES = [
  { english: "Hello", nepali: "नमस्ते (Namaste)" },
  { english: "Thank you", nepali: "धन्यवाद (Dhanyabad)" },
  { english: "How much is it?", nepali: "यो कति पर्छ? (Yo kati parcha?)" },
  {
    english: "How are you?",
    nepali: "तपाईंलाई कस्तो छ? (Tapailai kasto cha?)",
  },
  { english: "Thank you very much", nepali: "धेरै धन्यवाद (Dherai dhanyabad)" },
  {
    english: "Can you help me?",
    nepali:
      "के तपाईं मलाई मद्दत गर्न सक्नुहुन्छ? (Ke tapain malai maddat garna saknu huncha?)",
  },
  {
    english: "How do I get there?",
    nepali: "म त्यहाँ कसरी पुग्न सक्छु? (Ma tyaha kasari pugna sakchu?)",
  },
  {
    english: "Where is the temple?",
    nepali: "मन्दिर कहाँ छ? (Mandir kaha cha?)",
  },
  {
    english: "What is your name?",
    nepali: "तपाईंको नाम के हो? (Tapainko naam ke ho?)",
  },
  { english: "I don't understand", nepali: "मलाई बुझेन (Malai bujhena)" },
  { english: "Excuse me", nepali: "माफ गर्नुस् (Maaf garnus)" },
  { english: "Please", nepali: "कृपया (Kripaya)" },
];

export default function TranslateScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState(LANGUAGES[0]);
  const [targetLang, setTargetLang] = useState(LANGUAGES[1]);
  const [loading, setLoading] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [activePhrase, setActivePhrase] = useState<number | null>(null);

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const translate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setTranslatedText("");
    try {
      const data = await api.post<{ translated: string }>("/translate", {
        q: inputText,
        source: sourceLang.code,
        target: targetLang.code,
      });
      setTranslatedText(data.translated);
    } catch (err) {
      Alert.alert(
        "Translation failed",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const translatePhrase = async (phrase: string, idx: number) => {
    setActivePhrase(idx);
    setInputText(phrase);
    setLoading(true);
    try {
      const data = await api.post<{ translated: string }>("/translate", {
        q: phrase,
        source: "en",
        target: targetLang.code,
      });
      setTranslatedText(data.translated);
    } catch {
      Alert.alert("Translation failed", "Could not translate the phrase.");
    } finally {
      setLoading(false);
    }
  };

  const LanguagePicker = ({ visible, onSelect, selected, onClose }: any) => {
    if (!visible) return null;
    return (
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerCard}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.text} />
            </TouchableOpacity>
          </View>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.pickerItem,
                selected.code === lang.code && styles.pickerItemActive,
              ]}
              onPress={() => {
                onSelect(lang);
                onClose();
              }}
            >
              <Text style={styles.pickerFlag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.pickerLangText,
                  selected.code === lang.code && styles.pickerLangTextActive,
                ]}
              >
                {lang.label}
              </Text>
              {selected.code === lang.code && (
                <Ionicons name="checkmark" size={16} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Language pickers */}
      <LanguagePicker
        visible={showSourcePicker}
        selected={sourceLang}
        onSelect={setSourceLang}
        onClose={() => setShowSourcePicker(false)}
      />
      <LanguagePicker
        visible={showTargetPicker}
        selected={targetLang}
        onSelect={setTargetLang}
        onClose={() => setShowTargetPicker(false)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Translate</Text>
        </View>

        {/* Language selector */}
        <View style={styles.langSelector}>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setShowSourcePicker(true)}
          >
            <Text style={styles.langFlag}>{sourceLang.flag}</Text>
            <Text style={styles.langName}>{sourceLang.label}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.swapBtn} onPress={swapLanguages}>
            <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setShowTargetPicker(true)}
          >
            <Text style={styles.langFlag}>{targetLang.flag}</Text>
            <Text style={styles.langName}>{targetLang.label}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Input box */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLangLabel}>{sourceLang.label}</Text>
            <TouchableOpacity
              onPress={() => {
                setInputText("");
                setTranslatedText("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={`Type in ${sourceLang.label}...`}
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              styles.translateBtn,
              !inputText.trim() && styles.translateBtnDisabled,
            ]}
            onPress={translate}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Ionicons name="language" size={16} color={Colors.white} />
                <Text style={styles.translateBtnText}>Translate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Output box */}
        {translatedText !== "" && (
          <View style={[styles.inputCard, styles.outputCard]}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLangLabel}>{targetLang.label}</Text>
              <TouchableOpacity>
                <Ionicons
                  name="volume-high-outline"
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.outputText}>{translatedText}</Text>
          </View>
        )}

        {/* Common phrases */}
        <View style={styles.phrasesSection}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="chatbubbles-outline"
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.sectionTitle}>Common Phrases</Text>
          </View>
          <Text style={styles.sectionSub}>
            Tap a phrase to translate it to {targetLang.label}
          </Text>

          {COMMON_PHRASES.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.phraseCard,
                activePhrase === idx && styles.phraseCardActive,
              ]}
              onPress={() => translatePhrase(p.english, idx)}
              activeOpacity={0.8}
            >
              <View style={styles.phraseRow}>
                <Text style={styles.phraseEnglish}>{p.english}</Text>
                <Ionicons name="language" size={14} color={Colors.primary} />
              </View>
              {targetLang.code === "ne" && (
                <Text style={styles.phraseNepali}>{p.nepali}</Text>
              )}
              {activePhrase === idx && translatedText && (
                <Text style={styles.phraseTranslated}>{translatedText}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontFamily: "CrimsonBold", color: Colors.white },
  langSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  langFlag: { fontSize: 20 },
  langName: { fontSize: 13, fontWeight: "600", color: Colors.text },
  swapBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  inputCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  outputCard: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  inputLangLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
  },
  textInput: {
    fontSize: 16,
    color: Colors.text,
    minHeight: 80,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  translateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 10,
  },
  translateBtnDisabled: { opacity: 0.5 },
  translateBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  outputText: { fontSize: 16, color: Colors.text, lineHeight: 26 },
  phrasesSection: { paddingHorizontal: Spacing.lg },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 16, fontFamily: "CrimsonBold", color: Colors.text },
  sectionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  phraseCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  phraseCardActive: { borderLeftColor: Colors.primary },
  phraseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phraseEnglish: { fontSize: 14, fontWeight: "600", color: Colors.text },
  phraseNepali: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  phraseTranslated: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  pickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  pickerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadow.md,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemActive: { backgroundColor: Colors.primary + "08" },
  pickerFlag: { fontSize: 22 },
  pickerLangText: { flex: 1, fontSize: 14, color: Colors.text },
  pickerLangTextActive: { color: Colors.primary, fontWeight: "700" },
});
