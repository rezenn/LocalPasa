// app/(dashboard)/map.tsx
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
  Keyboard,
  Modal,
  Animated,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useSites } from "../../hooks/useApi";
import { Site as ApiSite } from "../../api/sites.api";
import { Site } from "../../types";
import FilterPanel, {
  DEFAULT_FILTERS,
  ExploreFilters,
  isFiltersActive,
} from "../../components/common/FilterPanel";
import { filterSites } from "../../utils/exploreFilters";

const { width, height } = Dimensions.get("window");

const CATEGORY_FILTERS = [
  "All",
  "Temple",
  "Monastery",
  "Stupa",
  "Palace",
  "Museum",
];
const CITY_FILTERS = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];

type SiteType = ApiSite;

// Approximate city centers used as a fallback when a site document has no
// (or invalid) coordinates set. Keeps every site visible on the map instead
// of silently disappearing — which is what was causing only a handful of
// markers (sometimes just one) to ever render.
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  kathmandu: { lat: 27.7172, lng: 85.324 },
  lalitpur: { lat: 27.6588, lng: 85.3247 },
  patan: { lat: 27.6588, lng: 85.3247 },
  bhaktapur: { lat: 27.671, lng: 85.4298 },
  pokhara: { lat: 28.2096, lng: 83.9856 },
  solukhumbu: { lat: 27.8067, lng: 86.7112 },
  lumbini: { lat: 27.4833, lng: 83.2767 },
  dolpa: { lat: 29.03, lng: 82.9 },
  manang: { lat: 28.6667, lng: 84.0167 },
  rasuwa: { lat: 28.1167, lng: 85.3667 },
  mugu: { lat: 29.5333, lng: 82.1333 },
  gorkha: { lat: 28.0, lng: 84.6333 },
  mustang: { lat: 28.9974, lng: 83.8163 },
  janakpur: { lat: 26.7288, lng: 85.9266 },
  sanga: { lat: 27.6572, lng: 85.5493 },
  chitwan: { lat: 27.5291, lng: 84.3542 },
};

// Geographic center of Nepal — last-resort fallback for an unrecognized city.
const NEPAL_CENTER = { lat: 28.3949, lng: 84.124 };

// Deterministic small offset (derived from the site's own id) so multiple
// un-mapped sites that fall back to the same city center don't stack
// exactly on top of one another and hide each other.
function hashOffset(seed: string): { dLat: number; dLng: number } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
  const radius = 0.01 + (Math.abs(hash) % 100) / 6000; // roughly 1–2.5km spread
  return {
    dLat: Math.cos(angle) * radius,
    dLng: Math.sin(angle) * radius,
  };
}

// Helper function to get coordinates from a site. Returns real coordinates
// when present and valid; otherwise falls back to an approximate position
// near the site's city so it still shows up on the map.
const getSiteCoordinates = (
  site: SiteType,
): { lat: number; lng: number; approximate: boolean } | null => {
  const rawLat =
    (site as any).coordinates?.lat ??
    (site as any).latitude ??
    (site as any).locationLat;
  const rawLng =
    (site as any).coordinates?.lng ??
    (site as any).longitude ??
    (site as any).locationLng;

  const lat = Number(rawLat);
  const lng = Number(rawLng);
  if (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    (lat !== 0 || lng !== 0)
  ) {
    return { lat, lng, approximate: false };
  }

  if (!site?._id && !site?.name) return null;

  const cityKey = (site.city || "").trim().toLowerCase();
  const base = CITY_COORDINATES[cityKey] ?? NEPAL_CENTER;
  const { dLat, dLng } = hashOffset(site._id || site.name || "");
  return { lat: base.lat + dLat, lng: base.lng + dLng, approximate: true };
};

// Helper to get icon name based on site type
const getSiteIcon = (type?: string): any => {
  const typeLower = type?.toLowerCase() || "";
  if (typeLower === "temple") return "location";
  if (typeLower === "monastery") return "school";
  if (typeLower === "stupa") return "triangle";
  if (typeLower === "palace") return "business";
  return "location";
};

// Custom Marker Component
const CustomMarker: React.FC<{
  site: SiteType;
  isSelected: boolean;
  onPress: (site: SiteType) => void;
}> = ({ site, isSelected, onPress }) => {
  const coords = getSiteCoordinates(site);
  const isMustVisit = (site as any).mustVisit || false;
  const isHiddenGem = (site as any).isHiddenGem || false;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isSelected) {
      pulseAnim.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
      pulseAnim.setValue(0);
    };
  }, [isSelected, pulseAnim]);

  if (!coords) return null;

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.8],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 0],
  });

  return (
    <Marker
      coordinate={{
        latitude: coords.lat,
        longitude: coords.lng,
      }}
      onPress={() => onPress(site)}
      tracksViewChanges={isSelected}
    >
      <View style={styles.markerWrapper}>
        {isSelected && (
          <Animated.View
            style={[
              styles.markerPulse,
              {
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          >
            <View style={styles.pulseRing} />
          </Animated.View>
        )}
        <View
          style={[
            styles.markerContainer,
            isSelected && styles.markerSelected,
            isMustVisit && styles.markerMustVisit,
            isHiddenGem && styles.markerHiddenGem,
            coords.approximate && styles.markerApproximate,
          ]}
        >
          {isMustVisit && (
            <View style={styles.markerBadge}>
              <Ionicons name="star" size={10} color="#FFF" />
            </View>
          )}
          {!isMustVisit && isHiddenGem && (
            <View style={[styles.markerBadge, styles.markerBadgeGem]}>
              <Ionicons name="diamond" size={9} color="#FFF" />
            </View>
          )}
          <Ionicons
            name={getSiteIcon(site.type)}
            size={16}
            color={isMustVisit || isHiddenGem ? "#FFF" : Colors.primary}
          />
        </View>
      </View>
    </Marker>
  );
};

export default function MapScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] =
    useState<ExploreFilters>(DEFAULT_FILTERS);
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] =
    useState<ExploreFilters>(DEFAULT_FILTERS);
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 27.7103,
    longitude: 85.3222,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const filterAnim = useRef(new Animated.Value(0)).current;

  const {
    data,
    loading,
    error: apiError,
    refetch,
  } = useSites({
    type: selectedCategory === "All" ? undefined : selectedCategory,
    city: selectedCity === "All" ? undefined : selectedCity,
    limit: 100,
  });

  const sites = data?.sites ?? [];

  // Convert API sites to the format expected by filterSites
  const displaySites = useMemo(() => {
    return filterSites(
      sites as any as Site[],
      search,
      appliedAdvancedFilters,
    ) as SiteType[];
  }, [sites, search, appliedAdvancedFilters]);

  // Live counts for the legend, so it reflects what's actually on screen
  // (post search/filter) rather than a static, disconnected key.
  const siteCounts = useMemo(() => {
    let mustVisit = 0;
    let hiddenGem = 0;
    let approximate = 0;
    for (const site of displaySites) {
      if ((site as any).mustVisit) mustVisit++;
      if ((site as any).isHiddenGem) hiddenGem++;
      if (getSiteCoordinates(site)?.approximate) approximate++;
    }
    return {
      total: displaySites.length,
      mustVisit,
      hiddenGem,
      regular: displaySites.length - mustVisit - hiddenGem,
      approximate,
    };
  }, [displaySites]);

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(status === "granted");

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  // Fit map to markers
  const fitToMarkers = useCallback(() => {
    if (displaySites.length === 0 || !isMapReady || !mapRef.current) return;

    const coordinates = displaySites
      .map((site) => {
        const coords = getSiteCoordinates(site);
        if (!coords) return null;
        return {
          latitude: coords.lat,
          longitude: coords.lng,
        };
      })
      .filter(
        (coord): coord is { latitude: number; longitude: number } =>
          coord !== null && coord.latitude !== 0 && coord.longitude !== 0,
      );

    if (coordinates.length === 0) {
      // If no coordinates, use default Kathmandu
      mapRef.current.animateToRegion(
        {
          latitude: 27.7103,
          longitude: 85.3222,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000,
      );
      return;
    }

    const lats = coordinates.map((c) => c.latitude);
    const lngs = coordinates.map((c) => c.longitude);

    const newRegion = {
      latitude: (Math.max(...lats) + Math.min(...lats)) / 2,
      longitude: (Math.max(...lngs) + Math.min(...lngs)) / 2,
      latitudeDelta: Math.max(...lats) - Math.min(...lats) + 0.05,
      longitudeDelta: Math.max(...lngs) - Math.min(...lngs) + 0.05,
    };

    mapRef.current.animateToRegion(newRegion, 1000);
  }, [displaySites, isMapReady]);

  // Center on user location
  const centerOnUser = useCallback(async () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    } else if (hasLocationPermission) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userLoc);
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...userLoc,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000,
          );
        }
      } catch (error) {
        Alert.alert("Location Error", "Unable to get your current location.");
        console.error("Error getting location:", error);
      }
    } else {
      Alert.alert(
        "Permission Required",
        "Please enable location permissions to use this feature.",
      );
    }
  }, [userLocation, hasLocationPermission]);

  // Handle marker press
  const handleMarkerPress = useCallback((site: SiteType) => {
    setSelectedSite(site);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  // Handle directions
  const handleDirections = useCallback(() => {
    if (selectedSite) {
      const coords = getSiteCoordinates(selectedSite);
      if (coords) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
        Linking.openURL(url).catch(() => {
          Alert.alert("Error", "Unable to open directions.");
          console.warn("Unable to open directions URL", url);
        });
      }
    }
  }, [selectedSite]);

  // Handle site view
  const handleViewSite = useCallback(() => {
    if (selectedSite) {
      router.push(`/site/${selectedSite._id}` as any);
    }
  }, [selectedSite, router]);

  // Toggle filters
  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);
    Animated.spring(filterAnim, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const filterHeight = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 110],
  });

  // Handle map ready
  const onMapReady = useCallback(() => {
    console.log("Map is ready!");
    setIsMapReady(true);
    // Small delay to ensure map is fully rendered
    setTimeout(fitToMarkers, 500);
  }, [fitToMarkers]);

  // The sites request can resolve after the map itself finishes loading (or
  // vice versa), so the timed fitToMarkers() call above can fire before any
  // markers exist. Once both the map is ready and data has arrived, fit the
  // camera to the full set of markers exactly once.
  const hasAutoFitRef = useRef(false);
  useEffect(() => {
    if (isMapReady && displaySites.length > 0 && !hasAutoFitRef.current) {
      hasAutoFitRef.current = true;
      fitToMarkers();
    }
  }, [isMapReady, displaySites.length, fitToMarkers]);

  // Handle map error
  const onMapError = useCallback((error: any) => {
    console.error("Map error:", error);
    setMapError("Failed to load map. Please check your internet connection.");
  }, []);

  // Handle region change
  const onRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  // Show loading state
  if (loading && sites.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading sites...</Text>
      </View>
    );
  }

  // Show error state
  if (apiError || mapError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="map-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.errorText}>{"Failed to load map"}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            setMapError(null);
            refetch();
          }}
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Search bar overlay */}
      <View style={styles.searchOverlay}>
        <View style={styles.searchRow}>
          <Ionicons
            name="search"
            size={18}
            color={Colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places, temples, monasteries..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={toggleFilters} style={styles.filterBtn}>
            <Ionicons name="options" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowAdvancedFilters(true)}
            style={styles.filterBtn}
          >
            <Ionicons
              name="funnel"
              size={19}
              color={
                isFiltersActive(appliedAdvancedFilters)
                  ? Colors.primary
                  : Colors.textMuted
              }
            />
          </TouchableOpacity>
        </View>

        {/* Animated filter chips */}
        <Animated.View
          style={[
            styles.filterPanel,
            { height: filterHeight, overflow: "hidden" },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContent}
          >
            {CATEGORY_FILTERS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.chip,
                  selectedCategory === c && styles.chipActive,
                ]}
                onPress={() => setSelectedCategory(c)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategory === c && styles.chipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContent}
          >
            {CITY_FILTERS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, selectedCity === c && styles.chipActive]}
                onPress={() => setSelectedCity(c)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCity === c && styles.chipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        onMapReady={onMapReady}
        // onError={onMapError}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={false}
        showsBuildings={false}
        showsIndoors={false}
        showsTraffic={false}
        customMapStyle={mapStyle}
        zoomEnabled={true}
        zoomControlEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor={Colors.primary}
        loadingBackgroundColor={Colors.background}
      >
        {/* Render markers */}
        {displaySites.map((site) => {
          const coords = getSiteCoordinates(site);
          if (!coords) return null;

          return (
            <CustomMarker
              key={site._id}
              site={site}
              isSelected={selectedSite?._id === site._id}
              onPress={handleMarkerPress}
            />
          );
        })}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={centerOnUser}>
          <Ionicons name="locate" size={22} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={fitToMarkers}>
          <Ionicons name="resize" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendIcon,
              { backgroundColor: Colors.surface, borderColor: Colors.primary },
            ]}
          >
            <Ionicons name="location" size={10} color={Colors.primary} />
          </View>
          <Text style={styles.legendText}>Cultural Site</Text>
          <Text style={styles.legendCount}>{siteCounts.regular}</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendIcon,
              { backgroundColor: "#2C7A3A", borderColor: "#1a5a2a" },
            ]}
          >
            <Ionicons name="star" size={10} color="#FFF" />
          </View>
          <Text style={styles.legendText}>Must Visit</Text>
          <Text style={styles.legendCount}>{siteCounts.mustVisit}</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendIcon,
              { backgroundColor: "#D4A843", borderColor: "#b8922a" },
            ]}
          >
            <Ionicons name="diamond" size={10} color="#FFF" />
          </View>
          <Text style={styles.legendText}>Hidden Gem</Text>
          <Text style={styles.legendCount}>{siteCounts.hiddenGem}</Text>
        </View>
        {siteCounts.approximate > 0 && (
          <View style={styles.legendNote}>
            <Ionicons
              name="information-circle-outline"
              size={12}
              color={Colors.textMuted}
            />
            <Text style={styles.legendNoteText}>
              {siteCounts.approximate} shown near city center
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Sheet for Site Details */}
      <BottomSheet
        ref={bottomSheetRef}
        index={selectedSite ? 0 : -1}
        snapPoints={["35%", "60%"]}
        enablePanDownToClose={true}
        onClose={() => setSelectedSite(null)}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetHandle}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedSite && (
            <>
              <View style={styles.bottomSheetHeader}>
                <View style={styles.bottomSheetTitleContainer}>
                  <Text style={styles.bottomSheetTitle}>
                    {selectedSite.name}
                  </Text>
                  <View style={styles.bottomSheetMeta}>
                    <Text style={styles.bottomSheetType}>
                      {selectedSite.type || "Site"}
                    </Text>
                    <Text style={styles.bottomSheetDot}>•</Text>
                    <Text style={styles.bottomSheetLocation}>
                      {selectedSite.city || "Location"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.bottomSheetClose}
                  onPress={() => {
                    setSelectedSite(null);
                    bottomSheetRef.current?.close();
                  }}
                >
                  <Ionicons name="close" size={24} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {(selectedSite as any).rating && (
                <View style={styles.bottomSheetRating}>
                  <Ionicons name="star" size={16} color="#F5A623" />
                  <Text style={styles.bottomSheetRatingText}>
                    {(selectedSite as any).rating.toFixed(1)}
                  </Text>
                  <Text style={styles.bottomSheetRatingCount}>
                    ({(selectedSite as any).ratingCount || 0} reviews)
                  </Text>
                </View>
              )}

              {(selectedSite as any).summary && (
                <Text style={styles.bottomSheetDescription} numberOfLines={2}>
                  {(selectedSite as any).summary}
                </Text>
              )}

              {getSiteCoordinates(selectedSite)?.approximate && (
                <View style={styles.approximateNote}>
                  <Ionicons
                    name="information-circle-outline"
                    size={13}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.approximateNoteText}>
                    Exact location not mapped yet — pin is an approximate
                    position near {selectedSite.city || "the area"}.
                  </Text>
                </View>
              )}

              <View style={styles.bottomSheetActions}>
                <TouchableOpacity
                  style={styles.bottomSheetActionPrimary}
                  onPress={handleViewSite}
                >
                  <Ionicons name="eye" size={18} color="#FFF" />
                  <Text style={styles.bottomSheetActionPrimaryText}>
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomSheetActionSecondary}
                  onPress={handleDirections}
                >
                  <Ionicons name="navigate" size={18} color={Colors.primary} />
                  <Text style={styles.bottomSheetActionSecondaryText}>
                    Directions
                  </Text>
                </TouchableOpacity>
              </View>

              {((selectedSite as any).mustVisit ||
                (selectedSite as any).isHiddenGem) && (
                <View style={styles.bottomSheetBadges}>
                  {(selectedSite as any).mustVisit && (
                    <View style={styles.badgeMustVisit}>
                      <Ionicons name="star" size={12} color="#FFF" />
                      <Text style={styles.badgeText}>Must Visit</Text>
                    </View>
                  )}
                  {(selectedSite as any).isHiddenGem && (
                    <View style={styles.badgeHiddenGem}>
                      <Ionicons name="diamond" size={12} color="#FFF" />
                      <Text style={styles.badgeText}>Hidden Gem</Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* Advanced Filters Modal */}
      <Modal
        visible={showAdvancedFilters}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAdvancedFilters(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <FilterPanel
            filters={advancedFilters}
            onChange={setAdvancedFilters}
            onApply={() => {
              setAppliedAdvancedFilters(advancedFilters);
              setShowAdvancedFilters(false);
            }}
            onReset={() => {
              setAdvancedFilters(DEFAULT_FILTERS);
              setAppliedAdvancedFilters(DEFAULT_FILTERS);
            }}
            showEventType={false}
          />
        </SafeAreaView>
      </Modal>
    </GestureHandlerRootView>
  );
}

// Map Style - Clean modern design
const mapStyle = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#333333" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }, { visibility: "on" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{ color: "#fefefe" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d3d3d3" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f0eb" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e8e8e8" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [{ color: "#f0f0f0" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d4e3e8" }],
  },
];

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    flex: 1,
    width: width,
    height: height,
  },
  searchOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 100,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    ...Shadow.md,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Inter-Regular",
  },
  filterBtn: {
    padding: 8,
    marginLeft: 4,
  },
  filterPanel: {
    paddingBottom: 8,
  },
  chipScroll: {
    marginBottom: 4,
  },
  chipContent: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadow.sm,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "Inter-Medium",
  },
  chipTextActive: {
    color: Colors.white,
  },
  controls: {
    position: "absolute",
    right: Spacing.lg,
    top: Platform.OS === "ios" ? 140 : 130,
    zIndex: 50,
    gap: 8,
  },
  controlBtn: {
    backgroundColor: Colors.surface,
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
  },
  legend: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 120 : 100,
    right: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 10,
    ...Shadow.sm,
    gap: 6,
    zIndex: 40,
    maxWidth: 170,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter-Regular",
    flex: 1,
  },
  legendCount: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.text,
    fontFamily: "Inter-SemiBold",
  },
  legendNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendNoteText: {
    fontSize: 9.5,
    color: Colors.textMuted,
    fontFamily: "Inter-Regular",
    flex: 1,
    flexWrap: "wrap",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  retryBtnText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "CrimsonBold",
    color: Colors.text,
  },
  // Marker styles
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
    borderWidth: 2,
    borderColor: Colors.white,
    position: "relative",
  },
  markerSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  markerMustVisit: {
    backgroundColor: "#2C7A3A",
    borderColor: "#1a5a2a",
  },
  markerHiddenGem: {
    backgroundColor: "#D4A843",
    borderColor: "#b8922a",
  },
  markerApproximate: {
    opacity: 0.88,
    borderStyle: "dashed",
  },
  markerBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  markerBadgeGem: {
    backgroundColor: "#D4A843",
  },
  markerPulse: {
    position: "absolute",
    width: 60,
    height: 60,
  },
  pulseRing: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: Colors.primary + "40",
    borderWidth: 2,
    borderColor: Colors.primary + "60",
    opacity: 0.6,
  },
  // Bottom Sheet styles
  bottomSheetBackground: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
  },
  bottomSheetHandle: {
    backgroundColor: Colors.border,
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  bottomSheetTitleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    marginBottom: 4,
  },
  bottomSheetMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSheetType: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter-Regular",
  },
  bottomSheetDot: {
    fontSize: 13,
    color: Colors.textMuted,
    marginHorizontal: 6,
  },
  bottomSheetLocation: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter-Regular",
  },
  bottomSheetClose: {
    padding: 4,
  },
  bottomSheetRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  bottomSheetRatingText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
    fontFamily: "Inter-SemiBold",
  },
  bottomSheetRatingCount: {
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: 4,
    fontFamily: "Inter-Regular",
  },
  bottomSheetDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
    fontFamily: "Inter-Regular",
  },
  approximateNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radius.sm,
    padding: 8,
    marginBottom: Spacing.md,
  },
  approximateNoteText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    color: Colors.textMuted,
    fontFamily: "Inter-Regular",
  },
  bottomSheetActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: Spacing.md,
  },
  bottomSheetActionPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
    gap: 8,
  },
  bottomSheetActionPrimaryText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
  bottomSheetActionSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary + "10",
    paddingVertical: 12,
    borderRadius: Radius.md,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  bottomSheetActionSecondaryText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
  bottomSheetBadges: {
    flexDirection: "row",
    gap: 8,
  },
  badgeMustVisit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C7A3A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  badgeHiddenGem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4A843",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
});
