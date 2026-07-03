import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useSites } from "../../hooks";
import { Site } from "../../types";

const { width, height } = Dimensions.get("window");

const INITIAL_REGION = {
  latitude: 27.7103,
  longitude: 85.3222,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

// Approximate coords for known Kathmandu sites
const SITE_COORDS: Record<string, { latitude: number; longitude: number }> = {
  default: { latitude: 27.7103, longitude: 85.3222 },
};

function getCoords(site: Site, idx: number) {
  const base = SITE_COORDS[site._id] ?? SITE_COORDS.default;
  // Spread markers slightly if no specific coords
  const offset = idx * 0.005;
  return {
    latitude: base.latitude + (idx % 3) * 0.008 - 0.008,
    longitude: base.longitude + (idx % 4) * 0.006 - 0.009,
  };
}

const CITIES = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];
const TYPES = ["All", "Temple", "Monastery", "Stupa", "Palace", "Museum"];

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [mapMode, setMapMode] = useState<"map" | "list">("map");

  const { data, loading } = useSites({
    city: selectedCity === "All" ? undefined : selectedCity,
    type: selectedType === "All" ? undefined : selectedType,
    limit: 30,
    sortBy: "rating",
  });

  const sites = (data?.sites ?? []).filter((s) =>
    search ? s.name.toLowerCase().includes(search.toLowerCase()) : true,
  );

  const handleMarkerPress = (site: Site) => {
    setSelectedSite(site);
  };

  const handleCardPress = (site: Site) => {
    router.push(`/site/${site._id}` as any);
  };

  const focusMarker = (site: Site, idx: number) => {
    const coords = getCoords(site, idx);
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 },
      500,
    );
    setSelectedSite(site);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Explore Map</Text>
            <Text style={styles.headerSub}>{sites.length} places nearby</Text>
          </View>
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                mapMode === "map" && styles.modeBtnActive,
              ]}
              onPress={() => setMapMode("map")}
            >
              <Ionicons
                name="map"
                size={16}
                color={mapMode === "map" ? Colors.white : Colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                mapMode === "list" && styles.modeBtnActive,
              ]}
              onPress={() => setMapMode("list")}
            >
              <Ionicons
                name="list"
                size={16}
                color={mapMode === "list" ? Colors.white : Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
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
          <View style={styles.divider} />
          {TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, selectedType === type && styles.chipActive]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedType === type && styles.chipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : mapMode === "map" ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            initialRegion={INITIAL_REGION}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            showsScale
          >
            {sites.map((site, idx) => {
              const coords = getCoords(site, idx);
              const isSelected = selectedSite?._id === site._id;
              return (
                <Marker
                  key={site._id}
                  coordinate={coords}
                  onPress={() => handleMarkerPress(site)}
                >
                  <View
                    style={[
                      styles.markerPin,
                      isSelected && styles.markerPinActive,
                    ]}
                  >
                    <Ionicons
                      name="location"
                      size={isSelected ? 28 : 22}
                      color={isSelected ? Colors.secondary : Colors.primary}
                    />
                  </View>
                  <Callout onPress={() => handleCardPress(site)}>
                    <View style={styles.callout}>
                      <Text style={styles.calloutName}>{site.name}</Text>
                      <Text style={styles.calloutSub}>{site.location}</Text>
                      {site.rating ? (
                        <View style={styles.calloutRating}>
                          <Ionicons
                            name="star"
                            size={12}
                            color={Colors.secondary}
                          />
                          <Text style={styles.calloutRatingText}>
                            {site.rating.toFixed(1)}
                          </Text>
                        </View>
                      ) : null}
                      <Text style={styles.calloutCta}>Tap to view →</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>

          {/* Bottom sites strip */}
          {sites.length > 0 && (
            <View style={styles.bottomStrip}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stripContent}
              >
                {sites.map((site, idx) => {
                  const isSelected = selectedSite?._id === site._id;
                  return (
                    <TouchableOpacity
                      key={site._id}
                      style={[
                        styles.stripCard,
                        isSelected && styles.stripCardActive,
                      ]}
                      onPress={() => focusMarker(site, idx)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.stripCardInner}>
                        <Text
                          style={[
                            styles.stripName,
                            isSelected && styles.stripNameActive,
                          ]}
                          numberOfLines={1}
                        >
                          {site.name}
                        </Text>
                        <Text style={styles.stripLoc} numberOfLines={1}>
                          {site.location}
                        </Text>
                        <View style={styles.stripMeta}>
                          {site.rating ? (
                            <View style={styles.stripRating}>
                              <Ionicons
                                name="star"
                                size={10}
                                color={Colors.secondary}
                              />
                              <Text style={styles.stripRatingText}>
                                {site.rating.toFixed(1)}
                              </Text>
                            </View>
                          ) : null}
                          <Text style={styles.stripPrice}>{site.price}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.stripGo}
                        onPress={() => handleCardPress(site)}
                      >
                        <Ionicons
                          name="arrow-forward"
                          size={14}
                          color={Colors.white}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      ) : (
        // List mode
        <ScrollView
          style={styles.listScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {sites.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="search-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No sites found</Text>
            </View>
          ) : (
            sites.map((site) => (
              <TouchableOpacity
                key={site._id}
                style={styles.listCard}
                onPress={() => handleCardPress(site)}
                activeOpacity={0.8}
              >
                <View style={styles.listCardIcon}>
                  <Ionicons name="location" size={20} color={Colors.primary} />
                </View>
                <View style={styles.listCardBody}>
                  <Text style={styles.listCardName}>{site.name}</Text>
                  <Text style={styles.listCardLoc}>{site.location}</Text>
                  <View style={styles.listCardMeta}>
                    {site.rating ? (
                      <View style={styles.ratingRow}>
                        <Ionicons
                          name="star"
                          size={12}
                          color={Colors.secondary}
                        />
                        <Text style={styles.ratingText}>
                          {site.rating.toFixed(1)}
                        </Text>
                      </View>
                    ) : null}
                    <View style={[styles.typeBadge]}>
                      <Text style={styles.typeBadgeText}>
                        {site.type ?? "Site"}
                      </Text>
                    </View>
                    <Text style={styles.priceText}>{site.price}</Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  headerLeft: {},
  headerTitle: { fontSize: 22, color: Colors.white, fontFamily: "CrimsonBold" },
  headerSub: { fontSize: 12, color: "#E2DBDB", marginTop: 2 },
  modeSwitcher: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    padding: 3,
  },
  modeBtn: { padding: 8, borderRadius: Radius.full },
  modeBtnActive: { backgroundColor: Colors.primary },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, padding: 0 },
  filtersWrap: { paddingTop: Spacing.sm, paddingBottom: 2 },
  filterRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  chipTextActive: { color: Colors.white, fontWeight: "700" },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  mapContainer: { flex: 1 },
  map: { width, flex: 1 },
  markerPin: { alignItems: "center" },
  markerPinActive: { transform: [{ scale: 1.2 }] },
  callout: { width: 180, padding: Spacing.sm },
  calloutName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  calloutSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  calloutRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  calloutRatingText: { fontSize: 12, color: Colors.text, fontWeight: "600" },
  calloutCta: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 6,
    fontWeight: "600",
  },
  bottomStrip: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Spacing.md,
    backgroundColor: "transparent",
  },
  stripContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingTop: 8,
  },
  stripCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    width: 200,
    ...Shadow.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  stripCardActive: { borderColor: Colors.primary },
  stripCardInner: { flex: 1 },
  stripName: { fontSize: 13, fontWeight: "700", color: Colors.text },
  stripNameActive: { color: Colors.primary },
  stripLoc: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  stripMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: 4,
  },
  stripRating: { flexDirection: "row", alignItems: "center", gap: 2 },
  stripRatingText: { fontSize: 11, color: Colors.text, fontWeight: "600" },
  stripPrice: { fontSize: 11, color: Colors.textMuted },
  stripGo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  listScroll: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  listCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0EAE2",
    alignItems: "center",
    justifyContent: "center",
  },
  listCardBody: { flex: 1 },
  listCardName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  listCardLoc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  listCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: 4,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, color: Colors.text, fontWeight: "600" },
  typeBadge: {
    backgroundColor: "#F0EAE2",
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeBadgeText: { fontSize: 10, color: Colors.primary, fontWeight: "600" },
  priceText: { fontSize: 11, color: Colors.textMuted },
  emptyBox: { alignItems: "center", marginTop: 80, gap: Spacing.sm },
  emptyText: { fontSize: 15, color: Colors.textMuted },
});
