import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Radius,
  Spacing,
  Shadow,
  Typography,
} from "../../constants/theme";
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
  showEventType?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export default function FilterPanel({
  filters,
  onChange,
  onApply,
  onReset,
  showEventType = true,
  visible = false,
  onClose,
}: FilterPanelProps) {
  const set = (patch: Partial<ExploreFilters>) =>
    onChange({ ...filters, ...patch });

  const filterCount = () => {
    let count = 0;
    if (filters.maxDistanceKm < DEFAULT_FILTERS.maxDistanceKm) count++;
    if (filters.maxPrice < DEFAULT_FILTERS.maxPrice) count++;
    if (filters.minRating > 0) count++;
    count += filters.siteTypes.length;
    count += filters.artisanTypes.length;
    count += filters.eventTypes.length;
    return count;
  };

  const FilterContent = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity
          onPress={onClose || onReset}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Distance */}
        <View style={styles.filterSection}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.valueLabel}>{filters.maxDistanceKm} km</Text>
          </View>
          <SimpleSlider
            min={0}
            max={10}
            step={1}
            value={filters.maxDistanceKm}
            onChange={(v) => set({ maxDistanceKm: v })}
          />
        </View>

        {/* Price */}
        <View style={styles.filterSection}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.valueLabel}>
              {filters.maxPrice === 0 ? "Free" : `Rs ${filters.maxPrice}`}
            </Text>
          </View>
          <SimpleSlider
            min={0}
            max={3000}
            step={100}
            value={filters.maxPrice}
            onChange={(v) => set({ maxPrice: v })}
          />
        </View>

        {/* Rating */}
        <View style={styles.filterSection}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Rating</Text>
            <Text style={styles.valueLabel}>
              {filters.minRating > 0 ? `${filters.minRating}+ Stars` : "Any"}
            </Text>
          </View>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() =>
                  set({ minRating: filters.minRating === s ? 0 : s })
                }
                style={styles.starButton}
              >
                <Ionicons
                  name={s <= filters.minRating ? "star" : "star-outline"}
                  size={28}
                  color={
                    s <= filters.minRating ? Colors.star : Colors.textMuted
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Site Type */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Site Type</Text>
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
        </View>

        {/* Artisan Type */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Artisan Type</Text>
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
        </View>

        {/* Event Type */}
        {showEventType && (
          <View style={styles.filterSection}>
            <Text style={styles.label}>Event Type</Text>
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
          </View>
        )}

        <View style={styles.footerSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onReset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onApply} style={styles.applyButton}>
          <Text style={styles.applyText}>
            Apply Filters {filterCount() > 0 && `(${filterCount()})`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (visible !== undefined) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <FilterContent />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  return <FilterContent />;
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: "75%",
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 18,
    fontFamily: "CrimsonBold",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  label: {
    ...Typography.h3,
    fontSize: 16,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    flex: 1,
  },
  valueLabel: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  starsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  starButton: {
    padding: 2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
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
  chipText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "500",
  },
  chipTextActive: {
    color: Colors.white,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  resetText: {
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  applyText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  footerSpacer: {
    height: Spacing.sm,
  },
});
