import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OutputTextSkeleton } from "../../components/skeletons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";

type LanguageCode =
  | "en"
  | "ne"
  | "hi"
  | "zh"
  | "ja"
  | "ko"
  | "fr"
  | "de"
  | "es"
  | "ar";

type LanguageOption = {
  code: LanguageCode;
  name: string;
  flag: string;
};

type Phrase = Record<LanguageCode, string>;

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
];

const COMMON_PHRASES = [
  {
    en: "Hello",
    ne: "नमस्ते",
    hi: "नमस्ते",
    zh: "你好",
    ja: "こんにちは",
    ko: "안녕하세요",
    fr: "Bonjour",
    de: "Hallo",
    es: "Hola",
    ar: "مرحبا",
  },
  {
    en: "Thank you",
    ne: "धन्यवाद",
    hi: "धन्यवाद",
    zh: "谢谢",
    ja: "ありがとう",
    ko: "감사합니다",
    fr: "Merci",
    de: "Danke",
    es: "Gracias",
    ar: "شكرا",
  },
  {
    en: "How much is it?",
    ne: "यो कति हो?",
    hi: "यह कितना है?",
    zh: "多少钱？",
    ja: "いくらですか？",
    ko: "얼마예요?",
    fr: "Combien ça coûte?",
    de: "Wie viel kostet das?",
    es: "¿Cuánto cuesta?",
    ar: "كم يكلف؟",
  },
  {
    en: "Where is...?",
    ne: "... कहाँ छ?",
    hi: "... कहाँ है?",
    zh: "...在哪里？",
    ja: "...はどこですか？",
    ko: "...어디에 있어요?",
    fr: "Où est...?",
    de: "Wo ist...?",
    es: "¿Dónde está...?",
    ar: "أين ...؟",
  },
  {
    en: "How are you?",
    ne: "तपाईंलाई कस्तो छ?",
    hi: "आप कैसे हैं?",
    zh: "你好吗？",
    ja: "お元気ですか？",
    ko: "잘 지내세요?",
    fr: "Comment allez-vous?",
    de: "Wie geht es Ihnen?",
    es: "¿Cómo está usted?",
    ar: "كيف حالك؟",
  },
  {
    en: "Please help me",
    ne: "कृपया मलाई मद्दत गर्नुहोस्",
    hi: "कृपया मेरी मदद करें",
    zh: "请帮帮我",
    ja: "助けてください",
    ko: "도와주세요",
    fr: "Aidez-moi s'il vous plaît",
    de: "Bitte helfen Sie mir",
    es: "Por favor ayúdame",
    ar: "من فضلك ساعدني",
  },
  {
    en: "I don't understand",
    ne: "मलाई बुझ्दैन",
    hi: "मुझे समझ नहीं आया",
    zh: "我不明白",
    ja: "わかりません",
    ko: "이해하지 못해요",
    fr: "Je ne comprends pas",
    de: "Ich verstehe nicht",
    es: "No entiendo",
    ar: "لا أفهم",
  },
  {
    en: "Good morning",
    ne: "शुभप्रभात",
    hi: "सुप्रभात",
    zh: "早上好",
    ja: "おはようございます",
    ko: "좋은 아침이에요",
    fr: "Bonjour",
    de: "Guten Morgen",
    es: "Buenos días",
    ar: "صباح الخير",
  },
];

export default function TranslateScreen() {
  const router = useRouter();
  const [fromLang, setFromLang] = useState<LanguageCode>("en");
  const [toLang, setToLang] = useState<LanguageCode>("ne");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [activePhrase, setActivePhrase] = useState<number | null>(null);

  const fromLangObj = LANGUAGES.find((l) => l.code === fromLang)!;
  const toLangObj = LANGUAGES.find((l) => l.code === toLang)!;

  const swapLanguages = () => {
    const tmp = fromLang;
    setFromLang(toLang);
    setToLang(tmp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setTranslatedText("");
    try {
      // Use MyMemory free translation API (no key needed)
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.responseStatus === 200) {
        setTranslatedText(json.responseData.translatedText);
      } else {
        Alert.alert(
          "Translation failed",
          "Could not translate. Please try again.",
        );
      }
    } catch {
      Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhrasePress = (phrase: Record<string, string>, idx: number) => {
    setActivePhrase(idx === activePhrase ? null : idx);
    setInputText(phrase[fromLang] || phrase.en);
    setTranslatedText(phrase[toLang] || "");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Translate</Text>
            <Text style={styles.headerSub}>Speak like a local</Text>
          </View>
        </View>

        {/* Language selector */}
        <View style={styles.langSelector}>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => {
              setShowFromPicker(!showFromPicker);
              setShowToPicker(false);
            }}
          >
            <Text style={styles.langFlag}>{fromLangObj.flag}</Text>
            <Text style={styles.langName}>{fromLangObj.name}</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapBtn} onPress={swapLanguages}>
            <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => {
              setShowToPicker(!showToPicker);
              setShowFromPicker(false);
            }}
          >
            <Text style={styles.langFlag}>{toLangObj.flag}</Text>
            <Text style={styles.langName}>{toLangObj.name}</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* From picker */}
        {showFromPicker && (
          <View style={styles.picker}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[
                  styles.pickerItem,
                  fromLang === l.code && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setFromLang(l.code);
                  setShowFromPicker(false);
                }}
              >
                <Text style={styles.pickerFlag}>{l.flag}</Text>
                <Text
                  style={[
                    styles.pickerName,
                    fromLang === l.code && styles.pickerNameActive,
                  ]}
                >
                  {l.name}
                </Text>
                {fromLang === l.code && (
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* To picker */}
        {showToPicker && (
          <View style={styles.picker}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[
                  styles.pickerItem,
                  toLang === l.code && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setToLang(l.code);
                  setShowToPicker(false);
                }}
              >
                <Text style={styles.pickerFlag}>{l.flag}</Text>
                <Text
                  style={[
                    styles.pickerName,
                    toLang === l.code && styles.pickerNameActive,
                  ]}
                >
                  {l.name}
                </Text>
                {toLang === l.code && (
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLangLabel}>
              {fromLangObj.flag} {fromLangObj.name}
            </Text>
            {inputText.length > 0 && (
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
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder={`Type in ${fromLangObj.name}...`}
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={(t) => {
              setInputText(t);
              if (!t) setTranslatedText("");
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              styles.translateBtn,
              !inputText.trim() && styles.translateBtnDisabled,
            ]}
            onPress={handleTranslate}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Ionicons name="language" size={16} color={Colors.white} />
                <Text style={styles.translateBtnText}>Translate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Output */}
        {(translatedText || loading) && (
          <View style={styles.outputCard}>
            <Text style={styles.inputLangLabel}>
              {toLangObj.flag} {toLangObj.name}
            </Text>
            {loading ? (
              <View style={{ marginTop: Spacing.md }}>
                <OutputTextSkeleton />
              </View>
            ) : (
              <>
                <Text style={styles.outputText}>{translatedText}</Text>
                <TouchableOpacity style={styles.copyBtn}>
                  <Ionicons
                    name="copy-outline"
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={styles.copyBtnText}>Copy</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Common phrases */}
        <View style={styles.phrasesSection}>
          <Text style={styles.phrasesTitle}>Common Phrases</Text>
          {COMMON_PHRASES.map((phrase, idx) => {
            const isActive = activePhrase === idx;
            const translation = phrase[toLang] || phrase.ne;
            const sourceText = phrase[fromLang] || phrase.en;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.phraseCard, isActive && styles.phraseCardActive]}
                onPress={() => handlePhrasePress(phrase, idx)}
                activeOpacity={0.8}
              >
                <View style={styles.phraseRow}>
                  <Text style={styles.phraseSource}>{sourceText}</Text>
                  <Ionicons
                    name={isActive ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={Colors.textMuted}
                  />
                </View>
                {isActive && (
                  <View style={styles.phraseTranslation}>
                    <View style={styles.phraseDivider} />
                    <Text style={styles.phraseTranslationText}>
                      {translation}
                    </Text>
                    <View style={styles.phraseActions}>
                      <Text style={styles.phraseActionLabel}>
                        {toLangObj.flag} {toLangObj.name}
                      </Text>
                      <TouchableOpacity style={styles.useBtn}>
                        <Text style={styles.useBtnText}>Use this</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
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
  headerTitle: { fontSize: 22, color: Colors.white, fontFamily: "CrimsonBold" },
  headerSub: { fontSize: 12, color: "#E2DBDB" },
  langSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    ...Shadow.sm,
  },
  langBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  langFlag: { fontSize: 18 },
  langName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  pickerItemActive: { backgroundColor: "#EEF2FF" },
  pickerFlag: { fontSize: 18 },
  pickerName: { flex: 1, fontSize: 14, color: Colors.text },
  pickerNameActive: { color: Colors.primary, fontWeight: "700" },
  inputCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  inputLangLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  input: {
    fontSize: 16,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  translateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  translateBtnDisabled: { opacity: 0.5 },
  translateBtnText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
  outputCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: "#EEF2FF",
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    marginBottom: Spacing.lg,
  },
  outputText: {
    fontSize: 18,
    color: Colors.text,
    marginTop: Spacing.sm,
    lineHeight: 28,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-end",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  copyBtnText: { fontSize: 12, color: Colors.primary, fontWeight: "600" },
  phrasesSection: { marginHorizontal: Spacing.lg },
  phrasesTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.md,
    fontFamily: "CrimsonBold",
  },
  phraseCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  phraseCardActive: { borderColor: Colors.primary, backgroundColor: "#FAFBFF" },
  phraseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phraseSource: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  phraseTranslation: { marginTop: Spacing.sm },
  phraseDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  phraseTranslationText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
    lineHeight: 24,
  },
  phraseActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  phraseActionLabel: { fontSize: 11, color: Colors.textMuted },
  useBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  useBtnText: { fontSize: 12, color: Colors.white, fontWeight: "600" },
});
