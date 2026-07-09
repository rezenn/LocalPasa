import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow, Typography } from "../../constants/theme";
import { Booking, useBookings } from "../../context/BookingsContext";

function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="sparkles" size={16} color={Colors.primary} />
        <Text style={styles.cardTitle} numberOfLines={1}>
          {booking.experienceTitle}
        </Text>
      </View>
      <Text style={styles.cardArtisan}>with {booking.artisanName}</Text>
      <View style={styles.cardRow}>
        <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.cardRowText}>{booking.date}</Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.cardRowText}>{booking.time}</Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.cardRowText}>{booking.location}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardRef}>Ref: {booking.id}</Text>
        <Text style={styles.cardPrice}>NPR {booking.totalPaid.toLocaleString()}</Text>
      </View>
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() =>
          Alert.alert(
            "Cancel booking?",
            `This will remove your booking for ${booking.experienceTitle}.`,
            [
              { text: "Keep booking", style: "cancel" },
              { text: "Cancel booking", style: "destructive", onPress: onCancel },
            ],
          )
        }
      >
        <Text style={styles.cancelBtnText}>Cancel Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MyExperiencesScreen() {
  const router = useRouter();
  const { bookings, loading, removeBooking } = useBookings();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Experiences</Text>
          <Text style={styles.headerSub}>{bookings.length} booked</Text>
        </View>
      </View>

      {!loading && bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="sparkles-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No experiences booked yet</Text>
          <Text style={styles.emptySubtitle}>
            Book a hands-on workshop with a local artisan to see it here.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/experiences-list" as any)}
          >
            <Text style={styles.browseBtnText}>Browse Experiences</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookingCard booking={item} onCancel={() => removeBooking(item.id)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontFamily: "CrimsonBold", color: Colors.white },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  list: { padding: Spacing.lg, gap: Spacing.lg },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.xs },
  cardTitle: { ...Typography.h3, flex: 1 },
  cardArtisan: { ...Typography.caption, marginBottom: Spacing.sm },
  cardRow: { flexDirection: "row", alignItems: "center", gap: Spacing.xs, marginTop: 4 },
  cardRowText: { fontSize: 12, color: Colors.textSecondary },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardRef: { fontSize: 11, color: Colors.textMuted },
  cardPrice: { fontSize: 14, fontWeight: "800", color: Colors.text },
  cancelBtn: { marginTop: Spacing.md, alignItems: "center" },
  cancelBtnText: { color: Colors.error, fontSize: 13, fontWeight: "600" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyTitle: { ...Typography.h3, marginTop: Spacing.sm },
  emptySubtitle: { ...Typography.caption, textAlign: "center" },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
  },
  browseBtnText: { color: Colors.white, fontWeight: "700" },
});
