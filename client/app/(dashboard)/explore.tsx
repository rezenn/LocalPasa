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
import FilterPanel, {
  DEFAULT_FILTERS,
  ExploreFilters,
  isFiltersActive,
} from "../../components/common/FilterPanel";
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
  useSites,
  useEvents,
} from "../../hooks/useApi";
import {
  filterArtisans,
  filterEvents,
  filterSites,
} from "../../utils/exploreFilters";
import ArtisansCard2 from "@/components/cards/ArtisanCard2";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ExploreFilters>(DEFAULT_FILTERS);

  const { data: hiddenGems, loading: gemsLoading } = useHiddenGems(1);
  const { data: mustVisitData, loading: sitesLoading } = useMustVisitSites(10);
  const { data: artisansData, loading: artisansLoading } = useArtisans({
    limit: 10,
    sortBy: "rating",
  });
  const { data: eventsData, loading: eventsLoading } = useUpcomingEvents(5);

  // Broader pools to search/filter over — separate from the small
  // home-feed queries above so "see all results" isn't capped at 5–10.
  const isSearchActive =
    searchQuery.trim().length > 0 || isFiltersActive(appliedFilters);
  const { data: allSitesData, loading: allSitesLoading } = useSites({
    limit: 100,
  });
  const { data: allArtisansData, loading: allArtisansLoading } = useArtisans({
    limit: 100,
  });
  const { data: allEventsData, loading: allEventsLoading } = useEvents({
    limit: 100,
  });

  const hiddenGem = hiddenGems?.[0] ?? null;
  const sites = mustVisitData ?? [];
  const artisans = artisansData?.artisans ?? [];
  const events = eventsData ?? [];

  const filteredSites = useMemo(
    () => filterSites(allSitesData?.sites ?? [], searchQuery, appliedFilters),
    [allSitesData, searchQuery, appliedFilters],
  );
  const filteredArtisans = useMemo(
    () =>
      filterArtisans(
        allArtisansData?.artisans ?? [],
        searchQuery,
        appliedFilters,
      ),
    [allArtisansData, searchQuery, appliedFilters],
  );
  const filteredEvents = useMemo(
    () =>
      filterEvents(allEventsData?.events ?? [], searchQuery, appliedFilters),
    [allEventsData, searchQuery, appliedFilters],
  );
  const resultsLoading =
    allSitesLoading || allArtisansLoading || allEventsLoading;
  const noResults =
    !resultsLoading &&
    filteredSites.length === 0 &&
    filteredArtisans.length === 0 &&
    filteredEvents.length === 0;

  const openFilters = () => {
    setFilters(appliedFilters);
    setShowFilters(true);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.headerWrap}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.greeting}>Hello, Explorer!</Text>
            <Text style={styles.tagline}>
              Discover Nepal's cultural heritage
            </Text>
          </View>
        </View>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={
            showFilters ? () => setShowFilters(false) : openFilters
          }
        />
        {isFiltersActive(appliedFilters) && !showFilters && (
          <TouchableOpacity
            style={styles.activeFilterPill}
            onPress={openFilters}
          >
            <Ionicons name="options" size={13} color={Colors.white} />
            <Text style={styles.activeFilterPillText}>Filters applied</Text>
            <TouchableOpacity onPress={resetFilters} hitSlop={8}>
              <Ionicons name="close-circle" size={15} color={Colors.white} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>

      {showFilters ? (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      ) : isSearchActive ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {resultsLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={Colors.primary}
              size="large"
            />
          ) : noResults ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different search term or adjust your filters.
              </Text>
            </View>
          ) : (
            <>
              {filteredSites.length > 0 && (
                <>
                  <SectionHeader title={`Sites (${filteredSites.length})`} />
                  <FlatList
                    data={filteredSites}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.gridPad}
                    renderItem={({ item }) => (
                      <SiteCard
                        site={item}
                        onPress={() => router.push(`/site/${item._id}` as any)}
                      />
                    )}
                  />
                </>
              )}
              {filteredArtisans.length > 0 && (
                <>
                  <SectionHeader
                    title={`Artisans (${filteredArtisans.length})`}
                  />
                  <FlatList
                    data={filteredArtisans}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.gridPad}
                    renderItem={({ item }) => (
                      <ArtisansCard2
                        artisan={item}
                        onPress={() =>
                          router.push(`/artisan/${item._id}` as any)
                        }
                      />
                    )}
                  />
                </>
              )}
              {filteredEvents.length > 0 && (
                <>
                  <SectionHeader title={`Events (${filteredEvents.length})`} />
                  <View style={styles.eventsList}>
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        onPress={() =>
                          router.push(`/event/${event._id}` as any)
                        }
                      />
                    ))}
                  </View>
                </>
              )}
            </>
          )}
          <View style={styles.bottomPad} />
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {gemsLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={Colors.primary}
              size="small"
            />
          ) : hiddenGem ? (
            <HiddenGemBanner
              gem={hiddenGem}
              onPress={() => router.push(`/site/${hiddenGem._id}` as any)}
            />
          ) : null}

          <SectionHeader
            title="Must-Visit Sites"
            onSeeAll={() => router.push("/sites-list" as any)}
          />
          {sitesLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={Colors.primary}
              size="small"
            />
          ) : (
            <FlatList
              data={sites}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <SiteCard
                  site={item}
                  onPress={() => router.push(`/site/${item._id}` as any)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              style={styles.flatList}
            />
          )}

          <SectionHeader
            title="Local Artisans"
            onSeeAll={() => router.push("/artisans-list" as any)}
          />
          {artisansLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={Colors.primary}
              size="small"
            />
          ) : (
            <FlatList
              data={artisans}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ArtisanCard
                  artisan={item}
                  onPress={() => router.push(`/artisan/${item._id}` as any)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              style={styles.flatList}
            />
          )}

          <SectionHeader
            title="Upcoming Events"
            onSeeAll={() => router.push("/events-list" as any)}
          />
          {eventsLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={Colors.primary}
              size="small"
            />
          ) : (
            <View style={styles.eventsList}>
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onPress={() => router.push(`/event/${event._id}` as any)}
                />
              ))}
            </View>
          )}

          <SectionHeader
            title="Experiences"
            onSeeAll={() => router.push("/experiences-list" as any)}
          />
          <TouchableOpacity
            style={styles.experiencesBanner}
            activeOpacity={0.85}
            onPress={() => router.push("/experiences-list" as any)}
          >
            <Ionicons name="sparkles" size={20} color={Colors.white} />
            <View style={{ flex: 1 }}>
              <Text style={styles.experiencesBannerTitle}>
                Book a hands-on workshop
              </Text>
              <Text style={styles.experiencesBannerSubtitle}>
                Pottery, cooking, thanka painting & more with local masters
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.bottomPad} />
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
  scroll: { flex: 1 },
  headerWrap: {
    backgroundColor: Colors.brown,
    marginBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    paddingBottom: Spacing.md,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  greeting: { fontSize: 22, color: Colors.white, fontFamily: "CrimsonBold" },
  tagline: { fontSize: 12, color: "#E2DBDB", marginTop: 2 },
  activeFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  activeFilterPillText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  loader: { marginVertical: Spacing.lg },
  horizontalList: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  flatList: { marginBottom: -Spacing.xs },
  eventsList: { marginBottom: Spacing.md },
  gridRow: {
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  gridPad: { paddingBottom: Spacing.xl },
  bottomPad: { height: Spacing.lg },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
  },
  emptyTitle: { ...Typography.h3, marginTop: Spacing.sm },
  emptySubtitle: {
    ...Typography.caption,
    textAlign: "center",
  },
  experiencesBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  experiencesBannerTitle: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  experiencesBannerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 2,
  },
});
