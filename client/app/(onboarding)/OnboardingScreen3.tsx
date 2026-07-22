import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import Colors from "@/constants/colors";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { SimpleGradientButton } from "@/components/ui/GradientButton";
import { usePreferences } from "@/context/PreferencesContext";

const LANGUAGE_MAP: Record<string, string> = {
  English: "en",
  नेपाली: "ne",
  हिन्दी: "hi",
  中文: "zh",
  日本語: "ja",
  Deutsch: "de",
};

// Reverse lookup + a couple of common regional variants, so a device
// locale like "ne-NP" or "hi-IN" still resolves correctly.
const CODE_TO_LANGUAGE_ID: Record<string, string> = {
  en: "1",
  ne: "2",
  hi: "3",
  zh: "4",
  ja: "5",
  de: "6",
};

interface Language {
  id: string;
  name: string;
}

export default function OnboardingScreen3() {
  const { setLanguage } = usePreferences();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );
  const [autoDetected, setAutoDetected] = useState(false);

  const languages: Language[] = [
    { id: "1", name: "English" },
    { id: "2", name: "नेपाली" },
    { id: "3", name: "हिन्दी" },
    { id: "4", name: "中文" },
    { id: "5", name: "日本語" },
    { id: "6", name: "Deutsch" },
  ];

  // Auto-detect from device locale on first launch (US-003). Reads
  // expo-localization defensively so this screen still works if the
  // package hasn't been installed yet — it just skips pre-selection.
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Localization = require("expo-localization");
      const locales = Localization.getLocales?.() ?? [];
      const deviceCode = locales[0]?.languageCode as string | undefined;
      const matchId = deviceCode ? CODE_TO_LANGUAGE_ID[deviceCode] : null;
      if (matchId) {
        const match = languages.find((l) => l.id === matchId);
        if (match) {
          setSelectedLanguage(match);
          setAutoDetected(true);
        }
      }
    } catch {
      // expo-localization not installed — no auto-selection, person just
      // picks manually below. Run `npx expo install expo-localization`.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectLanguage = (language: Language) => {
    setAutoDetected(false);
    setSelectedLanguage(selectedLanguage?.id === language.id ? null : language);
  };

  const isSelected = (id: string) => selectedLanguage?.id === id;

  return (
    <View
      className="flex-1 px-4"
      style={{ backgroundColor: Colors.Onboardingbackground }}
    >
      <View className="flex-row w-full gap-2 mt-12 mb-6">
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            className="flex-1 h-2 rounded-full"
            style={{
              backgroundColor:
                step <= 3 ? Colors.button.primary : Colors.lineDivider,
            }}
          />
        ))}
      </View>

      <Text className="font-bold text-4xl px-1 mt-4 mb-2">
        What is your {"\n"}Preferred Language?
      </Text>
      <Text className="my-2 px-1 text-gray-600">
        Select your preferred language
      </Text>
      {autoDetected && (
        <Text className="px-1 mb-1" style={{ color: Colors.button.primary, fontSize: 12, fontWeight: "600" }}>
          Detected from your device — tap another to change it
        </Text>
      )}

      <FlatList
        data={languages}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const selected = isSelected(item.id);
          return (
            <TouchableOpacity
              className="rounded-lg w-[47%] h-[65px] items-center justify-center m-[1.5%]"
              style={{
                backgroundColor: selected ? "#F5E6D3" : "#FFFFFF",
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? "#6B4F3A" : "#E0E0E0",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => selectLanguage(item)}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: selected ? "900" : "800",
                  marginTop: 2,
                  textAlign: "center",
                  color: selected ? "#6B4F3A" : "#333333",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View className="px-1 mb-6 mt-4">
        <SimpleGradientButton
          title="Get Started"
          onPress={async () => {
            if (selectedLanguage) {
              const code = LANGUAGE_MAP[selectedLanguage.name] ?? "en";
              await setLanguage(selectedLanguage.name, code);
              router.replace("/(onboarding)/NotificationOptIn");
            } else {
              Toast.show({
                type: "info",
                text1: "Info",
                text2: "Please select a language.",
              });
            }
          }}
        />
      </View>
    </View>
  );
}
