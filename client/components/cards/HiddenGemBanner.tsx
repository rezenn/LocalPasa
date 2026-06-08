import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Typography } from "../../constants/theme";
import { HiddenGem } from "../../types";

interface HiddenGemBannerProps {
  gem: HiddenGem;
  onPress: () => void;
}

const HiddenGemBanner: React.FC<HiddenGemBannerProps> = ({ gem, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <ImageBackground
        source={{ uri: gem.image }}
        style={styles.image}
        imageStyle={{ borderRadius: Radius.lg }}
      >
        <View style={styles.overlay} />
        <View style={styles.badge}>
          <Ionicons name="diamond-outline" size={11} color={Colors.white} />
          <Text style={styles.badgeText}>Hidden gem of the week</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{gem.title}</Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={12}
                color={Colors.white}
              />
              <Text style={styles.metaText}>{gem.distance}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.metaItem}>
              <Ionicons name="ticket-outline" size={12} color={Colors.white} />
              <Text style={styles.metaText}>{gem.price}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  image: {
    height: 160,
    justifyContent: "space-between",
    padding: Spacing.md,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "500",
  },
  content: {
    gap: 4,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "400",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});

export default HiddenGemBanner;
