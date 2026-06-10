import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
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
  getHiddenGem,
  nearbySites,
  localArtisans,
  upcomingEvents,
} from "../../constants/data/mockData";
import { HiddenGem, Site, Artisan, Event } from "../../types";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const hiddenGem = getHiddenGem();

  const handleSitePress = (site: Site | HiddenGem) => {
    router.push(`/site/${site.id}` as any);
  };

  const handleArtisanPress = (artisan: Artisan) => {
    console.log("Artisan pressed:", artisan);
  };

  const handleEventPress = (event: Event) => {
    console.log("Event pressed:", event);
  };
  const regularSites = nearbySites.filter((site) => !site.isHiddenGem);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="{Colors.background}"
      />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.header1}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, User</Text>
            <Text style={styles.tagline}>Explore Nepal with LocalPasa</Text>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {}}
          />
        </View>

        {hiddenGem && (
          <HiddenGemBanner
            gem={hiddenGem}
            onPress={() => handleSitePress(hiddenGem)}
          />
        )}

        <SectionHeader
          title="Nearby Sites"
          onSeeAll={() => router.push("/map" as any)}
        />
        <FlatList
          data={nearbySites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SiteCard site={item} onPress={() => handleSitePress(item)} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          style={styles.flatList}
        />

        <SectionHeader
          title="Local Artisans"
          onSeeAll={() => router.push("/profile" as any)}
        />
        <FlatList
          data={localArtisans}
          keyExtractor={(item) => item.id}
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

        <SectionHeader
          title="Upcoming Events"
          onSeeAll={() => router.push("/calendar" as any)}
        />
        <View style={styles.eventsList}>
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event)}
            />
          ))}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "Colors.background",
    marginTop: StatusBar.currentHeight || 0,
  },
  scroll: {
    flex: 1,
  },
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
    // fontWeight: "800",
    color: Colors.white,
    fontFamily: "CrimsonBold",
  },
  tagline: {
    ...Typography.caption,
    marginTop: 2,
    fontWeight: "500",
    color: "#E2DBDB",
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
