import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { Event } from "../../types";

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Date Block */}
      <View style={styles.dateBlock}>
        <Text style={styles.dateNum}>{event.date}</Text>
        <Text style={styles.dateMonth}>{event.month}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.row}>
          <Ionicons
            name="location-outline"
            size={11}
            color={Colors.textMuted}
          />
          <Text style={styles.meta}>
            {event.distance} · {event.location}
          </Text>
        </View>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{event.type}</Text>
          </View>
          <View style={[styles.tag, styles.tagFree]}>
            <Text style={[styles.tagText, styles.tagFreeText]}>
              {event.price}
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
    backgroundColor: Colors.eventDate,
    borderRadius: Radius.md,
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
    fontSize: 9,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  meta: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  tags: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginTop: 2,
  },
  tag: {
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  tagFree: {
    backgroundColor: Colors.badge,
  },
  tagFreeText: {
    color: Colors.primary,
  },
});

export default EventCard;
