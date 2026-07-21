import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useArtisans } from "../../hooks/useApi";
import { Artisan } from "../../types";
import { ListRowsSkeleton } from "../../components/skeletons";

const CITIES = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];
const CRAFTS = [
  "All",
  "Thangka",
  "Woodcarving",
  "Pottery",
  "Weaving",
  "Jewelry",
  "Painting",
];

export default function ArtisansList() {
  const router = useRouter();
  const [city, setCity] = useState("All");
  const [craft, setCraft] = useState("All");

  const { data, loading, error, refetch } = useArtisans({
    city: city === "All" ? undefined : city,
    craft: craft === "All" ? undefined : craft,
    limit: 5000,
    sortBy: "rating",
  });
  const artisans: Artisan[] = data?.artisans ?? [];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>Local Artisans</Text>
          <Text style={s.headerSub}>{artisans.length} artisans found</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={s.filterRow}
      >
        {CITIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[s.chip, city === c && s.chipActive]}
            onPress={() => setCity(c)}
          >
            <Text style={[s.chipText, city === c && s.chipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={s.divider} />
        {CRAFTS.map((cr) => (
          <TouchableOpacity
            key={cr}
            style={[s.chip, craft === cr && s.chipActive]}
            onPress={() => setCraft(cr)}
          >
            <Text style={[s.chipText, craft === cr && s.chipTextActive]}>
              {cr}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.grid}
        >
          <ListRowsSkeleton count={6} imageSize={72} />
        </ScrollView>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.emptyText}>Failed to load artisans</Text>
          <TouchableOpacity style={s.retryBtn} onPress={refetch}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.grid}
        >
          {artisans.length === 0 ? (
            <View style={s.center}>
              <Ionicons name="people-outline" size={48} color={Colors.border} />
              <Text style={s.emptyText}>No artisans found</Text>
            </View>
          ) : (
            artisans.map((a) => (
              <TouchableOpacity
                key={a._id}
                style={s.card}
                onPress={() => router.push(`/artisan/${a._id}` as any)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: a.image }} style={s.cardImg} />
                <View style={s.cardInfo}>
                  <Text style={s.name}>{a.name}</Text>
                  <Text style={s.craft}>{a.craft}</Text>
                  <View style={s.metaRow}>
                    <Ionicons name="location" size={11} color={Colors.error} />
                    <Text style={s.loc}>{a.city || a.location}</Text>
                  </View>
                  {a.rating ? (
                    <View style={s.ratingRow}>
                      <Ionicons
                        name="star"
                        size={11}
                        color={Colors.secondary}
                      />
                      <Text style={s.ratingText}>{a.rating.toFixed(1)}</Text>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={s.chatBtn}
                  onPress={() => router.push(`/chat/${a._id}` as any)}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    backgroundColor: Colors.brown,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, color: Colors.white, fontFamily: "CrimsonBold" },
  headerSub: { fontSize: 12, color: "#E2DBDB" },
  filterScroll: { maxHeight: 44, marginTop: Spacing.sm },
  filterRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  chipTextActive: { color: Colors.white, fontWeight: "700" },
  divider: { width: 1, height: 20, backgroundColor: Colors.border },
  grid: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    overflow: "hidden",
    ...Shadow.sm,
    paddingRight: Spacing.md,
  },
  cardImg: { width: 72, height: 72 },
  cardInfo: { flex: 1, paddingVertical: Spacing.sm },
  name: { fontSize: 14, fontWeight: "700", color: Colors.text },
  craft: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
    marginTop: 2,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  loc: { fontSize: 11, color: Colors.textSecondary },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
  },
  ratingText: { fontSize: 11, fontWeight: "700", color: Colors.text },
  chatBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginTop: 80,
  },
  emptyText: { fontSize: 15, color: Colors.textMuted },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
});
