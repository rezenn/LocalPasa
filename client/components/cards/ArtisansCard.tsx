import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { Artisan } from "../../types";

interface ArtisanCardProps {
  artisan: Artisan;
  onPress: () => void;
}

const ArtisansCard: React.FC<ArtisanCardProps> = ({ artisan, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <Image source={{ uri: artisan.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {artisan.name}
        </Text>
        <Text style={styles.craft} numberOfLines={1}>
          {artisan.craft} · {artisan.location}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="location" size={10} color="#F64447" />
          <Text style={styles.distance}>{artisan.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 160,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
    marginRight: Spacing.md,
  },
  image: {
    width: "100%",
    height: 100,
    backgroundColor: Colors.border,
    marginBottom: -2,
  },
  info: {
    paddingLeft: Spacing.sm,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontFamily: "CrimsonBold",
    color: Colors.text,
  },
  craft: {
    fontSize: 11,
    fontFamily: "inter",
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  distance: {
    fontSize: 10,
    fontFamily: "inter",
    color: Colors.textMuted,
  },
});

export default ArtisansCard;
