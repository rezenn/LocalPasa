import React, { useState } from "react";
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
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import EventCard from "../../components/cards/EventCard";
import { useEvents } from "../../hooks/useApi";
import { Event } from "../../types";

const EVENT_TYPES = [
  "All",
  "Festival",
  "Cultural",
  "Religious",
  "Music",
  "Food",
];

export default function CalendarScreen() {
  const [selectedType, setSelectedType] = useState("All");

  const { data, loading, error, refetch } = useEvents({
    upcoming: true,
    type: selectedType === "All" ? undefined : selectedType,
    limit: 30,
  });

  const events: Event[] = data?.events ?? [];

  const handleEventPress = (event: Event) => {
    console.log("Event pressed:", event._id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events & Calendar</Text>
        <Text style={styles.headerSub}>Discover upcoming cultural events</Text>
      </View>

      {/* Type filter chips */}
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
            activeOpacity={0.8}
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

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            color={Colors.primary}
            size="large"
          />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Failed to load events</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No upcoming events found</Text>
          </View>
        ) : (
          events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onPress={() => handleEventPress(event)}
            />
          ))
        )}
        <View style={styles.bottomPad} />
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
  headerTitle: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: "CrimsonBold",
  },
  headerSub: {
    fontSize: 12,
    color: "#E2DBDB",
    marginTop: 2,
  },
  filterScroll: {
    marginTop: Spacing.md,
    maxHeight: 44,
  },
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
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: "700",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.md },
  loader: { marginTop: Spacing.xxxl },
  errorBox: {
    alignItems: "center",
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  errorText: { fontSize: 15, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
  emptyBox: {
    alignItems: "center",
    marginTop: Spacing.xxxl,
  },
  emptyText: { fontSize: 15, color: Colors.textMuted },
  bottomPad: { height: Spacing.xxxl },
});
