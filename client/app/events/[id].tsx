import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useEvent } from "../../hooks/useApi";
import { savedApi } from "../../api/index";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [going, setGoing] = useState(false);

  const { data: event, loading, error } = useEvent(id ?? "");

  const toggleSave = async () => {
    try {
      if (saved) {
        await savedApi.remove(id!, "event");
        setSaved(false);
      } else {
        await savedApi.save(id!, "event");
        setSaved(true);
      }
    } catch {
      Alert.alert("Error", "Could not update saved items.");
    }
  };

  if (loading)
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.primary}
          size="large"
        />
      </SafeAreaView>
    );

  if (error || !event)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={Colors.error}
          />
          <Text style={styles.errorText}>Could not load event details</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  // Demo lineup data
  const lineup = [
    { time: "5pm - 6pm", act: "Cultural Show", stage: "Main Stage" },
    { time: "6pm - 7pm", act: "DJ ABH", stage: "Second Stage" },
    { time: "7pm - 8pm", act: "Singer John and Band", stage: "Main Stage" },
    { time: "8pm - 11pm", act: "The J05 Band", stage: "Main Stage" },
    { time: "10pm - 11pm", act: "DJ H8D", stage: "Second Stage" },
    { time: "11pm - 1am", act: "Kathuma Band", stage: "Main Stage" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={{
              uri:
                event.image ||
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.75)"]}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{event.type}</Text>
            </View>
            <Text style={styles.heroTitle}>{event.title}</Text>
            <View style={styles.heroMeta}>
              <Ionicons
                name="location"
                size={13}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.heroMetaText}>
                {event.city || event.location}
              </Text>
              <View style={styles.heroDivider} />
              <Ionicons
                name="pricetag"
                size={13}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.heroMetaText}>{event.price}</Text>
            </View>
          </View>
        </View>

        {/* Date banner */}
        <View style={styles.dateBanner}>
          <View style={styles.dateBox}>
            <Ionicons name="calendar" size={16} color={Colors.primary} />
            <Text style={styles.dateText}>
              {event.date && event.month
                ? `${event.date} ${event.month}`
                : event.fullDate || "April 15, 2026"}
            </Text>
          </View>
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={12} color={Colors.primary} />
            <Text style={styles.distanceText}>
              {event.distance || "0.9 Km away"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Event</Text>
          <Text style={styles.bodyText}>
            {event.description ||
              "Experience the vibrant culture of Nepal through this spectacular event. Join thousands of locals and tourists for an unforgettable celebration of heritage, music, and tradition."}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={16} color={Colors.error} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationName}>{event.location}</Text>
                <Text style={styles.locationCity}>
                  {event.city || "Kathmandu"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.openMapBtn}>
              <Text style={styles.openMapText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Lineup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Lineup</Text>
          <View style={styles.lineupCard}>
            {lineup.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.lineupRow,
                  i < lineup.length - 1 && styles.lineupBorder,
                ]}
              >
                <Text style={styles.lineupTime}>{item.time}</Text>
                <Text style={styles.lineupAct} numberOfLines={1}>
                  {item.act}
                </Text>
                <View style={styles.lineupStageBadge}>
                  <Text style={styles.lineupStageText}>{item.stage}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={toggleSave}>
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={20}
            color={saved ? "#FF6B6B" : Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.goingBtn, going && styles.goingBtnActive]}
          onPress={() => setGoing(!going)}
        >
          <Ionicons
            name={going ? "checkmark-circle" : "checkmark-circle-outline"}
            size={18}
            color={Colors.white}
          />
          <Text style={styles.goingBtnText}>
            {going ? "Going ✓" : "I am Going"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="call-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: { height: 280, position: "relative" },
  heroImage: { width: "100%", height: 280 },
  gradient: { ...StyleSheet.absoluteFillObject },
  backBtn: {
    position: "absolute",
    top: 48,
    left: Spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: 6,
  },
  typeBadgeText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  heroTitle: {
    fontSize: 22,
    fontFamily: "CrimsonBold",
    color: Colors.white,
    marginBottom: 6,
  },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  heroMetaText: { fontSize: 12, color: "rgba(255,255,255,0.85)" },
  heroDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  dateBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  dateBox: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateText: { fontSize: 14, fontWeight: "600", color: Colors.text },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary + "12",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  distanceText: { fontSize: 12, color: Colors.primary, fontWeight: "600" },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bodyText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  locationCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: Spacing.sm,
  },
  locationName: { fontSize: 14, fontWeight: "600", color: Colors.text },
  locationCity: { fontSize: 12, color: Colors.textMuted },
  openMapBtn: {
    backgroundColor: Colors.primary + "12",
    borderRadius: Radius.md,
    paddingVertical: 8,
    alignItems: "center",
  },
  openMapText: { color: Colors.primary, fontWeight: "700", fontSize: 13 },
  lineupCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    ...Shadow.sm,
    overflow: "hidden",
  },
  lineupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  lineupBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  lineupTime: { fontSize: 11, color: Colors.textMuted, width: 90 },
  lineupAct: { flex: 1, fontSize: 13, fontWeight: "600", color: Colors.text },
  lineupStageBadge: {
    backgroundColor: Colors.primary + "12",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  lineupStageText: { fontSize: 10, color: Colors.primary, fontWeight: "600" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.md,
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goingBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 12,
  },
  goingBtnActive: { backgroundColor: "#2C7A3A" },
  goingBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: { fontSize: 15, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: { color: Colors.white, fontWeight: "700" },
});
