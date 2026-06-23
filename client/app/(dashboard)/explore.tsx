
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Typography } from "../../constants/theme";
import SearchBar from "../../components/common/SearchBar";
import HiddenGemBanner from "../../components/cards/HiddenGemBanner";
import SectionHeader from "../../components/common/Header";
import SiteCard from "../../components/cards/SiteCard";
import ArtisanCard from "../../components/cards/ArtisansCard";
import EventCard from "../../components/cards/EventCard";
import {
  useMustVisitSites,
  useHiddenGems,
  useArtisans,
  useUpcomingEvents,
} from "../../hooks/useApi";
import { Site, Artisan, Event } from "../../types";

// ─── Weekly seed helper ────────────────────────────────────────────────────────
// Returns ISO week number (1–53). Same value for the entire calendar week so the
// gem only changes on Monday.
function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Pick a stable gem from the list using (year * 53 + week) as a seed index.
function pickWeeklyGem(gems: Site[]): Site | null {
  if (!gems.length) return null;
  const now = new Date();
  const seed = now.getFullYear() * 53 + getISOWeekNumber(now);
  return gems[seed % gems.length];
}

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Data ─────────────────────────────────────────────────────────────────
  // Fetch several hidden gems so we have a pool to rotate through weekly.
  const { data: hiddenGems, loading: gemsLoading } = useHiddenGems(20);
  const { data: mustVisitData, loading: sitesLoading } = useMustVisitSites(100);
  const { data: artisansData, loading: artisansLoading } = useArtisans({
    limit: 10,
    sortBy: "rating",
  });
  const { data: eventsData, loading: eventsLoading } = useUpcomingEvents(5);

  // ─── Weekly gem (stable for the whole week) ────────────────────────────────
  const weeklyGem = useMemo(
    () => pickWeeklyGem(hiddenGems ?? []),
    [hiddenGems],
  );

  const sites = mustVisitData ?? [];
  const artisans = artisansData?.artisans ?? [];
  const events = eventsData ?? [];

  // ─── Search filter ─────────────────────────────────────────────────────────
  const filteredSites = searchQuery
    ? sites.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sites;

  const filteredArtisans = searchQuery
    ? artisans.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.craft.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : artisans;

  const filteredEvents = searchQuery
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : events;

  const isSearching = searchQuery.length > 0;
  const hasNoResults =
    isSearching &&
    filteredSites.length === 0 &&
    filteredArtisans.length === 0 &&
    filteredEvents.length === 0;

  // ─── Navigation helpers ────────────────────────────────────────────────────
  const goToSite = (site: Site) => router.push(`/site/${site._id}` as any);
  const goToArtisan = (artisan: Artisan) =>
    router.push(`/artisan/${artisan._id}` as any);
  const goToEvent = (event: Event) => router.push(`/event/${event._id}` as any);

  // ─── ISO week label for the badge ─────────────────────────────────────────
  const weekLabel = `Week ${getISOWeekNumber(new Date())}`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.headerBlock}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hello, Explorer!</Text>
            <Text style={styles.tagline}>Explore Nepal with LocalPasa</Text>
          </View>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {}}
          />
        </View>

        {/* ── Empty search state ─────────────────────────────────────────── */}
        {hasNoResults && (
          <View style={styles.emptySearch}>
            <Ionicons
              name="search-outline"
              size={40}
              color={Colors.textMuted}
            />
            <Text style={styles.emptySearchTitle}>
              No results for "{searchQuery}"
            </Text>
            <Text style={styles.emptySearchSub}>
              Try a different site name, city, or artisan craft.
            </Text>
          </View>
        )}

        {/* ── Hidden Gem of the Week ─────────────────────────────────────── */}
        {!isSearching &&
          (gemsLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={Colors.primary}
              size="small"
            />
          ) : weeklyGem ? (
            <View>
              <View style={styles.gemHeader}>
                <View style={styles.gemTitleRow}>
                  <Ionicons name="diamond" size={14} color={Colors.primary} />
                  <Text style={styles.gemTitle}>Hidden Gem of the Week</Text>
                </View>
                <View style={styles.weekBadge}>
                  <Text style={styles.weekBadgeText}>{weekLabel}</Text>
                </View>
              </View>
              <HiddenGemBanner
                gem={weeklyGem}
                onPress={() => goToSite(weeklyGem)}
              />
            </View>
          ) : null)}

        {/* ── Must-Visit Sites ───────────────────────────────────────────── */}
        {(!isSearching || filteredSites.length > 0) && (
          <>
            <SectionHeader
              title={
                isSearching
                  ? `Sites (${filteredSites.length})`
                  : "Must-Visit Sites"
              }
              onSeeAll={() => router.push("/screens/sites-list" as any)}
            />
            {sitesLoading ? (
              <ActivityIndicator
                style={styles.loader}
                color={Colors.primary}
                size="small"
              />
            ) : filteredSites.length === 0 ? (
              <Text style={styles.emptySection}>No sites found</Text>
            ) : (
              <FlatList
                data={filteredSites}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <SiteCard site={item} onPress={() => goToSite(item)} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                style={styles.flatList}
              />
            )}
          </>
        )}

        {/* ── Local Artisans ─────────────────────────────────────────────── */}
        {(!isSearching || filteredArtisans.length > 0) && (
          <>
            <SectionHeader
              title={
                isSearching
                  ? `Artisans (${filteredArtisans.length})`
                  : "Local Artisans"
              }
              onSeeAll={() => router.push("/screens/artisans-list" as any)}
            />
            {artisansLoading ? (
              <ActivityIndicator
                style={styles.loader}
                color={Colors.primary}
                size="small"
              />
            ) : filteredArtisans.length === 0 ? (
              <Text style={styles.emptySection}>No artisans found</Text>
            ) : (
              <FlatList
                data={filteredArtisans}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <ArtisanCard
                    artisan={item}
                    onPress={() => goToArtisan(item)}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                style={styles.flatList}
              />
            )}
          </>
        )}

        {/* ── Upcoming Events ────────────────────────────────────────────── */}
        {(!isSearching || filteredEvents.length > 0) && (
          <>
            <SectionHeader
              title={
                isSearching
                  ? `Events (${filteredEvents.length})`
                  : "Upcoming Events"
              }
              onSeeAll={() => router.push("/screens/events-list" as any)}
            />
            {eventsLoading ? (
              <ActivityIndicator
                style={styles.loader}
                color={Colors.primary}
                size="small"
              />
            ) : filteredEvents.length === 0 ? (
              <Text style={styles.emptySection}>No events found</Text>
            ) : (
              <View style={styles.eventsList}>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onPress={() => goToEvent(event)}
                  />
                ))}
              </View>
            )}
          </>
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
  scroll: { flex: 1 },
  headerBlock: {
    backgroundColor: Colors.brown,
    marginBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerText: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  greeting: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: "CrimsonBold",
  },
  tagline: {
    ...Typography.caption,
    marginTop: 2,
    fontWeight: "500",
    color: "#E2DBDB",
  },
  gemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  gemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  weekBadge: {
    backgroundColor: Colors.primary + "18",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  weekBadgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
  },
  loader: { marginVertical: Spacing.lg },
  horizontalList: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  flatList: { marginBottom: -Spacing.xs },
  eventsList: { marginBottom: Spacing.md },
  emptySection: {
    fontSize: 13,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  emptySearch: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: Spacing.xl,
    gap: 8,
  },
  emptySearchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  emptySearchSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  bottomPad: { height: Spacing.lg },
});
