import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Radius,
  Spacing,
  Shadow,
  Typography,
} from "../../constants/theme";
import { EXPERIENCES_SEED } from "../../constants/data/experiencesSeed";
import {
  useBookings,
  generateBookingReference,
} from "../../context/BookingsContext";
import { getValueForMoneyScore } from "../../utils/valueScore";

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? "star" : "star-outline"}
          size={size}
          color={Colors.star}
        />
      ))}
    </View>
  );
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExperienceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addBooking } = useBookings();
  const [saved, setSaved] = useState(false);
  const [booking, setBooking] = useState(false);

  const experience = useMemo(
    () => EXPERIENCES_SEED.find((e) => e.id === id),
    [id],
  );

  const [selectedDate, setSelectedDate] = useState(
    experience?.dateOptions.find((d) => d.available)?.date ??
      experience?.dateOptions[0]?.date ??
      "",
  );
  const [selectedTime, setSelectedTime] = useState(
    experience?.timeOptions[0] ?? "",
  );

  if (!experience) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centered}>
          <Ionicons
            name="sparkles-outline"
            size={48}
            color={Colors.textMuted}
          />
          <Text style={styles.errorText}>Experience not found</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${experience.title} with ${experience.artisanName} — NPR ${experience.price} on LocalPasa`,
      });
    } catch {}
  };

  const handleBookNow = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Select date & time", "Please choose a date and time first.");
      return;
    }
    setBooking(true);
    const reference = generateBookingReference();
    await addBooking({
      id: reference,
      experienceId: experience.id,
      experienceTitle: experience.title,
      artisanName: experience.artisanName,
      date: formatLongDate(selectedDate),
      time: `${selectedTime}${experience.timeOptions.length > 0 ? "" : ""}`,
      location: experience.location,
      totalPaid: experience.price,
      createdAt: new Date().toISOString(),
    });
    setBooking(false);
    router.push(
      `/experience/booking-confirmed?ref=${reference}&experienceId=${experience.id}&date=${encodeURIComponent(
        formatLongDate(selectedDate),
      )}&time=${encodeURIComponent(selectedTime)}` as any,
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: experience.image }} style={styles.hero} />
          <View style={styles.heroTopRow}>
            <TouchableOpacity
              style={styles.heroIconBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: Spacing.sm }}>
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={() =>
                  Alert.alert(
                    "Report a problem",
                    "Let us know if something looks wrong with this listing.",
                  )
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={() => setSaved((s) => !s)}
              >
                <Ionicons
                  name={saved ? "heart" : "heart-outline"}
                  size={20}
                  color={saved ? "#F64447" : Colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{experience.title}</Text>

          <View style={styles.artisanRow}>
            <Image
              source={{ uri: experience.artisanAvatar }}
              style={styles.artisanAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.artisanName}>{experience.artisanName}</Text>
              {!!experience.artisanTitle && (
                <Text style={styles.artisanTitle}>
                  {experience.artisanTitle}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.ratingRow}>
            <StarRating rating={experience.rating} />
            <Text style={styles.ratingText}>
              {experience.rating.toFixed(1)} ({experience.reviewCount} reviews)
            </Text>
            {(() => {
              const value = getValueForMoneyScore(
                experience.price,
                experience.rating,
                experience.reviewCount,
              );
              return (
                <View
                  style={[styles.valueBadge, { backgroundColor: value.color }]}
                >
                  <Text style={styles.valueBadgeText}>{value.label}</Text>
                </View>
              );
            })()}
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{experience.durationLabel}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                Max {experience.maxPeople} People
              </Text>
            </View>
            {experience.materialsIncluded && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Materials Included</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>About This Workshop</Text>
          <Text style={styles.about}>{experience.about}</Text>

          <Text style={styles.sectionTitle}>Choose a Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}
          >
            {experience.dateOptions.map((d) => {
              const active = selectedDate === d.date;
              return (
                <TouchableOpacity
                  key={d.date}
                  disabled={!d.available}
                  onPress={() => setSelectedDate(d.date)}
                  style={[
                    styles.dateChip,
                    active && styles.dateChipActive,
                    !d.available && styles.dateChipDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateChipWeekday,
                      active && styles.dateChipTextActive,
                      !d.available && styles.dateChipTextDisabled,
                    ]}
                  >
                    {d.weekday}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipDay,
                      active && styles.dateChipTextActive,
                      !d.available && styles.dateChipTextDisabled,
                    ]}
                  >
                    {d.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>Choose a Time</Text>
          <View style={styles.timeRow}>
            {experience.timeOptions.map((t) => {
              const active = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      active && styles.timeChipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>
            NPR {experience.price.toLocaleString()}
          </Text>
          <Text style={styles.footerPerPerson}>per person</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.85}
          onPress={handleBookNow}
          disabled={booking}
        >
          <Text style={styles.bookBtnText}>
            {booking ? "Booking…" : "Book Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  errorText: { fontSize: 16, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
  heroWrap: { width: "100%", height: 260 },
  hero: { width: "100%", height: "100%" },
  heroTopRow: {
    position: "absolute",
    top: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: Spacing.lg },
  title: { ...Typography.h1, marginBottom: Spacing.sm },
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  artisanAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  artisanName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  artisanTitle: { fontSize: 12, color: Colors.textMuted },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  ratingText: { fontSize: 12, color: Colors.textSecondary },
  valueBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 4,
  },
  valueBadgeText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tag: {
    backgroundColor: Colors.badge,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  tagText: { fontSize: 11, color: Colors.badgeText, fontWeight: "600" },
  sectionTitle: {
    ...Typography.h3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  about: { ...Typography.body, lineHeight: 21, color: Colors.textSecondary },
  dateRow: { gap: Spacing.sm, paddingBottom: Spacing.xs },
  dateChip: {
    width: 52,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateChipDisabled: { backgroundColor: Colors.background, opacity: 0.5 },
  dateChipWeekday: { fontSize: 11, color: Colors.textMuted },
  dateChipDay: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 2,
  },
  dateChipTextActive: { color: Colors.white },
  dateChipTextDisabled: { color: Colors.textMuted },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  timeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeChipText: { fontSize: 13, color: Colors.text, fontWeight: "500" },
  timeChipTextActive: { color: Colors.white },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.md,
  },
  footerPrice: { fontSize: 18, fontWeight: "800", color: Colors.text },
  footerPerPerson: { fontSize: 11, color: Colors.textMuted },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  bookBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
