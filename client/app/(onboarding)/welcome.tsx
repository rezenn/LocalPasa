import { Image, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { AppButton } from "@/components/ui";
import { SimpleGradientButton } from "@/components/ui/GradientButton";

export default function Welcome() {
  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: Colors.Onboardingbackground }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        className="mt-28 h-40 w-80"
        resizeMode="contain"
      />
      <Text
        className="uppercase font-gagalin tracking-wide -mt-10 mb-16"
        style={{
          textAlign: "center",
          color: Colors.text.primary,
          fontSize: 14,
        }}
      >
        {"Discover Nepal's Living Culture"}
      </Text>
      <Image
        source={require("@/assets/images/skyline.png")}
        className=" mt-12 h-52 w-screen"
        resizeMode="contain"
      />

      <SimpleGradientButton
        title="Get Started"
        onPress={() => router.push("/(auth)/LoginScreen")}
      />

      <Text
        className="mt-5 capitalize font-gagalin"
        style={{
          textAlign: "center",
          color: Colors.text.primary,
          fontSize: 14,
        }}
      >
        I will explore on my own →
      </Text>
    </View>
  );
}
