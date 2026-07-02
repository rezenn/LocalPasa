import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Shadow } from "../../constants/theme";
import { TabScreenName } from "../../types";

interface TabItem {
  key: TabScreenName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

const TAB_ITEMS: TabItem[] = [
  {
    key: "explore",
    label: "Explore",
    icon: "compass-outline",
    iconActive: "compass",
  },
  { key: "map", label: "Map", icon: "map-outline", iconActive: "map" },
  {
    key: "calendar",
    label: "Calendar",
    icon: "calendar-outline",
    iconActive: "calendar",
  },
  { key: "save", label: "Save", icon: "heart-outline", iconActive: "heart" },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

interface BottomTabBarProps {
  activeTab: TabScreenName;
  onTabPress: (tab: TabScreenName) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {TAB_ITEMS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
// 
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
    ...Shadow.md,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "400",
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
});

export default BottomTabBar;
