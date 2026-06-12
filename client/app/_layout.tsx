import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Gagalin: require("@/assets/fonts/Gagalin-Regular.otf"),
    CrimsonRegular: require("@/assets/fonts/CrimsonText-Regular.ttf"),
    CrimsonBold: require("@/assets/fonts/CrimsonText-Bold.ttf"),
    CrimsonSemiBold: require("@/assets/fonts/CrimsonText-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="site" />
      </Stack>
      <Toast />
    </>
  );
}
