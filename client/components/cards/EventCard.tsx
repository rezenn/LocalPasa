import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { Event } from "../../types";
import LandmarkIcon from "../../assets/icons/landmark.svg";

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

// Countdown badge (US-027) — only shown for events starting within the
// next 48 hours, updates every minute so "hours and minutes" stay live.
function useCountdown(fullDate?: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!fullDate) return;
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, [fullDate]);

  if (!fullDate) return null;
  const target = new Date(fullDate).getTime();
  if (Number.isNaN(target)) return null;
  const diffMs = target - now;
  const fortyEightHoursMs = 48 * 60 * 60 * 1000;
  if (diffMs <= 0 || diffMs > fortyEightHoursMs) return null;

  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes}m`;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const countdown = useCountdown(event.fullDate);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Date Block */}
      <View style={styles.dateBlock}>
        <Text style={styles.dateNum}>{event.date}</Text>
        <Text style={styles.dateMonth}>{event.month?.slice(0, 3)}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          {countdown && (
            <View style={styles.countdownChip}>
              <Ionicons name="time" size={9} color={Colors.white} />
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Ionicons name="location" size={10} color="#F64447" />
            <Text style={styles.meta} numberOfLines={1}>
              {event.distance ? `${event.distance} · ` : ""}
              {event.location}
            </Text>
          </View>
          <View style={styles.row}>
            <LandmarkIcon width={11} height={11} color="#F64447" />
            <Text style={styles.meta} numberOfLines={1}>
              {event.type} · {event.price}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  dateBlock: {
    width: 46,
    height: 46,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  dateNum: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 20,
  },
  dateMonth: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  countdownChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#D9534F",
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countdownText: { color: Colors.white, fontSize: 9, fontWeight: "700" },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    flexShrink: 1,
  },
  column: {
    flexDirection: "column",
    rowGap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  meta: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
});

export default EventCard;
//
