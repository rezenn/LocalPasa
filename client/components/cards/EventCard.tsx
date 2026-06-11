import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { Event } from "../../types";
import LandmarkIcon from "../../assets/icons/landmark.svg";

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
        <View style={styles.column}>
          <View style={styles.row}>
            <Ionicons name="location" size={11} color="#F64447" />
            <Text style={styles.meta} numberOfLines={1}>
              {event.distance} · {event.location}
            </Text>
          </View>
          <View style={styles.row}>
            <LandmarkIcon width={11} height={11} color="#F64447" />{" "}
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
    backgroundColor: Colors.brown,
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
  tags: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginTop: 2,
    flexWrap: "wrap",
  },
  tag: {
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
