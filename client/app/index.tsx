import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { tokenStorage } from "@/api/client";

// On app start: check if the user already has a valid access token.
// If yes → go straight to dashboard. If no → go to onboarding/welcome.
export default function Index() {
  const [destination, setDestination] = useState<
    "/(dashboard)/explore" | "/(onboarding)/welcome" | null
  >(null);

  useEffect(() => {
    tokenStorage.getAccess().then((token) => {
      setDestination(token ? "/(dashboard)/explore" : "/(onboarding)/welcome");
    });
  }, []);

  if (!destination) return null; // brief splash while checking storage

  return <Redirect href={destination} />;
}