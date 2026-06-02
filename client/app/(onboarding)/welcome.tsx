import { Image, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";

export default function Welcome() {
  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: Colors.background }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        className="mt-28 h-40 w-80"
        resizeMode="contain"
      />
      <Text
        className="uppercase font-extrabold tracking-wide -mt-5 mb-16"
        style={{
          textAlign: "center",
          color: Colors.text.primary,
          fontSize: 14,
        }}
      >
        Discover Nepal's Living Culture
      </Text>
      <Image
        source={require("@/assets/images/skyline.png")}
        className=" mt-12 h-48 w-screen"
        resizeMode="contain"
      />
      <TouchableOpacity
        className="rounded-lg w-full py-4 items-center justify-center mt-1"
        style={{ backgroundColor: Colors.button.primary }}
        onPress={() => router.push("/(onboarding)/OnboardingScreen1")}
      >
        <Text className="text-white items-center font-extrabold">
          Get Started
        </Text>
      </TouchableOpacity>
      <Text className="mt-5">I will explore on my own →</Text>
    </View>
  );
}
