import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Radius,
  Spacing,
  Shadow,
  Typography,
} from "../../constants/theme";
import { EXPERIENCES_SEED } from "../../constants/data/experiencesSeed";
import { Experience } from "../../types/experience";

const TABS = ["All", "Pottery", "Thanka", "Cooking", "Weaving"];

const BADGE_COLORS: Record<string, string> = {
  New: "#2C7A3A",
  "Best Seller": "#F5A623",
  Popular: Colors.primary,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? "star" : "star-outline"}
          size={12}
          color={Colors.star}
        />
      ))}
    </View>
  );
}

function ExperienceCard({
  experience,
  onPress,
}: {
  experience: Experience;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: experience.image }} style={styles.cardImage} />
        {experience.badge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  BADGE_COLORS[experience.badge] ?? Colors.primary,
              },
            ]}
          >
            <Text style={styles.badgeText}>{experience.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {experience.title}
        </Text>
        <Text style={styles.cardArtisan} numberOfLines={1}>
          by {experience.artisanName}
        </Text>
        <View style={styles.cardMetaRow}>
          <StarRating rating={experience.rating} />
          <Text style={styles.cardRatingText}>
            {experience.rating.toFixed(1)}
          </Text>
          {!!experience.spotsLeft && experience.spotsLeft <= 5 && (
            <Text style={styles.cardSpotsLeft}>
              {experience.spotsLeft} spots left
            </Text>
          )}
        </View>
        <View style={styles.cardMetaRow}>
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.cardMetaText}>{experience.durationLabel}</Text>
        </View>
        <View style={styles.cardFooterRow}>
          <Text style={styles.cardPrice}>
            NPR {experience.price.toLocaleString()}
          </Text>
          <View style={styles.bookNowBtn}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ExperiencesListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");

  const experiences = useMemo(
    () =>
      activeTab === "All"
        ? EXPERIENCES_SEED
        : EXPERIENCES_SEED.filter((e) => e.category === activeTab),
    [activeTab],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Experiences</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.tabsWrap}>
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(t) => t}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === item && styles.tabActive]}
              onPress={() => setActiveTab(item)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item && styles.tabTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {experiences.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="sparkles-outline"
            size={48}
            color={Colors.textMuted}
          />
          <Text style={styles.emptyTitle}>
            No experiences in this category yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={experiences}
          keyExtractor={(e) => e.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExperienceCard
              experience={item}
              onPress={() => router.push(`/experience/${item.id}` as any)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "CrimsonBold",
    color: Colors.white,
    flex: 1,
  },
  tabsWrap: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabsContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  list: { padding: Spacing.lg, gap: Spacing.lg },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  cardImageWrap: { width: 110, height: 130 },
  cardImage: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: Spacing.xs,
    left: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  cardBody: { flex: 1, padding: Spacing.md, gap: 2 },
  cardTitle: { ...Typography.h3, fontSize: 14 },
  cardArtisan: { ...Typography.caption },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  cardRatingText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  cardSpotsLeft: {
    fontSize: 10,
    color: Colors.error,
    marginLeft: Spacing.xs,
    fontWeight: "600",
  },
  cardMetaText: { fontSize: 11, color: Colors.textMuted },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  cardPrice: { fontSize: 14, fontWeight: "800", color: Colors.text },
  bookNowBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  bookNowText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: { ...Typography.caption, textAlign: "center" },
});
