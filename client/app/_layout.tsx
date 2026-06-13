import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Auth guard: reads from global AuthContext and redirects when appropriate
function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { user, initializing } = useAuth();

  useEffect(() => {
    // Wait until we've checked AsyncStorage for a token
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";

    if (!user && !inAuthGroup && !inOnboarding) {
      // Not logged in and trying to access a protected screen
      router.replace("/(auth)/LoginScreen");
    } else if (user && inAuthGroup) {
      // Already logged in but still on auth screen (e.g. back button)
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
        <Stack.Screen name="site/[id]" />
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
