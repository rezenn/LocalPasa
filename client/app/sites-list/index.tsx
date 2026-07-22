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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useSites } from "../../hooks/useApi";
import { Site } from "../../types";
import { ListRowsSkeleton } from "../../components/skeletons";

const CITIES = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];
const TYPES = ["All", "Temple", "Monastery", "Stupa", "Palace", "Museum"];

export default function SitesList() {
  const router = useRouter();

  const params = useLocalSearchParams<{ type?: string }>();
  const initialType =
    TYPES.find((t) => t.toLowerCase() === (params.type || "").toLowerCase()) ??
    "All";
  const [city, setCity] = useState("All");
  const [type, setType] = useState(initialType);

  const { data, loading, error, refetch } = useSites({
    city: city === "All" ? undefined : city,
    type: type === "All" ? undefined : type,
    limit: 5000,
    sortBy: "rating",
  });
  const sites: Site[] = data?.sites ?? [];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>All Sites</Text>
          <Text style={s.headerSub}>{sites.length} places found</Text>
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
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.chip, type === t && s.chipActive]}
            onPress={() => setType(t)}
          >
            <Text style={[s.chipText, type === t && s.chipTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        >
          <ListRowsSkeleton count={6} imageSize={80} />
        </ScrollView>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.emptyText}>Failed to load sites</Text>
          <TouchableOpacity style={s.retryBtn} onPress={refetch}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        >
          {sites.length === 0 ? (
            <View style={s.center}>
              <Ionicons name="search-outline" size={48} color={Colors.border} />
              <Text style={s.emptyText}>No sites found</Text>
            </View>
          ) : (
            sites.map((site) => (
              <TouchableOpacity
                key={site._id}
                style={s.card}
                onPress={() => router.push(`/site/${site._id}` as any)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: site.image }} style={s.cardImg} />
                <View style={s.cardBody}>
                  <Text style={s.cardName}>{site.name}</Text>
                  <Text style={s.cardLoc}>{site.city || site.location}</Text>
                  <View style={s.cardMeta}>
                    {site.rating ? (
                      <View style={s.ratingRow}>
                        <Ionicons
                          name="star"
                          size={11}
                          color={Colors.secondary}
                        />
                        <Text style={s.ratingText}>
                          {site.rating.toFixed(1)}
                        </Text>
                      </View>
                    ) : null}
                    {site.type ? (
                      <View style={s.typeBadge}>
                        <Text style={s.typeBadgeText}>{site.type}</Text>
                      </View>
                    ) : null}
                    <Text style={s.price}>{site.price}</Text>
                  </View>
                  {site.mustVisit && (
                    <View style={s.mustVisit}>
                      <Ionicons
                        name="checkmark-circle"
                        size={10}
                        color={Colors.white}
                      />
                      <Text style={s.mustVisitText}>Must Visit</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textMuted}
                />
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
  list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    overflow: "hidden",
    ...Shadow.sm,
  },
  cardImg: { width: 80, height: 80 },
  cardBody: { flex: 1, paddingVertical: Spacing.sm },
  cardName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  cardLoc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: 4,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontWeight: "700", color: Colors.text },
  typeBadge: {
    backgroundColor: "#F0EAE2",
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  typeBadgeText: { fontSize: 10, color: Colors.primary, fontWeight: "600" },
  price: { fontSize: 11, color: Colors.textMuted },
  mustVisit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.mustVisit,
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  mustVisitText: { fontSize: 9, color: Colors.white, fontWeight: "600" },
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
