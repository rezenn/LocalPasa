import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter, useSegments, usePathname } from "expo-router";
import BottomTabBar from "../../components/navigation/BottomTabBar";
import { TabScreenName } from "../../types";
import { Colors } from "../../constants/theme";

export default function DashboardLayout() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<TabScreenName>("explore");

  const handleTabPress = (tab: TabScreenName) => {
    setActiveTab(tab);
    let route: string;

    switch (tab) {
      case "explore":
        route = "/";
        break;
      case "map":
        route = "/map";
        break;
      case "calendar":
        route = "/calendar";
        break;
      case "save":
        route = "/saved";
        break;
      case "profile":
        route = "/profile";
        break;
      default:
        route = "/";
    }

    router.push(route as any);
  };

  // Update active tab based on current route
  useEffect(() => {
    if (pathname === "/" || pathname === "/index") {
      setActiveTab("explore");
    } else if (pathname === "/map") {
      setActiveTab("map");
    } else if (pathname === "/calendar") {
      setActiveTab("calendar");
    } else if (pathname === "/saved") {
      setActiveTab("save");
    } else if (pathname === "/profile") {
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
        <Stack.Screen name="index" />
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
