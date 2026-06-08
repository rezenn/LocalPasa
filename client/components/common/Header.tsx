import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Typography, Spacing } from "../../constants/theme";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

const Header: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    fontSize: 17,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "500",
  },
});

export default Header;
