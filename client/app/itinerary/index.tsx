import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { savedApi } from "../../api/index";
import { useAsync } from "../../hooks/index";
import { Site } from "../../types";
import {
  getItinerary,
  saveItinerary,
  suggestVisitOrder,
  estimateWalkMinutes,
} from "../../utils/itinerary";

export default function ItineraryScreen() {
  const router = useRouter();
  const { data, loading } = useAsync(() => savedApi.getAll(), []);
  const savedSites: Site[] = (data?.sites as Site[]) ?? [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getItinerary().then((ids) => {
      setSelectedIds(ids);
      setReady(true);
    });
  }, []);

  // Persist whenever the itinerary changes, once initial load has happened.
  useEffect(() => {
    if (ready) saveItinerary(selectedIds);
  }, [selectedIds, ready]);

  const stops = selectedIds
    .map((id) => savedSites.find((s) => s._id === id))
    .filter(Boolean) as Site[];

  const toggleSite = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const moveStop = (index: number, direction: -1 | 1) => {
    const next = [...selectedIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSelectedIds(next);
  };

  // Auto-suggest an efficient visiting order (US-034) — only meaningfully
  // useful once there are 3+ stops, per the acceptance criteria.
  const autoSuggest = () => {
    const suggested = suggestVisitOrder(stops);
    setSelectedIds(suggested.map((s) => s._id));
  };

  const canAutoSuggest = stops.length >= 3;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>My Itinerary</Text>
          <Text style={s.headerSub}>
            {stops.length} stop{stops.length !== 1 ? "s" : ""} planned
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={Colors.primary} />
      ) : savedSites.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="map-outline" size={48} color={Colors.border} />
          <Text style={s.emptyText}>
            Save some sites first — then build a day plan from them here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.content}>
          {/* Ordered itinerary with estimated walking time between stops */}
          {stops.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionRow}>
                <Text style={s.sectionTitle}>Your Route</Text>
                {canAutoSuggest && (
                  <TouchableOpacity style={s.suggestBtn} onPress={autoSuggest}>
                    <Ionicons name="sparkles" size={13} color={Colors.white} />
                    <Text style={s.suggestBtnText}>Auto-suggest order</Text>
                  </TouchableOpacity>
                )}
              </View>
              {!canAutoSuggest && (
                <Text style={s.hint}>
                  Add {3 - stops.length} more saved{" "}
                  {stops.length === 2 ? "site" : "sites"} to unlock
                  auto-suggested ordering.
                </Text>
              )}

              {stops.map((stop, i) => (
                <View key={stop._id}>
                  <View style={s.stopCard}>
                    <View style={s.stopIndex}>
                      <Text style={s.stopIndexText}>{i + 1}</Text>
                    </View>
                    <Image source={{ uri: stop.image }} style={s.stopImg} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.stopName} numberOfLines={1}>
                        {stop.name}
                      </Text>
                      <Text style={s.stopLoc} numberOfLines={1}>
                        {stop.city || stop.location}
                      </Text>
                    </View>
                    <View style={s.reorderCol}>
                      <TouchableOpacity
                        onPress={() => moveStop(i, -1)}
                        disabled={i === 0}
                        hitSlop={6}
                      >
                        <Ionicons
                          name="chevron-up"
                          size={18}
                          color={i === 0 ? Colors.border : Colors.primary}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => moveStop(i, 1)}
                        disabled={i === stops.length - 1}
                        hitSlop={6}
                      >
                        <Ionicons
                          name="chevron-down"
                          size={18}
                          color={
                            i === stops.length - 1
                              ? Colors.border
                              : Colors.primary
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleSite(stop._id)}
                      hitSlop={6}
                      style={{ marginLeft: 4 }}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={Colors.textMuted}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Walking route + estimated time between stops (US-036) */}
                  {i < stops.length - 1 &&
                    (() => {
                      const mins = estimateWalkMinutes(stop, stops[i + 1]);
                      return (
                        <View style={s.routeConnector}>
                          <View style={s.routeLine} />
                          <View style={s.routeBadge}>
                            <Ionicons
                              name="walk"
                              size={12}
                              color={Colors.textSecondary}
                            />
                            <Text style={s.routeBadgeText}>
                              {mins != null
                                ? `~${mins} min walk`
                                : "Distance unavailable"}
                            </Text>
                          </View>
                        </View>
                      );
                    })()}
                </View>
              ))}
            </View>
          )}

          {/* Picker for saved sites not yet in the itinerary */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Add from your saved sites</Text>
            {savedSites.map((site) => {
              const inItinerary = selectedIds.includes(site._id);
              return (
                <TouchableOpacity
                  key={site._id}
                  style={s.pickRow}
                  onPress={() => toggleSite(site._id)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: site.image }} style={s.pickImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.pickName} numberOfLines={1}>
                      {site.name}
                    </Text>
                    <Text style={s.pickLoc} numberOfLines={1}>
                      {site.city || site.location}
                    </Text>
                  </View>
                  <Ionicons
                    name={inItinerary ? "checkmark-circle" : "add-circle-outline"}
                    size={22}
                    color={inItinerary ? "#2C7A3A" : Colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
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
  content: { padding: Spacing.lg },
  section: { marginBottom: Spacing.lg },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  hint: { fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.sm },
  suggestBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  suggestBtnText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  stopCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    ...Shadow.sm,
  },
  stopIndex: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stopIndexText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  stopImg: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.border,
  },
  stopName: { fontSize: 13, fontWeight: "700", color: Colors.text },
  stopLoc: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  reorderCol: { alignItems: "center" },
  routeConnector: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
    marginVertical: 4,
  },
  routeLine: {
    width: 2,
    height: 18,
    backgroundColor: Colors.border,
    marginRight: Spacing.sm,
  },
  routeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0EAE2",
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  routeBadgeText: { fontSize: 10, color: Colors.textSecondary },
  pickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickImg: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.border,
  },
  pickName: { fontSize: 13, fontWeight: "600", color: Colors.text },
  pickLoc: { fontSize: 11, color: Colors.textSecondary },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
  },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: "center" },
});
