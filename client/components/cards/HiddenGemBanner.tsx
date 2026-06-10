import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing } from "../../constants/theme";
import { Site } from "../../types";

interface HiddenGemBannerProps {
  gem: Site;
  onPress: () => void;
}

const HiddenGemBanner: React.FC<HiddenGemBannerProps> = ({ gem, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <LinearGradient
        colors={[
          "#00C8B3",
          "#007380",
          "#004866",
          "#003259",
          "#002852",
          "#001D4C",
        ]}
        locations={[0, 0.16, 0.41, 0.6, 0.83, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        {/* LEFT: Text content */}
        <View style={styles.textContent}>
          <View style={styles.badge}>
            <Ionicons name="diamond" size={11} color="#002852" />
            <Text style={styles.badgeText}>Hidden gem of the week</Text>
          </View>
          <View style={styles.title}>
            <Text style={styles.name} numberOfLines={2}>
              {gem.name}
            </Text>
            <Text style={styles.location}>{gem.location}</Text>
          </View>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              {/* <Ionicons
                name="location-outline"
                size={12}
                color={Colors.white}
              /> */}
              <Text style={styles.metaText}>{gem.distance}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.metaItem}>
              {/* <Ionicons name="ticket-outline" size={12} color={Colors.white} /> */}
              <Text style={styles.metaText}>{gem.price}</Text>
            </View>
          </View>
        </View>

        {/* RIGHT: Photo panel */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: gem.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    height: 160,
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: Radius.lg,
  },
  textContent: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8EEBE",
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 0.5,
    borderColor: "#002852",
  },
  badgeText: {
    color: "#002852",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  title: {
    rowGap: 2,
  },
  name: {
    color: Colors.white,
    fontSize: 28,
    lineHeight: 30,
    // marginTop: 8,
    fontFamily: "CrimsonBold",
  },
  location: {
    color: Colors.white,
    fontSize: 26,
    lineHeight: 30,
    // marginTop: 1,
    fontFamily: "CrimsonBold",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: -8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#BEB2B2",
    fontSize: 11,
    fontWeight: "500",
    // fontFamily: "CrimsonRegular",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  imageWrapper: {
    marginTop: Spacing.md,
    marginRight: Spacing.sm,
    alignItems: "center",
    width: 180,
    height: "80%",
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: 60,
    borderTopRightRadius: Radius.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default HiddenGemBanner;
