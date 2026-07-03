import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";

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
    // router is stable from expo-router, but include it for exhaustive deps.
  }, [user, initializing, segments, router]);

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
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen
          name="site/[id]"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="artisan/[id]"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="artisans-list/index"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="events-list/index"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="sites-list/index"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="products-list/index"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="translate/index"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="chat/[artisanId]"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/edit"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/language"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/interests"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/locations"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/saved"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/notifications"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/help"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="profile/privacy"
          options={{ animation: "slide_from_right", gestureEnabled: true }}
        />
      </Stack>
      <AuthGuard />
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
    </PreferencesProvider>
  );
}
