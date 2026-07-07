import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import SiteCard from "../../components/cards/SiteCard";
import ArtisanCard from "../../components/cards/ArtisansCard";
import EventCard from "../../components/cards/EventCard";
import { savedApi } from "../../api/index";
import { useAsync } from "../../hooks/index";
import { Site, Artisan, Event } from "../../types";

const TABS = ["Sites", "Artisans", "Events"] as const;
type TabKey = (typeof TABS)[number];

export default function SavedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("Sites");

  const { data, loading, error, refetch } = useAsync(
    () => savedApi.getAll(),
    [],
  );

  const sites: Site[] = (data?.sites as Site[]) ?? [];
  const artisans: Artisan[] = (data?.artisans as Artisan[]) ?? [];
  const events: Event[] = (data?.events as Event[]) ?? [];

  const handleUnsave = async (
    itemId: string,
    itemType: "site" | "artisan" | "event",
  ) => {
    Alert.alert("Remove from saved?", "This item will be removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await savedApi.remove(itemId, itemType);
            refetch();
          } catch {
            Alert.alert("Error", "Failed to remove item. Please try again.");
          }
        },
      },
    ]);
  };

  const counts: Record<TabKey, number> = {
    Sites: sites.length,
    Artisans: artisans.length,
    Events: events.length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <Text style={styles.headerSub}>Your personal collection</Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {counts[tab] > 0 && (
              <View
                style={[styles.badge, activeTab === tab && styles.badgeActive]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    activeTab === tab && styles.badgeTextActive,
                  ]}
                >
                  {counts[tab]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          color={Colors.primary}
          size="large"
        />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Failed to load saved items</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Sites tab */}
          {activeTab === "Sites" &&
            (sites.length === 0 ? (
              <EmptyState message="No saved sites yet" />
            ) : (
              <FlatList
                data={sites}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.savedRow}>
                    <SiteCard
                      site={item}
                      onPress={() => router.push(`/site/${item._id}` as any)}
                    />
                    <TouchableOpacity
                      style={styles.unsaveBtn}
                      onPress={() => handleUnsave(item._id, "site")}
                    >
                      <Text style={styles.unsaveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                scrollEnabled={false}
              />
            ))}

          {/* Artisans tab */}
          {activeTab === "Artisans" &&
            (artisans.length === 0 ? (
              <EmptyState message="No saved artisans yet" />
            ) : (
              <FlatList
                data={artisans}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.savedRow}>
                    <ArtisanCard artisan={item} onPress={() => {}} />
                    <TouchableOpacity
                      style={styles.unsaveBtn}
                      onPress={() => handleUnsave(item._id, "artisan")}
                    >
                      <Text style={styles.unsaveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                scrollEnabled={false}
              />
            ))}

          {/* Events tab */}
          {activeTab === "Events" &&
            (events.length === 0 ? (
              <EmptyState message="No saved events yet" />
            ) : (
              <View>
                {events.map((event) => (
                  <View key={event._id} style={styles.eventRow}>
                    <EventCard event={event} onPress={() => {}} />
                    <TouchableOpacity
                      style={styles.unsaveBtnEvent}
                      onPress={() => handleUnsave(event._id, "event")}
                    >
                      <Text style={styles.unsaveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}

          <View style={styles.bottomPad} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.text}>{message}</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 60 },
  text: { fontSize: 15, color: Colors.textMuted },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.brown,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: "CrimsonBold",
  },
  headerSub: { fontSize: 12, color: "#E2DBDB", marginTop: 2 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    padding: 4,
    ...Shadow.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    gap: 6,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
  tabTextActive: { color: Colors.white },
  badge: {
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  badgeText: { fontSize: 10, color: Colors.textSecondary, fontWeight: "700" },
  badgeTextActive: { color: Colors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.md },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    flexWrap: "wrap",
    flexDirection: "row",
    gap: Spacing.md,
  },
  savedRow: { position: "relative" },
  unsaveBtn: {
    position: "absolute",
    top: 6,
    right: 6 + Spacing.md,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  unsaveBtnEvent: {
    position: "absolute",
    top: 10,
    right: Spacing.lg + 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  eventRow: { position: "relative" },
  unsaveText: { color: "#fff", fontSize: 11, fontWeight: "700" },
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
  bottomPad: { height: Spacing.xxxl },
});
