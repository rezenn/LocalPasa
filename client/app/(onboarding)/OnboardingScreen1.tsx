import { useState } from "react";
import { Image, Text, View, TouchableOpacity, FlatList } from "react-native";
import Colors from "@/constants/colors";
import { router } from "expo-router";
import { SimpleGradientButton } from "@/components/ui/GradientButton";
import { usePreferences } from "@/context/PreferencesContext";

interface Interest {
  id: string;
  title: string;
  image: any;
}

export default function OnboardingScreen1() {
  const { setInterests } = usePreferences();
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const interests: Interest[] = [
    {
      id: "1",
      title: "Temples & Heritages",
      image: require("@/assets/images/temples.png"),
    },
    {
      id: "2",
      title: "Local Food",
      image: require("@/assets/images/foods.png"),
    },
    {
      id: "3",
      title: "Handicrafts",
      image: require("@/assets/images/handicrafts.png"),
    },
    {
      id: "4",
      title: "Festivals",
      image: require("@/assets/images/festivals.png"),
    },
    {
      id: "5",
      title: "History",
      image: require("@/assets/images/history.png"),
    },
    {
      id: "6",
      title: "Arts & Crafts",
      image: require("@/assets/images/arts.png"),
    },
  ];

  const toggleInterest = (interest: Interest) => {
    if (selectedInterests.find((item) => item.id === interest.id)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item.id !== interest.id),
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const isSelected = (id: string) =>
    selectedInterests.some((item) => item.id === id);

  return (
    <View
      className="flex-1 px-4"
      style={{ backgroundColor: Colors.Onboardingbackground }}
    >
      <View className="flex-row w-full gap-2 mt-12 mb-4">
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            className="flex-1 h-2 rounded-full"
            style={{
              backgroundColor:
                step <= 1 ? Colors.button.primary : Colors.lineDivider,
            }}
          />
        ))}
      </View>

      <Text className="font-bold text-4xl px-1 mt-4">
        What are you {"\n"}Interested in?
      </Text>
      <Text className="my-2 px-1 text-gray-600">
        Select all that apply to your preferences
      </Text>

      <FlatList
        data={interests}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 15 }}
        renderItem={({ item }) => {
          const selected = isSelected(item.id);
          return (
            <TouchableOpacity
              className="rounded-lg w-[47%] aspect-square items-center justify-center m-[1.5%]"
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
              onPress={() => toggleInterest(item)}
            >
              <Image
                source={item.image}
                style={{ width: "85%", height: "75%", borderRadius: 12 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: selected ? "900" : "800",
                  marginTop: 2,
                  textAlign: "center",
                  color: selected ? "#6B4F3A" : "#333333",
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View className="px-1 mb-6 mt-4">
        <SimpleGradientButton
          title="Next"
          onPress={async () => {
            const selectedTitles = selectedInterests.map((i) => i.title);
            // Persist to context
            await setInterests(selectedTitles);
            router.push({
              pathname: "/(onboarding)/OnboardingScreen2",
              params: { interests: JSON.stringify(selectedTitles) },
            });
          }}
        />
      </View>
    </View>
  );
}
