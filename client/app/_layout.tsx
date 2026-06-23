import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (initializing) return;
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    if (!user && !inAuthGroup && !inOnboarding) {
      router.replace("/(auth)/LoginScreen");
    } else if (user && inAuthGroup) {
      router.replace("/(dashboard)/explore");
    }
  }, [user, initializing, segments]);

  return null;
}

function RootLayoutInner() {
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
        <Stack.Screen
          name="site/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="artisan/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/sites-list"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/artisans-list"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/events-list"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/products-list"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/chat/[artisanId]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/translate"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/notifications"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/edit-profile"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
      <AuthGuard />
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
