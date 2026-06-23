import React, { useState, useRef } from "react";
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
  Animated,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useSites } from "../../hooks/useApi";
import { Site } from "../../types";

const { width } = Dimensions.get("window");

const CATEGORY_FILTERS = [
  "All",
  "Temple",
  "Monastery",
  "Stupa",
  "Palace",
  "Museum",
];
const CITY_FILTERS = ["All", "Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara"];

function buildLeafletHTML(sites: Site[]): string {
  // Site type has no coordinates field — use demo markers until
  // the backend returns lat/lng and the type is extended
  const demoMarkers = [
    {
      lat: 27.7103,
      lng: 85.3222,
      name: "Pashupatinath Temple",
      type: "Temple",
      price: "Varied",
      id: "1",
      mustVisit: true,
    },
    {
      lat: 27.7149,
      lng: 85.2893,
      name: "Swayambhunath Stupa",
      type: "Stupa",
      price: "Varied",
      id: "2",
      mustVisit: true,
    },
    {
      lat: 27.6727,
      lng: 85.3244,
      name: "Patan Durbar Square",
      type: "Palace",
      price: "NPR 1000",
      id: "3",
      mustVisit: true,
    },
    {
      lat: 27.671,
      lng: 85.4298,
      name: "Bhaktapur Durbar Square",
      type: "Palace",
      price: "NPR 1500",
      id: "4",
      mustVisit: true,
    },
    {
      lat: 27.7228,
      lng: 85.3655,
      name: "Kopan Monastery",
      type: "Monastery",
      price: "Free",
      id: "5",
      mustVisit: false,
    },
    {
      lat: 27.7041,
      lng: 85.313,
      name: "Boudhanath Stupa",
      type: "Stupa",
      price: "NPR 400",
      id: "6",
      mustVisit: true,
    },
  ];

  // Use demo markers if no sites provided, otherwise use sites data
  const allMarkers = sites && sites.length > 0 ? sites : demoMarkers;

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; }
  .custom-marker { 
    background: #6B4F3A; border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg); border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .must-visit-marker { background: #2C7A3A; }
  .popup-title { font-weight: 700; font-size: 14px; color: #1A1A1A; margin-bottom: 4px; }
  .popup-sub { font-size: 12px; color: #6B6B6B; }
  .popup-badge { 
    display: inline-block; background: #E8F5E9; color: #2C7A3A;
    font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-top: 4px;
  }
  .leaflet-popup-content-wrapper { border-radius: 12px; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', { zoomControl: false }).setView([27.7103, 85.3222], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  var markers = ${JSON.stringify(allMarkers)};
  markers.forEach(function(m) {
    var iconHtml = '<div class="custom-marker ' + (m.mustVisit ? 'must-visit-marker' : '') + '" style="width:16px;height:16px;"></div>';
    var icon = L.divIcon({ html: iconHtml, iconSize: [22, 22], iconAnchor: [11, 22], className: '' });
    var popupContent = '<div class="popup-title">' + m.name + '</div>' +
      '<div class="popup-sub">' + m.type + ' · ' + m.price + '</div>' +
      (m.mustVisit ? '<div class="popup-badge">Must Visit</div>' : '');
    L.marker([m.lat, m.lng], { icon: icon })
      .addTo(map)
      .bindPopup(popupContent)
      .on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerClick', id: m.id, name: m.name }));
      });
  });
</script>
</body>
</html>`;
}

export default function MapScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSite, setSelectedSite] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const filterAnim = useRef(new Animated.Value(0)).current;

  const { data, loading } = useSites({
    type: selectedCategory === "All" ? undefined : selectedCategory,
    city: selectedCity === "All" ? undefined : selectedCity,
    limit: 50,
  });

  const sites = data?.sites ?? [];

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
    outputRange: [0, 100],
  });

  return (
    <SafeAreaView style={styles.safe}>
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
            <Ionicons name="options" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Animated filter row */}
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
      <WebView
        source={{ html: buildLeafletHTML(sites) }}
        style={styles.map}
        onMessage={(e) => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === "markerClick") {
              setSelectedSite({ id: msg.id, name: msg.name });
            }
          } catch {}
        }}
        javaScriptEnabled
        domStorageEnabled
      />

      {/* Bottom card when marker tapped */}
      {selectedSite && (
        <View style={styles.siteCard}>
          <View style={styles.siteCardInner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.siteCardName}>{selectedSite.name}</Text>
              <Text style={styles.siteCardSub}>Tap to view full details</Text>
            </View>
            <View style={styles.siteCardActions}>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => router.push(`/site/${selectedSite.id}` as any)}
              >
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedSite(null)}>
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#2C7A3A" }]} />
          <Text style={styles.legendText}>Must Visit</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Cultural Site</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  map: { flex: 1 },
  searchOverlay: {
    position: "absolute",
    top: 50,
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
    height: 48,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterBtn: { padding: 6 },
  filterPanel: { paddingBottom: 8 },
  chipScroll: { marginBottom: 4 },
  chipContent: { paddingHorizontal: Spacing.md, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white, fontWeight: "600" },
  siteCard: {
    position: "absolute",
    bottom: 24,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    ...Shadow.md,
  },
  siteCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  siteCardName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    fontFamily: "CrimsonBold",
  },
  siteCardSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  siteCardActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  viewBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  viewBtnText: { color: Colors.white, fontWeight: "600", fontSize: 13 },
  legend: {
    position: "absolute",
    bottom: 90,
    right: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 8,
    ...Shadow.sm,
    gap: 4,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.textSecondary },
});
