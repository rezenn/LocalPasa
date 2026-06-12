import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import BottomTabBar from "../../components/navigation/BottomTabBar";
import { TabScreenName } from "../../types";
import { Colors } from "../../constants/theme";

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<TabScreenName>("explore");

  const handleTabPress = (tab: TabScreenName) => {
    setActiveTab(tab);
    let route: string;

    switch (tab) {
      case "explore":
        route = "/(dashboard)/explore";
        break;
      case "map":
        route = "/(dashboard)/map";
        break;
      case "calendar":
        route = "/(dashboard)/calendar";
        break;
      case "save":
        route = "/(dashboard)/saved";
        break;
      case "profile":
        route = "/(dashboard)/profile";
        break;
      default:
        route = "/(dashboard)/explore";
    }

    router.replace(route as any);
  };

  // Update active tab based on current route
  useEffect(() => {
    if (pathname.includes("explore") || pathname === "/") {
      setActiveTab("explore");
    } else if (pathname.includes("map")) {
      setActiveTab("map");
    } else if (pathname.includes("calendar")) {
      setActiveTab("calendar");
    } else if (pathname.includes("saved")) {
      setActiveTab("save");
    } else if (pathname.includes("profile")) {
      setActiveTab("profile");
    }
  }, [pathname]);

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="explore" />
        <Stack.Screen name="map" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="profile" />
      </Stack>
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
