import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
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
const CITIES = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];

export default function EventsList() {
  const router = useRouter();
  const [type, setType] = useState("All");
  const [city, setCity] = useState("All");

  const { data, loading, error, refetch } = useEvents({
    upcoming: true,
    type: type === "All" ? undefined : type,
    city: city === "All" ? undefined : city,
    limit: 50,
  });
  const events: Event[] = data?.events ?? [];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>All Events</Text>
          <Text style={s.headerSub}>{events.length} upcoming events</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={s.filterRow}
      >
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
        <View style={s.divider} />
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
      </ScrollView>

      {loading ? (
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.primary}
          size="large"
        />
      ) : error ? (
        <View style={s.center}>
          <Text style={s.emptyText}>Failed to load events</Text>
          <TouchableOpacity style={s.retryBtn} onPress={refetch}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        >
          {events.length === 0 ? (
            <View style={s.center}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={Colors.border}
              />
              <Text style={s.emptyText}>No events found</Text>
            </View>
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event._id}
                style={s.card}
                onPress={() => router.push(`/event/${event._id}` as any)}
                activeOpacity={0.85}
              >
                <View style={s.dateBox}>
                  <Text style={s.dateNum}>{event.date}</Text>
                  <Text style={s.dateMonth}>{event.month}</Text>
                </View>
                <View style={s.cardBody}>
                  <Text style={s.title} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <View style={s.metaRow}>
                    <Ionicons name="location" size={11} color={Colors.error} />
                    <Text style={s.meta} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                  <View style={s.tagRow}>
                    <View style={s.typeBadge}>
                      <Text style={s.typeBadgeText}>{event.type}</Text>
                    </View>
                    <View
                      style={[
                        s.typeBadge,
                        event.price === "Free" || event.price === "Free Entry"
                          ? s.freeBadge
                          : s.paidBadge,
                      ]}
                    >
                      <Text
                        style={[
                          s.typeBadgeText,
                          event.price === "Free" || event.price === "Free Entry"
                            ? s.freeText
                            : s.paidText,
                        ]}
                      >
                        {event.price}
                      </Text>
                    </View>
                  </View>
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
    padding: Spacing.md,
    ...Shadow.sm,
  },
  dateBox: {
    width: 48,
    height: 48,
    backgroundColor: Colors.brown,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dateNum: { color: Colors.white, fontSize: 16, fontWeight: "800" },
  dateMonth: {
    color: "#E2DBDB",
    fontSize: 9,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardBody: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700", color: Colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  meta: { fontSize: 11, color: Colors.textSecondary, flex: 1 },
  tagRow: { flexDirection: "row", gap: Spacing.xs, marginTop: 5 },
  typeBadge: {
    backgroundColor: "#F0EAE2",
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeBadgeText: { fontSize: 10, color: Colors.primary, fontWeight: "600" },
  freeBadge: { backgroundColor: "#E8F5E9" },
  freeText: { color: "#2C7A3A" },
  paidBadge: { backgroundColor: "#FFF8E7" },
  paidText: { color: "#B8860B" },
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
