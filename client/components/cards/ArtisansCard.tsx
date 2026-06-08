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
      <Text style={styles.name} numberOfLines={1}>
        {artisan.name}
      </Text>
      <Text style={styles.craft} numberOfLines={1}>
        {artisan.craft} · {artisan.location}
      </Text>
      <View style={styles.meta}>
        <Ionicons name="location-outline" size={10} color={Colors.textMuted} />
        <Text style={styles.distance}>{artisan.distance}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 110,
    marginRight: Spacing.md,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: Radius.md,
    backgroundColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },
  craft: {
    fontSize: 10,
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
    color: Colors.textMuted,
  },
});

export default ArtisansCard;
