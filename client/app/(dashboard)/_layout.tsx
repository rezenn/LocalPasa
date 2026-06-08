import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import BottomTabBar from "../../components/navigation/BottomTabBar";
import { TabScreenName } from "../../types";
import { Colors } from "../../constants/theme";

export default function DashboardLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [activeTab, setActiveTab] = useState<TabScreenName>("explore");

  const handleTabPress = (tab: TabScreenName) => {
    setActiveTab(tab);
    router.push(`/(dashboard)/${tab === "explore" ? "index" : tab}`);
  };

  // Determine if current route matches tab
  const currentRoute = segments[segments.length - 1];
  const currentTab =
    currentRoute === "index" ? "explore" : (currentRoute as TabScreenName);

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="map" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="profile" />
      </Stack>
      <BottomTabBar activeTab={currentTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
