import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow, Typography } from "../../constants/theme";
import { EXPERIENCES_SEED } from "../../constants/data/experiencesSeed";

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.row, highlight && styles.rowHighlight]}>
      <Text style={[styles.rowLabel, highlight && styles.rowLabelHighlight]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>
        {value}
      </Text>
    </View>
  );
}

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    ref: string;
    experienceId: string;
    date: string;
    time: string;
  }>();

  const experience = useMemo(
    () => EXPERIENCES_SEED.find((e) => e.id === params.experienceId),
    [params.experienceId],
  );

  if (!experience) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Booking details unavailable</Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace("/(dashboard)/explore" as any)}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={44} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your workshop has been successfully booked.
        </Text>

        <View style={styles.card}>
          <Row label="Workshop" value={experience.title} />
          <Row label="Artisan" value={experience.artisanName} />
          <Row label="Date" value={params.date ?? ""} />
          <Row label="Time" value={params.time ?? ""} />
          <Row label="Location" value={experience.location} />
          <Row
            label="Total Paid"
            value={`NPR ${experience.price.toLocaleString()}`}
          />
          <Row label="Booking Reference" value={params.ref ?? ""} highlight />
        </View>

        <Text style={styles.confirmationNote}>
          Confirmation sent to your email.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert(
              "Added to calendar",
              `${experience.title} on ${params.date} at ${params.time}.`,
            )
          }
        >
          <Text style={styles.primaryBtnText}>Add to Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.85}
          onPress={() => router.replace("/(dashboard)/explore" as any)}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.lg },
  errorText: { fontSize: 15, color: Colors.textSecondary },
  content: { flex: 1, padding: Spacing.xl, alignItems: "center" },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.lg,
  },
  title: { ...Typography.h1, textAlign: "center" },
  subtitle: {
    ...Typography.caption,
    textAlign: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowHighlight: { borderBottomWidth: 0, marginTop: Spacing.xs },
  rowLabel: { fontSize: 13, color: Colors.textMuted },
  rowLabelHighlight: { color: Colors.primary, fontWeight: "600" },
  rowValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  rowValueHighlight: { color: Colors.primary, fontWeight: "800" },
  confirmationNote: {
    ...Typography.small,
    textAlign: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  primaryBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  homeBtn: {
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  homeBtnText: { color: Colors.text, fontWeight: "600", fontSize: 15 },
});
