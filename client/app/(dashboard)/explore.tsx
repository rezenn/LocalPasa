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

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrap}>
          <View style={styles.headerInner}>
            <View>
              <Text style={styles.greeting}>Hello, Explorer! 👋</Text>
              <Text style={styles.tagline}>
                Discover Nepal's cultural heritage
              </Text>
            </View>
            <TouchableOpacity
              style={styles.translateBtn}
              onPress={() => router.push("/translate" as any)}
            >
              <Ionicons
                name="language-outline"
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {}}
          />
        </View>

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
  translateBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: { marginVertical: Spacing.lg },
  horizontalList: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  flatList: { marginBottom: -Spacing.xs },
  eventsList: { marginBottom: Spacing.md },
  bottomPad: { height: Spacing.lg },
});
