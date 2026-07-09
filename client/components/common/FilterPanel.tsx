import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow, Typography } from "../../constants/theme";
import SimpleSlider from "./SimpleSlider";

export interface ExploreFilters {
  maxDistanceKm: number; 
  maxPrice: number; 
  minRating: number; 
  siteTypes: string[];
  artisanTypes: string[];
  eventTypes: string[];
}

export const DEFAULT_FILTERS: ExploreFilters = {
  maxDistanceKm: 10,
  maxPrice: 3000,
  minRating: 0,
  siteTypes: [],
  artisanTypes: [],
  eventTypes: [],
};

export function isFiltersActive(f: ExploreFilters): boolean {
  return (
    f.maxDistanceKm < DEFAULT_FILTERS.maxDistanceKm ||
    f.maxPrice < DEFAULT_FILTERS.maxPrice ||
    f.minRating > 0 ||
    f.siteTypes.length > 0 ||
    f.artisanTypes.length > 0 ||
    f.eventTypes.length > 0
  );
}

const SITE_TYPES = ["Temples", "Parks", "Museums", "Markets"];
const ARTISAN_TYPES = ["Painter", "Wood Carver", "Pottery Maker", "Others"];
const EVENT_TYPES = ["Concert", "Jatra", "Historic Walk", "Others"];

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface FilterPanelProps {
  filters: ExploreFilters;
  onChange: (filters: ExploreFilters) => void;
  onApply: () => void;
  onReset: () => void;
  /** Hide sections that don't apply to the current screen (e.g. Map has no event list). */
  showEventType?: boolean;
}

export default function FilterPanel({
  filters,
  onChange,
  onApply,
  onReset,
  showEventType = true,
}: FilterPanelProps) {
  const set = (patch: Partial<ExploreFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Distance */}
        <Text style={styles.label}>Distance</Text>
        <SimpleSlider
          min={0}
          max={10}
          step={1}
          value={filters.maxDistanceKm}
          onChange={(v) => set({ maxDistanceKm: v })}
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabelText}>0 Km</Text>
          <Text style={styles.rangeLabelText}>{filters.maxDistanceKm} Km</Text>
        </View>

        {/* Price */}
        <Text style={[styles.label, styles.sectionSpacing]}>Price</Text>
        <Text style={styles.priceValue}>
          {filters.maxPrice === 0 ? "Free" : `Rs ${filters.maxPrice}`}
        </Text>
        <SimpleSlider
          min={0}
          max={3000}
          step={100}
          value={filters.maxPrice}
          onChange={(v) => set({ maxPrice: v })}
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabelText}>Free</Text>
          <Text style={styles.rangeLabelText}>Rs 3000</Text>
        </View>

        {/* Star rating */}
        <Text style={[styles.label, styles.sectionSpacing]}>Star Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => set({ minRating: filters.minRating === s ? 0 : s })}
            >
              <Ionicons
                name={s <= filters.minRating ? "star" : "star-outline"}
                size={30}
                color={
                  s <= filters.minRating ? Colors.star : Colors.textMuted
                }
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Site type */}
        <Text style={[styles.label, styles.sectionSpacing]}>Site Type</Text>
        <View style={styles.chipRow}>
          {SITE_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              active={filters.siteTypes.includes(t)}
              onPress={() => set({ siteTypes: toggle(filters.siteTypes, t) })}
            />
          ))}
        </View>

        {/* Artisan type */}
        <Text style={[styles.label, styles.sectionSpacing]}>Artisans Type</Text>
        <View style={styles.chipRow}>
          {ARTISAN_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              active={filters.artisanTypes.includes(t)}
              onPress={() =>
                set({ artisanTypes: toggle(filters.artisanTypes, t) })
              }
            />
          ))}
        </View>

        {/* Event type */}
        {showEventType && (
          <>
            <Text style={[styles.label, styles.sectionSpacing]}>
              Event Type
            </Text>
            <View style={styles.chipRow}>
              {EVENT_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  active={filters.eventTypes.includes(t)}
                  onPress={() =>
                    set({ eventTypes: toggle(filters.eventTypes, t) })
                  }
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>Reset Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onApply} activeOpacity={0.7}>
          <Text style={styles.applyText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  label: { ...Typography.h3, fontFamily: "CrimsonBold", fontSize: 15 },
  sectionSpacing: { marginTop: Spacing.xl },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  rangeLabelText: { ...Typography.caption },
  priceValue: {
    ...Typography.caption,
    textAlign: "center",
    marginBottom: Spacing.xs,
    fontWeight: "600",
    color: Colors.text,
  },
  starsRow: { flexDirection: "row", marginTop: Spacing.sm },
  starIcon: { marginRight: Spacing.sm },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: { fontSize: 13, color: Colors.text, fontWeight: "500" },
  chipTextActive: { color: Colors.white },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  resetText: { fontSize: 14, color: Colors.textSecondary, fontWeight: "500" },
  applyText: { fontSize: 15, color: Colors.primary, fontWeight: "700" },
});
