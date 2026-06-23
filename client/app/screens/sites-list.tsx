import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useSites } from "../../hooks/useApi";
import { Site } from "../../types";

const TYPES = [
  "All",
  "Temple",
  "Monastery",
  "Stupa",
  "Palace",
  "Museum",
  "Garden",
];
const CITIES = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];
const SORT = ["Rating", "Name", "Distance"];

const StarRating = ({ rating }: { rating?: number }) => (
  <View style={{ flexDirection: "row", gap: 1 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Ionicons
        key={s}
        name={s <= Math.round(rating ?? 0) ? "star" : "star-outline"}
        size={11}
        color="#F5A623"
      />
    ))}
  </View>
);

export default function SitesListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortBy, setSortBy] = useState("Rating");

  const { data, loading, error, refetch } = useSites({
    type: selectedType === "All" ? undefined : selectedType,
    city: selectedCity === "All" ? undefined : selectedCity,
    sortBy: sortBy.toLowerCase() as "rating" | "name" | "newest" | "oldest",
    limit: 50,
  });

  const sites = (data?.sites ?? []).filter(
    (s: Site) => !search || s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Sites</Text>
        <Text style={styles.headerCount}>{sites.length} places</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sites..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Type filters */}
      <FlatList
        data={TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedType === item && styles.chipActive]}
            onPress={() => setSelectedType(item)}
          >
            <Text
              style={[
                styles.chipText,
                selectedType === item && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Sites list */}
      {loading ? (
        <ActivityIndicator
          color={Colors.primary}
          style={{ flex: 1 }}
          size="large"
        />
      ) : (
        <FlatList
          data={sites}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: Site }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/site/${item._id}` as any)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardBadges}>
                {item.mustVisit && (
                  <View style={styles.mustVisitBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={10}
                      color={Colors.white}
                    />
                    <Text style={styles.mustVisitText}>Must Visit</Text>
                  </View>
                )}
                {item.isHiddenGem && (
                  <View style={styles.gemBadge}>
                    <Text style={styles.gemText}>Hidden Gem</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                </View>
                <Text style={styles.cardType}>
                  {item.type} · {item.city || item.location}
                </Text>
                <View style={styles.cardBottom}>
                  <StarRating rating={item.rating} />
                  <Text style={styles.ratingCount}>
                    {item.rating?.toFixed(1)} ({item.ratingCount ?? 0})
                  </Text>
                  <View style={{ flex: 1 }} />
                  {item.distance && (
                    <View style={styles.distRow}>
                      <Ionicons
                        name="location"
                        size={11}
                        color={Colors.error}
                      />
                      <Text style={styles.distText}>{item.distance}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="search-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyText}>No sites found</Text>
              <TouchableOpacity
                onPress={() => {
                  setSearch("");
                  setSelectedType("All");
                }}
              >
                <Text style={styles.clearText}>Clear filters</Text>
              </TouchableOpacity>
            </View>
          }
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: "CrimsonBold",
    color: Colors.white,
  },
  headerCount: { fontSize: 13, color: "rgba(255,255,255,0.75)" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterRow: { marginBottom: Spacing.sm },
  filterContent: { paddingHorizontal: Spacing.lg, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white, fontWeight: "600" },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: "hidden",
    ...Shadow.sm,
  },
  cardImage: { width: "100%", height: 160 },
  cardBadges: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: "row",
    gap: 6,
  },
  mustVisitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#2C7A3A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  mustVisitText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  gemBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  gemText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  cardBody: { padding: Spacing.md },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  cardName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "CrimsonBold",
    color: Colors.text,
  },
  priceBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  priceText: { fontSize: 11, color: Colors.textSecondary, fontWeight: "600" },
  cardType: { fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
  cardBottom: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingCount: { fontSize: 12, color: Colors.textMuted },
  distRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  distText: { fontSize: 11, color: Colors.textMuted },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textMuted },
  clearText: { fontSize: 14, color: Colors.primary, fontWeight: "600" },
});
