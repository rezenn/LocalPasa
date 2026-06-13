import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { useEffect, useRef } from "react";
import { tokenStorage } from "@/api/client";

// Auth guard: watches for 401 events and bounces to login
function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const checked = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (checked.current) return;
    checked.current = true;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";

    // If we are already on auth/onboarding screens, do nothing
    if (inAuthGroup || inOnboarding) return;

    // Otherwise check if token still exists (dashboard screens)
    tokenStorage.getAccess().then((token) => {
      if (!token) {
        router.replace("/(auth)/LoginScreen");
      }
    });
  }, [segments]);

  return null;
}

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
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="site" />
      </Stack>
      <AuthGuard />
      <Toast />
    </>
  );
}