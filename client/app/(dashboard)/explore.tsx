import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
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

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Real API data ────────────────────────────────────────────────────────
  const { data: hiddenGems, loading: gemsLoading } = useHiddenGems(1);
  const { data: mustVisitData, loading: sitesLoading } = useMustVisitSites(10);
  const { data: artisansData, loading: artisansLoading } = useArtisans({
    limit: 10,
    sortBy: "rating",
  });
  const { data: eventsData, loading: eventsLoading } = useUpcomingEvents(5);

  const hiddenGem = hiddenGems?.[0] ?? null;
  const sites = mustVisitData ?? [];
  const artisans = artisansData?.artisans ?? [];
  const events = eventsData ?? [];

  const handleSitePress = (site: Site) => {
    router.push(`/site/${site._id}` as any);
  };

  const handleArtisanPress = (artisan: Artisan) => {
    // TODO: navigate to artisan detail when screen is built
    console.log("Artisan pressed:", artisan._id);
  };

  const handleEventPress = (event: Event) => {
    // TODO: navigate to event detail when screen is built
    console.log("Event pressed:", event._id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.header1}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, Explorer!</Text>
            <Text style={styles.tagline}>Explore Nepal with LocalPasa</Text>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {}}
          />
        </View>

        {/* Hidden Gem Banner */}
        {gemsLoading ? (
          <ActivityIndicator
            style={styles.loader}
            color={Colors.primary}
            size="small"
          />
        ) : hiddenGem ? (
          <HiddenGemBanner
            gem={hiddenGem}
            onPress={() => handleSitePress(hiddenGem)}
          />
        ) : null}

        {/* Must-Visit Sites */}
        <SectionHeader
          title="Must-Visit Sites"
          onSeeAll={() => router.push("/map" as any)}
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
              <SiteCard site={item} onPress={() => handleSitePress(item)} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            style={styles.flatList}
          />
        )}

        {/* Local Artisans */}
        <SectionHeader
          title="Local Artisans"
          onSeeAll={() => router.push("/profile" as any)}
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
                onPress={() => handleArtisanPress(item)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            style={styles.flatList}
          />
        )}

        {/* Upcoming Events */}
        <SectionHeader
          title="Upcoming Events"
          onSeeAll={() => router.push("/calendar" as any)}
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
                onPress={() => handleEventPress(event)}
              />
            ))}
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
  scroll: { flex: 1 },
  header1: {
    backgroundColor: Colors.brown,
    marginBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  header: {
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
  loader: {
    marginVertical: Spacing.lg,
  },
  horizontalList: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  flatList: {
    marginBottom: -Spacing.xs,
  },
  eventsList: {
    marginBottom: Spacing.md,
  },
  bottomPad: {
    height: Spacing.lg,
  },
});
