import { Image, Text, View, TouchableOpacity } from "react-native";

import Colors from "@/constants/colors";
import { router } from "@/.expo/types/router";

export default function OnboardingScreen1() {
  return (
    <View
      className="flex-1  px-3"
      style={{ backgroundColor: Colors.Onboardingbackground }}
    >
      <View className="flex-row w-full gap-2 mt-12">
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
      {/* Need to change the font to crimson text */}
      <Text className="font-san font-extrabold text-5xl px-1 ">
        What are you {"\n"}Interested in?
      </Text>
      <Text className="my-2 px-1 font-bold">
        Select all that apply to your preferences
      </Text>
      <View className="flex-row gap-2  justify-center">
        <TouchableOpacity
          className="rounded-lg w-44 py-4 items-center justify-center mt-1"
          style={{ backgroundColor: Colors.button.third }}
          onPress={() => {}}
        >
          <Image></Image>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-lg w-[190px] h-[180px] py-4 items-center justify-center mt-1"
          style={{ backgroundColor: Colors.button.third }}
          onPress={() => {}}
        >
          <Image
            source={require("@/assets/images/skyline.png")}
            className=" mt-12 w-[163px] h-[109px] rounded-lg  "
            resizeMode="contain"
          ></Image>
          <Text>Local Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
