import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useEvent } from "../../hooks/useApi";
import { savedApi } from "../../api/index";
import { ApiError } from "../../api/client";

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [going, setGoing] = useState(false);

  const { data: event, loading, error } = useEvent(id ?? "");

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      if (saved) {
        await savedApi.remove(id, "event");
        setSaved(false);
      } else {
        await savedApi.save(id, "event");
        setSaved(true);
      }
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.primary}
          size="large"
        />
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errBox}>
          <Ionicons
            name="alert-circle-outline"
            size={56}
            color={Colors.border}
          />
          <Text style={styles.errText}>Event not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.errBtn}>
            <Text style={styles.errBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFree = event.price === "Free" || event.price === "Free Entry";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.heroImg} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons
                name="musical-notes"
                size={60}
                color="rgba(255,255,255,0.4)"
              />
            </View>
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.navRight}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={handleSave}
                disabled={saving}
              >
                <Ionicons
                  name={saved ? "heart" : "heart-outline"}
                  size={20}
                  color={saved ? "#FF6B6B" : Colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <Ionicons name="share-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Date badge */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeNum}>{event.date}</Text>
            <Text style={styles.dateBadgeMonth}>{event.month}</Text>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Title & tags */}
          <View style={styles.titleSection}>
            <View style={styles.tagRow}>
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>{event.type}</Text>
              </View>
              <View
                style={[
                  styles.typePill,
                  isFree ? styles.freePill : styles.paidPill,
                ]}
              >
                <Text
                  style={[
                    styles.typePillText,
                    isFree ? styles.freeText : styles.paidText,
                  ]}
                >
                  {event.price}
                </Text>
              </View>
            </View>
            <Text style={styles.title}>{event.title}</Text>
          </View>

          {/* Info grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {event.fullDate || `${event.date} ${event.month}`}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
                {event.city ? (
                  <Text style={styles.infoSub}>{event.city}</Text>
                ) : null}
              </View>
            </View>
            {event.organizer ? (
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Organizer</Text>
                  <Text style={styles.infoValue}>{event.organizer}</Text>
                </View>
              </View>
            ) : null}
            {event.contact ? (
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Contact</Text>
                  <Text style={styles.infoValue}>{event.contact}</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Description */}
          {event.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this Event</Text>
              <Text style={styles.descText}>{event.description}</Text>
            </View>
          ) : null}
          {event.longDescription &&
          event.longDescription !== event.description ? (
            <Text style={styles.descText}>{event.longDescription}</Text>
          ) : null}

          {/* Map placeholder */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapBox}>
              <Ionicons name="map" size={40} color={Colors.border} />
              <Text style={styles.mapText}>{event.location}</Text>
            </View>
          </View>

          {/* Website */}
          {event.website ? (
            <TouchableOpacity style={styles.websiteBtn}>
              <Ionicons name="globe-outline" size={16} color={Colors.primary} />
              <Text style={styles.websiteBtnText}>Visit Website</Text>
              <Ionicons name="open-outline" size={14} color={Colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
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
            {going ? "I'm Going ✓" : "I'm Going"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareFooterBtn}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveFooterBtn}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={20}
            color={saved ? "#FF6B6B" : Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: { height: 260, position: "relative" },
  heroImg: { width: "100%", height: "100%" },
  heroPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.brown,
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  topNav: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: { flexDirection: "row", gap: Spacing.sm },
  dateBadge: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.brown,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  dateBadgeNum: { color: Colors.white, fontSize: 22, fontWeight: "800" },
  dateBadgeMonth: {
    color: "#E2DBDB",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  titleSection: { marginBottom: Spacing.lg },
  tagRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.sm },
  typePill: {
    backgroundColor: "#F0EAE2",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  typePillText: { fontSize: 11, color: Colors.primary, fontWeight: "600" },
  freePill: { backgroundColor: "#E8F5E9" },
  freeText: { color: "#2C7A3A" },
  paidPill: { backgroundColor: "#FFF8E7" },
  paidText: { color: "#B8860B" },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    lineHeight: 32,
  },
  infoGrid: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoItem: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "600",
    marginTop: 1,
  },
  infoSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  linkText: { fontSize: 13, color: Colors.primary, fontWeight: "500" },
  descText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  mapBox: {
    height: 130,
    backgroundColor: "#E8F0E8",
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapText: { color: Colors.textMuted, marginTop: Spacing.xs, fontSize: 12 },
  websiteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    marginBottom: Spacing.lg,
  },
  websiteBtnText: { fontSize: 14, color: Colors.primary, fontWeight: "700" },
  footer: {
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
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.md,
  },
  goingBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
  },
  goingBtnActive: { backgroundColor: "#2C7A3A" },
  goingBtnText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
  shareFooterBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveFooterBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  errText: { fontSize: 16, color: Colors.text },
  errBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  errBtnText: { color: Colors.white, fontWeight: "600" },
});
