import { useState } from "react";
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

interface Language {
  id: string;
  name: string;
}

export default function OnboardingScreen3() {
  const { setLanguage, completeOnboarding } = usePreferences();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );

  const languages: Language[] = [
    { id: "1", name: "English" },
    { id: "2", name: "नेपाली" },
    { id: "3", name: "हिन्दी" },
    { id: "4", name: "中文" },
    { id: "5", name: "日本語" },
    { id: "6", name: "Deutsch" },
  ];

  const selectLanguage = (language: Language) => {
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
              await completeOnboarding();
              router.replace("/(dashboard)/explore");
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
