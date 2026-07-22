import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useEvents } from "../../hooks/useApi";
import { Event } from "../../types";
import { EventListItemSkeleton } from "../../components/skeletons";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const EVENT_TYPES = [
  "All",
  "Festival",
  "Cultural",
  "Religious",
  "Music",
  "Food",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedType, setSelectedType] = useState("All");

  const { data, loading } = useEvents({
    upcoming: true,
    type: selectedType === "All" ? undefined : selectedType,
    limit: 50,
  });

  const events: Event[] = data?.events ?? [];

  // Build event dates map for dot indicators
  const eventDateSet = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.fullDate) set.add(e.fullDate.slice(0, 10));
    });
    return set;
  }, [events]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
    setSelectedDate(1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
    setSelectedDate(1);
  };

  const selectedKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
  const eventsForDate = events.filter((e) =>
    e.fullDate?.startsWith(selectedKey),
  );
  const upcomingEvents =
    eventsForDate.length > 0 ? eventsForDate : events.slice(0, 8);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
          <Text style={styles.headerSub}>Cultural events & festivals</Text>
        </View>

        {/* Month navigator */}
        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTHS[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={styles.dayRow}>
            {DAYS.map((d) => (
              <Text key={d} style={styles.dayLabel}>
                {d}
              </Text>
            ))}
          </View>

          {/* Date grid */}
          <View style={styles.grid}>
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - firstDay + 1;
              const isValid = dayNum >= 1 && dayNum <= daysInMonth;
              const isToday =
                dayNum === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();
              const isSelected = dayNum === selectedDate && isValid;
              const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const hasEvent = isValid && eventDateSet.has(dateKey);

              return (
                <TouchableOpacity
                  key={i}
                  style={styles.cell}
                  onPress={() => isValid && setSelectedDate(dayNum)}
                  disabled={!isValid}
                >
                  <View
                    style={[
                      styles.dateCircle,
                      isSelected && styles.dateCircleSelected,
                      isToday && !isSelected && styles.dateCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !isValid && styles.dateTextEmpty,
                        isSelected && styles.dateTextSelected,
                        isToday && !isSelected && styles.dateTextToday,
                      ]}
                    >
                      {isValid ? dayNum : ""}
                    </Text>
                  </View>
                  {hasEvent && (
                    <View
                      style={[
                        styles.dot,
                        isSelected && { backgroundColor: Colors.white },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {EVENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, selectedType === t && styles.chipActive]}
              onPress={() => setSelectedType(t)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedType === t && styles.chipTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events list */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {eventsForDate.length > 0
                ? `Events on ${selectedDate} ${MONTHS[viewMonth]}`
                : "Upcoming Events"}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/events-list" as any)}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View>
              <EventListItemSkeleton />
              <EventListItemSkeleton />
              <EventListItemSkeleton />
            </View>
          ) : upcomingEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={40}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyText}>No events this day</Text>
            </View>
          ) : (
            upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event._id}
                style={styles.eventRow}
                onPress={() => router.push(`/event/${event._id}` as any)}
                activeOpacity={0.85}
              >
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDay}>{event.date || "15"}</Text>
                  <Text style={styles.eventMonth}>
                    {event.month?.slice(0, 3) || "APR"}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <View style={styles.eventMeta}>
                    <Ionicons name="location" size={10} color="#F64447" />

                    <Text style={styles.eventMetaText}>
                      {event.distance ? `${event.distance} · ` : ""}
                      {event.location}{" "}
                    </Text>
                    <View
                      style={[
                        styles.priceBadge,
                        event.price === "Free Entry" && styles.freeBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priceText,
                          event.price === "Free Entry" && styles.freeText,
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
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight || 0,
  },
  scroll: { flex: 1 },
  headerWrap: {
    backgroundColor: Colors.brown,
    marginBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    paddingBottom: Spacing.md,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTitle: { fontSize: 24, fontFamily: "CrimsonBold", color: Colors.white },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  calendarCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.md,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  navBtn: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
  },
  monthLabel: { fontSize: 17, fontWeight: "700", color: Colors.text },
  dayRow: { flexDirection: "row", marginBottom: Spacing.sm },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "14.285%", alignItems: "center", paddingVertical: 3 },
  dateCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCircleSelected: { backgroundColor: Colors.primary },
  dateCircleToday: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  dateText: { fontSize: 13, color: Colors.text, fontWeight: "500" },
  dateTextEmpty: { color: "transparent" },
  dateTextSelected: { color: Colors.white, fontWeight: "700" },
  dateTextToday: { color: Colors.primary, fontWeight: "700" },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
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
  eventsSection: { paddingHorizontal: Spacing.lg },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    fontFamily: "CrimsonBold",
  },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  emptyState: { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  eventDateBox: {
    width: 46,
    height: 46,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  eventDay: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 20,
  },
  eventMonth: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  eventInfo: { flex: 1 },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
    fontFamily: "CrimsonBold",
  },
  eventMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  eventMetaText: { fontSize: 11, color: Colors.textMuted, flex: 1 },
  priceBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  freeBadge: { backgroundColor: "#E8F5E9" },
  priceText: { fontSize: 10, color: Colors.textSecondary, fontWeight: "600" },
  freeText: { color: "#2C7A3A" },
});
//
