import React, { useState, useRef, useEffect } from "react";
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
  Linking,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useSites } from "../../hooks/useApi";
import { Site } from "../../types";

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

function buildLeafletHTML(sites: Site[]): string {
  // Build marker data from sites if coordinates provided, otherwise fall back to demo markers
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

  // build markers from sites when available
  const siteMarkers = (sites || [])
    .map((s) => {
      const siteData = s as Site & Record<string, unknown>;
      const lat =
        (siteData as any).latitude ??
        (siteData as any).lat ??
        (siteData as any).locationLat;
      const lng =
        (siteData as any).longitude ??
        (siteData as any).lng ??
        (siteData as any).locationLng;
      return {
        id: siteData._id,
        name: siteData.name,
        type: (siteData as any).type || "Site",
        price: (siteData as any).price || "Varied",
        mustVisit: !!(siteData as any).mustVisit,
        lat: lat ?? null,
        lng: lng ?? null,
      };
    })
    .filter((m) => m.lat != null && m.lng != null);

  const allMarkers = siteMarkers.length > 0 ? siteMarkers : demoMarkers;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Map</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { 
    width: 100%; 
    height: 100%; 
    overflow: hidden;
    background: #f5f5f5;
  }
  #map { 
    width: 100%; 
    height: 100%; 
    position: absolute;
    top: 0;
    left: 0;
  }
  .leaflet-container { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    background: #f5f5f5;
  }
  .leaflet-popup-content-wrapper { 
    border-radius: 12px; 
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    padding: 0;
    overflow: hidden;
  }
  .leaflet-popup-content {
    margin: 0;
    padding: 12px;
    min-width: 200px;
  }
  .popup-title { 
    font-weight: 700; 
    font-size: 15px; 
    color: #1A1A1A; 
    margin-bottom: 4px; 
  }
  .popup-sub { 
    font-size: 13px; 
    color: #6B6B6B; 
    margin-bottom: 8px; 
  }
  .popup-actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }
  .popup-btn {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
  }
  .popup-btn-primary {
    background: #6B4F3A;
    color: #fff;
  }
  .popup-btn-secondary {
    background: #fff;
    color: #1A1A1A;
    border: 1px solid #ddd;
  }
  .custom-marker {
    background: #6B4F3A;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .custom-marker.must-visit {
    background: #2C7A3A;
  }
  .controls {
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    z-index: 1000;
    display: flex;
    gap: 8px;
  }
  .search-box {
    flex: 1;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    padding: 10px 12px;
    border: none;
    font-size: 14px;
    outline: none;
  }
  .locate-btn {
    background: white;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .zoom-controls {
    position: absolute;
    bottom: 20px;
    right: 12px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .zoom-btn {
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
  }
</style>
</head>
<body>
<div id="map"></div>

<div class="controls">
  <input class="search-box" id="placeSearch" placeholder="Search places..." />
  <button class="locate-btn" onclick="locateUser()">📍</button>
</div>

<div class="zoom-controls">
  <button class="zoom-btn" onclick="map.zoomIn()">+</button>
  <button class="zoom-btn" onclick="map.zoomOut()">−</button>
</div>

<script>
  // Initialize map
  var map = L.map('map', { 
    zoomControl: false,
    center: [27.7103, 85.3222],
    zoom: 13
  });
  
  // Add tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  // Store markers data
  var markersData = ${JSON.stringify(allMarkers)};
  var markerCluster = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
  });

  // Create markers
  markersData.forEach(function(m) {
    var icon = L.divIcon({
      html: '<div class="custom-marker' + (m.mustVisit ? ' must-visit' : '') + '"></div>',
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });

    var popupContent = 
      '<div>' +
        '<div class="popup-title">' + m.name + '</div>' +
        '<div class="popup-sub">' + m.type + ' · ' + m.price + '</div>' +
        '<div class="popup-actions">' +
          '<button class="popup-btn popup-btn-primary" onclick="openSite(\'' + m.id + '\')">View</button>' +
          '<button class="popup-btn popup-btn-secondary" onclick="openDirections(' + m.lat + ',' + m.lng + ')">Directions</button>' +
        '</div>' +
      '</div>';

    var marker = L.marker([m.lat, m.lng], { 
      icon: icon,
      title: m.name
    }).bindPopup(popupContent, {
      maxWidth: 250,
      className: 'custom-popup'
    });

    marker.on('click', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        type: 'markerClick', 
        id: m.id, 
        name: m.name 
      }));
    });

    markerCluster.addLayer(marker);
  });

  map.addLayer(markerCluster);

  // Handle cluster click
  markerCluster.on('clusterclick', function(e) {
    var cluster = e.layer;
    var markers = cluster.getAllChildMarkers();
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: 'clusterClick', 
      count: markers.length 
    }));
  });

  // Functions
  function openSite(id) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: 'openSite', 
      id: id 
    }));
  }

  function openDirections(lat, lng) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: 'directions', 
      lat: lat, 
      lng: lng 
    }));
  }

  function locateUser() {
    if (!navigator.geolocation) {
      alert('Geolocation not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        var userMarker = L.circleMarker([lat, lng], { 
          radius: 8, 
          color: '#2C7A3A', 
          fillColor: '#2C7A3A', 
          fillOpacity: 0.9,
          weight: 2
        }).addTo(map);
        map.setView([lat, lng], 15);
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: 'locationFound', 
          lat: lat, 
          lng: lng 
        }));
      },
      function() { 
        alert('Unable to get location. Please check your permissions.'); 
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Search functionality
  var searchInput = document.getElementById('placeSearch');
  var searchTimeout;

  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    var q = e.target.value.toLowerCase().trim();
    
    searchTimeout = setTimeout(function() {
      // Clear and re-add markers based on search
      markerCluster.clearLayers();
      
      var filtered = markersData.filter(function(m) { 
        return m.name.toLowerCase().indexOf(q) !== -1; 
      });
      
      if (q === '') filtered = markersData;
      
      filtered.forEach(function(m) {
        var icon = L.divIcon({
          html: '<div class="custom-marker' + (m.mustVisit ? ' must-visit' : '') + '"></div>',
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24]
        });
        
        var popupContent = 
          '<div>' +
            '<div class="popup-title">' + m.name + '</div>' +
            '<div class="popup-sub">' + m.type + ' · ' + m.price + '</div>' +
            '<div class="popup-actions">' +
              '<button class="popup-btn popup-btn-primary" onclick="openSite(\'' + m.id + '\')">View</button>' +
              '<button class="popup-btn popup-btn-secondary" onclick="openDirections(' + m.lat + ',' + m.lng + ')">Directions</button>' +
            '</div>' +
          '</div>';
        
        var marker = L.marker([m.lat, m.lng], { icon: icon });
        marker.bindPopup(popupContent);
        marker.on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'markerClick', 
            id: m.id, 
            name: m.name 
          }));
        });
        markerCluster.addLayer(marker);
      });
      
      // If search has results and only one, zoom to it
      if (filtered.length === 1 && q !== '') {
        map.setView([filtered[0].lat, filtered[0].lng], 15);
      } else if (filtered.length > 0) {
        // Fit bounds to show all results
        var bounds = L.latLngBounds(filtered.map(function(m) { 
          return [m.lat, m.lng]; 
        }));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, 300);
  });

  // Handle window resize
  setTimeout(function() {
    map.invalidateSize();
  }, 500);

  // Notify React Native that map is ready
  window.ReactNativeWebView.postMessage(JSON.stringify({ 
    type: 'mapReady' 
  }));
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
  const [mapReady, setMapReady] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);
  const filterAnim = useRef(new Animated.Value(0)).current;
  const webViewRef = useRef<WebView>(null);

  const { data, loading } = useSites({
    type: selectedCategory === "All" ? undefined : selectedCategory,
    city: selectedCity === "All" ? undefined : selectedCity,
    limit: 50,
  });

  const sites = data?.sites ?? [];

  // Refresh map when filters change or sites update
  useEffect(() => {
    if (sites.length > 0 || !loading) {
      setWebViewKey((prev) => prev + 1);
    }
  }, [selectedCategory, selectedCity, sites, loading]);

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

  // Handle WebView messages
  const handleMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);

      if (msg.type === "mapReady") {
        setMapReady(true);
        console.log("Map is ready");
      } else if (msg.type === "markerClick") {
        setSelectedSite({ id: msg.id, name: msg.name });
      } else if (msg.type === "openSite") {
        router.push(`/site/${msg.id}` as any);
      } else if (msg.type === "directions") {
        const { lat, lng } = msg;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url).catch(() => {
          console.warn("Unable to open directions URL", url);
        });
      } else if (msg.type === "clusterClick") {
        console.log(`Cluster clicked with ${msg.count} markers`);
      } else if (msg.type === "locationFound") {
        console.log(`User location: ${msg.lat}, ${msg.lng}`);
      }
    } catch (error) {
      console.warn("Error parsing message:", error);
    }
  };

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

      {/* Map - with key to force re-render on changes */}
      <WebView
        key={webViewKey}
        ref={webViewRef}
        source={{ html: buildLeafletHTML(sites) }}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        androidLayerType="software"
        onLoadEnd={() => {
          console.log("WebView loaded");
        }}
        onError={(error) => {
          console.error("WebView error:", error);
        }}
        containerStyle={styles.webViewContainer}
      />

      {/* Loading indicator */}
      {!mapReady && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}

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
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webViewContainer: {
    flex: 1,
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
    zIndex: 50,
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
    zIndex: 40,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.textSecondary },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
