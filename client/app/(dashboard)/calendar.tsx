import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useEvents } from "../../hooks/useApi";
import { Event } from "../../types";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
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
function getFirstDayOfWeek(year: number, month: number) {
  // 0=Sun,1=Mon...6=Sat → shift for Mo=0
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate(),
  );
  const [selectedType, setSelectedType] = useState("All");

  const { data, loading } = useEvents({
    upcoming: true,
    type: selectedType === "All" ? undefined : selectedType,
    limit: 50,
  });

  const events: Event[] = data?.events ?? [];

  // Events for selected date
  const selectedEvents = useMemo(() => {
    if (!selectedDay) return events.slice(0, 5);
    return events.filter((e) => {
      try {
        const d = new Date(e.fullDate ?? e.date);
        return (
          d.getFullYear() === year &&
          d.getMonth() === month &&
          d.getDate() === selectedDay
        );
      } catch {
        return false;
      }
    });
  }, [events, selectedDay, year, month]);

  // Days with events
  const eventDays = useMemo(() => {
    const set = new Set<number>();
    events.forEach((e) => {
      try {
        const d = new Date(e.fullDate ?? e.date);
        if (d.getFullYear() === year && d.getMonth() === month)
          set.add(d.getDate());
      } catch {}
    });
    return set;
  }, [events, year, month]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const handleEventPress = (event: Event) => {
    router.push(`/event/${event._id}` as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Events & Calendar</Text>
          <Text style={styles.headerSub}>
            Discover upcoming cultural events
          </Text>
        </View>

        {/* Calendar card */}
        <View style={styles.calCard}>
          {/* Month nav */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={20} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTHS[month]} {year}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Day names */}
          <View style={styles.dayNames}>
            {DAYS.map((d) => (
              <Text key={d} style={styles.dayName}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.grid}>
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`e-${i}`} style={styles.cell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const isSelected = day === selectedDay;
              const hasEvent = eventDays.has(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.cell,
                    isSelected && styles.cellSelected,
                    isToday && !isSelected && styles.cellToday,
                  ]}
                  onPress={() =>
                    setSelectedDay(day === selectedDay ? null : day)
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cellText,
                      isSelected && styles.cellTextSelected,
                      isToday && !isSelected && styles.cellTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasEvent && (
                    <View
                      style={[styles.dot, isSelected && styles.dotSelected]}
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
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {EVENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, selectedType === type && styles.chipActive]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedType === type && styles.chipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upcoming events */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedDay
                ? `Events on ${MONTHS[month].slice(0, 3)} ${selectedDay}`
                : "Upcoming Events"}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/events-list" as any)}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              color={Colors.primary}
              style={{ marginTop: 24 }}
            />
          ) : selectedEvents.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons
                name="calendar-outline"
                size={40}
                color={Colors.border}
              />
              <Text style={styles.emptyText}>
                {selectedDay ? "No events on this day" : "No upcoming events"}
              </Text>
            </View>
          ) : (
            selectedEvents.map((event) => (
              <TouchableOpacity
                key={event._id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event)}
                activeOpacity={0.85}
              >
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDay}>{event.date}</Text>
                  <Text style={styles.eventMonth}>{event.month}</Text>
                </View>
                <View style={styles.eventBody}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <View style={styles.eventMeta}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.eventLoc} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                  <View style={styles.eventTags}>
                    <View style={styles.typePill}>
                      <Text style={styles.typePillText}>{event.type}</Text>
                    </View>
                    <View
                      style={[
                        styles.typePill,
                        event.price === "Free" || event.price === "Free Entry"
                          ? styles.freePill
                          : styles.paidPill,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typePillText,
                          event.price === "Free" || event.price === "Free Entry"
                            ? styles.freeText
                            : styles.paidText,
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

        <View style={{ height: 40 }} />
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
  header: {
    backgroundColor: Colors.brown,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTitle: { fontSize: 22, color: Colors.white, fontFamily: "CrimsonBold" },
  headerSub: { fontSize: 12, color: "#E2DBDB", marginTop: 2 },
  calCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: { fontSize: 17, fontWeight: "700", color: Colors.text },
  dayNames: { flexDirection: "row", marginBottom: Spacing.sm },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellSelected: { backgroundColor: Colors.primary, borderRadius: Radius.full },
  cellToday: { backgroundColor: "#F0EAE2", borderRadius: Radius.full },
  cellText: { fontSize: 14, color: Colors.text, fontWeight: "400" },
  cellTextSelected: { color: Colors.white, fontWeight: "700" },
  cellTextToday: { color: Colors.primary, fontWeight: "700" },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
  dotSelected: { backgroundColor: Colors.white },
  filterScroll: { marginTop: Spacing.md },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "500" },
  chipTextActive: { color: Colors.white, fontWeight: "700" },
  eventsSection: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  emptyBox: {
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  eventDateBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.brown,
    alignItems: "center",
    justifyContent: "center",
  },
  eventDay: { fontSize: 16, fontWeight: "800", color: Colors.white },
  eventMonth: {
    fontSize: 9,
    color: "#E2DBDB",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  eventBody: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  eventLoc: { fontSize: 11, color: Colors.textSecondary, flex: 1 },
  eventTags: { flexDirection: "row", gap: Spacing.xs, marginTop: 5 },
  typePill: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#F0EAE2",
  },
  typePillText: { fontSize: 10, color: Colors.primary, fontWeight: "600" },
  freePill: { backgroundColor: "#E8F5E9" },
  freeText: { color: "#2C7A3A" },
  paidPill: { backgroundColor: "#FFF8E7" },
  paidText: { color: "#B8860B" },
});
