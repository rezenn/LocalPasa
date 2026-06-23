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
import { useEvents } from "../../hooks/useApi";
import { Event } from "../../types";

const TYPES = [
  "All",
  "Festival",
  "Cultural",
  "Religious",
  "Music",
  "Food",
  "Art",
];

export default function EventsListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const { data, loading } = useEvents({
    upcoming: true,
    type: selectedType === "All" ? undefined : selectedType,
    limit: 50,
  });

  const events = (data?.events ?? []).filter(
    (e: Event) =>
      !search || e.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Events</Text>
        <Text style={styles.headerCount}>{events.length} events</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

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

      {loading ? (
        <ActivityIndicator
          color={Colors.primary}
          style={{ flex: 1 }}
          size="large"
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: Event }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/event/${item._id}` as any)}
              activeOpacity={0.85}
            >
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              )}
              <View style={styles.cardBody}>
                <View style={styles.cardLeft}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateDay}>{item.date || "15"}</Text>
                    <Text style={styles.dateMonth}>
                      {item.month?.slice(0, 3) || "APR"}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.metaText}>
                      {item.city || item.location}
                    </Text>
                  </View>
                  <View style={styles.bottomRow}>
                    <View style={[styles.typeBadge]}>
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <View
                      style={[
                        styles.priceBadge,
                        item.price === "Free Entry" && styles.freeBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priceText,
                          item.price === "Free Entry" && styles.freeText,
                        ]}
                      >
                        {item.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyText}>No events found</Text>
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
  cardImage: { width: "100%", height: 140 },
  cardBody: { flexDirection: "row", padding: Spacing.md, gap: Spacing.md },
  cardLeft: {},
  dateBox: {
    width: 50,
    height: 54,
    backgroundColor: Colors.primary + "15",
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: { fontSize: 18, fontWeight: "700", color: Colors.primary },
  dateMonth: { fontSize: 10, fontWeight: "700", color: Colors.primary },
  cardRight: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  metaText: { fontSize: 12, color: Colors.textMuted },
  bottomRow: { flexDirection: "row", gap: 6 },
  typeBadge: {
    backgroundColor: Colors.primary + "12",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  typeText: { fontSize: 11, color: Colors.primary, fontWeight: "600" },
  priceBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  freeBadge: { backgroundColor: "#E8F5E9" },
  priceText: { fontSize: 11, color: Colors.textSecondary, fontWeight: "600" },
  freeText: { color: "#2C7A3A" },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textMuted },
});
