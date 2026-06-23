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
import { useArtisans } from "../../hooks/useApi";
import { Artisan } from "../../types";

const CRAFTS = [
  "All",
  "Thangka",
  "Pottery",
  "Woodcarving",
  "Weaving",
  "Metalwork",
  "Stone Carving",
];

export default function ArtisansListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCraft, setSelectedCraft] = useState("All");

  const { data, loading } = useArtisans({
    craft: selectedCraft === "All" ? undefined : selectedCraft,
    limit: 50,
    sortBy: "rating",
  });

  const artisans = (data?.artisans ?? []).filter(
    (a: Artisan) =>
      !search || a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Local Artisans</Text>
        <Text style={styles.headerCount}>{artisans.length} artisans</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search artisans..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={CRAFTS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedCraft === item && styles.chipActive]}
            onPress={() => setSelectedCraft(item)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCraft === item && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <ActivityIndicator
          color={Colors.primary}
          style={{ flex: 1 }}
          size="large"
        />
      ) : (
        <FlatList
          data={artisans}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: Spacing.md }}
          renderItem={({ item }: { item: Artisan }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/artisan/${item._id}` as any)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.craftBadge}>
                  <Text style={styles.craftBadgeText}>{item.craft}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons
                    name="location"
                    size={11}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.metaText}>
                    {item.city || item.location}
                  </Text>
                </View>
                {item.rating && (
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={11} color="#F5A623" />
                    <Text style={styles.ratingText}>
                      {item.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.chatIcon}
                onPress={() => router.push(`/screens/chat/${item._id}` as any)}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={16}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="people-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyText}>No artisans found</Text>
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
  grid: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadow.sm,
    position: "relative",
  },
  cardImage: { width: "100%", height: 130 },
  cardBody: { padding: Spacing.sm },
  cardName: {
    fontSize: 13,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    marginBottom: 4,
  },
  craftBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginBottom: 4,
  },
  craftBadgeText: { fontSize: 10, color: Colors.primary, fontWeight: "600" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 2,
  },
  metaText: { fontSize: 11, color: Colors.textMuted },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 11, color: Colors.textSecondary, fontWeight: "600" },
  chatIcon: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.sm,
  },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textMuted },
});