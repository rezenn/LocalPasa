import { useState } from "react";
import { Image, Text, View, TouchableOpacity, FlatList } from "react-native";
import Colors from "@/constants/colors";
import { router } from "expo-router";
import { SimpleGradientButton } from "@/components/ui/GradientButton";

interface Location {
  id: string;
  title: string;
  image: any;
}

export default function OnboardingScreen2() {
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

  const locations: Location[] = [
    {
      id: "1",
      title: "Kathmandu Valley",
      image: require("@/assets/images/ktm.png"),
    },
    {
      id: "2",
      title: "Pokhara",
      image: require("@/assets/images/pkh.png"),
    },
    {
      id: "3",
      title: "Chitwan",
      image: require("@/assets/images/cht.png"),
    },
    {
      id: "4",
      title: "Mustang",
      image: require("@/assets/images/mtg.png"),
    },
    {
      id: "5",
      title: "Lumbini",
      image: require("@/assets/images/lbn.png"),
    },
    {
      id: "6",
      title: "Other Places",
      image: require("@/assets/images/oth.png"),
    },
  ];

  const toggleLocation = (location: Location) => {
    if (selectedLocations.find((item) => item.id === location.id)) {
      setSelectedLocations(
        selectedLocations.filter((item) => item.id !== location.id),
      );
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const isSelected = (id: string) => {
    return selectedLocations.some((item) => item.id === id);
  };

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
                step <= 2 ? Colors.button.primary : Colors.lineDivider,
            }}
          />
        ))}
      </View>

      <Text className="font-bold text-4xl px-1 mt-4">
        What is your {"\n"}Preferred Location?
      </Text>
      <Text className="my-2 px-1 text-gray-600">
        Select all the place you want to visit{" "}
      </Text>

      <FlatList
        data={locations}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
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
              onPress={() => toggleLocation(item)}
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
          onPress={() => {
            const selectedTitles = selectedLocations.map((i) => i.title);
            console.log("Selected:", selectedTitles);
            router.push({
              pathname: "/(onboarding)/OnboardingScreen3",
              params: { locations: JSON.stringify(selectedTitles) },
            });
          }}
        />
      </View>
    </View>
  );
}
