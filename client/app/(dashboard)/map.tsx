import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import SiteCard from "../../components/cards/SiteCard";
import { useSites } from "../../hooks";
import { Site } from "../../types";

const CITIES = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];
const TYPES = ["All", "Temple", "Monastery", "Stupa", "Palace", "Museum"];

export default function MapScreen() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = React.useState("All");
  const [selectedType, setSelectedType] = React.useState("All");

  const { data, loading, error, refetch } = useSites({
    city: selectedCity === "All" ? undefined : selectedCity,
    type: selectedType === "All" ? undefined : selectedType,
    limit: 30,
    sortBy: "rating",
  });

  const sites = data?.sites ?? [];

  const handleSitePress = (site: Site) => {
    router.push(`/site/${site._id}` as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Sites</Text>
        <Text style={styles.headerSub}>Browse all cultural heritage sites</Text>
      </View>

      {/* City filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {CITIES.map((city) => (
          <TouchableOpacity
            key={city}
            style={[styles.chip, selectedCity === city && styles.chipActive]}
            onPress={() => setSelectedCity(city)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCity === city && styles.chipTextActive,
              ]}
            >
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.chipSm, selectedType === type && styles.chipActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.chipTextSm,
                selectedType === type && styles.chipTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            color={Colors.primary}
            size="large"
          />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Failed to load sites</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : sites.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="map-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No sites found</Text>
          </View>
        ) : (
          <View style={styles.cardGrid}>
            {/* {sites.map((site) => (
              <SiteCard
                key={site._id}
                site={site}
                onPress={() => handleSitePress(site)}
              />
            ))} */}
          </View>
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
  headerTitle: { fontSize: 22, color: Colors.white, fontFamily: "CrimsonBold" },
  headerSub: { fontSize: 12, color: "#E2DBDB", marginTop: 2 },
  filterRow: { maxHeight: 44, marginTop: Spacing.sm },
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
  chipSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "500" },
  chipTextSm: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  chipTextActive: { color: Colors.white, fontWeight: "700" },
  grid: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  loader: { marginTop: 60 },
  errorBox: { alignItems: "center", marginTop: 60, gap: Spacing.md },
  errorText: { fontSize: 15, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
  emptyBox: { alignItems: "center", marginTop: 60, gap: Spacing.sm },
  emptyText: { fontSize: 15, color: Colors.textMuted },
  bottomPad: { height: 40 },
});
