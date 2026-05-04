import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-slate-950 px-6 py-10">
      <View className="flex-1 justify-center">
        <View className="mb-8">
          <Text className="text-sm font-semibold uppercase tracking-wider text-purple-400">
            LocalPasa
          </Text>
          <Text className="mt-3 text-4xl font-bold text-white">
            Hello NativeWind!
          </Text>
          <Text className="mt-4 text-base leading-6 text-slate-300">
            Your Expo app is now using Tailwind-style classes through
            NativeWind.
          </Text>
        </View>

        <View className="rounded-lg border border-slate-700 bg-slate-900 p-5">
          <Text className="text-lg font-semibold text-white">
            Styling check
          </Text>
          <Text className="mt-2 text-sm leading-5 text-slate-400">
            Background colors, spacing, borders, typography, and layout are all
            coming from className.
          </Text>
        </View>
      </View>
    </View>
  );
}
