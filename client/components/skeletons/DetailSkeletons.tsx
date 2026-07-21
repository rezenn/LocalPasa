import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { SkeletonBox, SkeletonLines } from "./Skeleton";
import { ArtisanCardSkeleton } from "./CardSkeletons";

/** Floating back button overlaid on the hero image while a detail screen
 * loads, so the user isn't stranded with no way back until data arrives. */
const SkeletonBackButton: React.FC = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={backBtnStyles.btn}
      onPress={() => router.back()}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="arrow-back" size={20} color={Colors.white} />
    </TouchableOpacity>
  );
};

const backBtnStyles = StyleSheet.create({
  btn: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

/** Matches the hero + name-card + tabs + summary shape of app/site/[id].tsx */
export const SiteDetailSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" />
    <SkeletonBox width="100%" height={260} borderRadius={0} />
    <SkeletonBackButton />

    <View style={styles.nameCard}>
      <SkeletonBox width="70%" height={22} />
      <View style={styles.chipRow}>
        <SkeletonBox width={80} height={22} borderRadius={Radius.full} />
        <SkeletonBox width={70} height={22} borderRadius={Radius.full} />
        <SkeletonBox width={60} height={22} borderRadius={Radius.full} />
      </View>
    </View>

    <View style={styles.tabsRow}>
      <SkeletonBox width={90} height={30} borderRadius={Radius.full} />
      <SkeletonBox width={90} height={30} borderRadius={Radius.full} />
      <SkeletonBox width={90} height={30} borderRadius={Radius.full} />
    </View>

    <View style={styles.body}>
      <SkeletonLines lines={4} lineHeight={13} gap={9} />

      <View style={styles.actionsRow}>
        <SkeletonBox
          width={110}
          height={40}
          borderRadius={Radius.md}
          style={{ flex: 1 }}
        />
        <SkeletonBox
          width={80}
          height={40}
          borderRadius={Radius.md}
          style={{ flex: 1 }}
        />
        <SkeletonBox
          width={80}
          height={40}
          borderRadius={Radius.md}
          style={{ flex: 1 }}
        />
      </View>

      <SkeletonBox
        width="100%"
        height={140}
        borderRadius={Radius.lg}
        style={{ marginTop: Spacing.lg }}
      />

      <SkeletonBox width={140} height={16} style={{ marginTop: Spacing.xl }} />
      <View style={styles.artisanRow}>
        <ArtisanCardSkeleton />
        <ArtisanCardSkeleton />
      </View>
    </View>
  </SafeAreaView>
);

/** Matches the hero + avatar + name block + action row shape of app/artisan/[id].tsx */
export const ArtisanDetailSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" />
    <SkeletonBox width="100%" height={220} borderRadius={0} />
    <SkeletonBackButton />

    <View style={styles.avatarWrap}>
      <SkeletonBox width={84} height={84} borderRadius={42} />
    </View>

    <View style={styles.nameBlockCentered}>
      <SkeletonBox width={160} height={20} />
      <SkeletonBox width={110} height={13} style={{ marginTop: 8 }} />
      <SkeletonBox width={130} height={12} style={{ marginTop: 8 }} />
    </View>

    <View style={styles.actionsRow}>
      <SkeletonBox
        width={100}
        height={40}
        borderRadius={Radius.md}
        style={{ flex: 1 }}
      />
      <SkeletonBox
        width={100}
        height={40}
        borderRadius={Radius.md}
        style={{ flex: 1 }}
      />
      <SkeletonBox
        width={100}
        height={40}
        borderRadius={Radius.md}
        style={{ flex: 1 }}
      />
    </View>

    <View style={styles.body}>
      <SkeletonBox width={70} height={16} />
      <SkeletonLines
        lines={3}
        lineHeight={12}
        gap={8}
        style={{ marginTop: Spacing.sm }}
      />

      <SkeletonBox
        width={140}
        height={16}
        style={{ marginTop: Spacing.xl }}
      />
      <View style={styles.artisanRow}>
        <SkeletonBox width={110} height={130} borderRadius={Radius.lg} />
        <SkeletonBox width={110} height={130} borderRadius={Radius.lg} />
      </View>

      <SkeletonBox
        width={90}
        height={16}
        style={{ marginTop: Spacing.xl }}
      />
      <SkeletonBox
        width="100%"
        height={70}
        borderRadius={Radius.lg}
        style={{ marginTop: Spacing.sm }}
      />
    </View>
  </SafeAreaView>
);

/** Matches the hero + date badge + info grid shape of app/event/[id].tsx */
export const EventDetailSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" />
    <SkeletonBox width="100%" height={260} borderRadius={0} />
    <SkeletonBackButton />

    <View style={styles.body}>
      <View style={styles.chipRow}>
        <SkeletonBox width={70} height={20} borderRadius={Radius.full} />
        <SkeletonBox width={60} height={20} borderRadius={Radius.full} />
      </View>
      <SkeletonBox width="75%" height={22} style={{ marginTop: Spacing.sm }} />

      <View style={styles.infoGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={styles.infoItem}>
            <SkeletonBox width={36} height={36} borderRadius={Radius.md} />
            <View style={{ flex: 1 }}>
              <SkeletonBox width={50} height={10} />
              <SkeletonBox width="80%" height={13} style={{ marginTop: 6 }} />
            </View>
          </View>
        ))}
      </View>

      <SkeletonBox width={130} height={16} style={{ marginTop: Spacing.lg }} />
      <SkeletonLines
        lines={3}
        lineHeight={12}
        gap={8}
        style={{ marginTop: Spacing.sm }}
      />

      <SkeletonBox
        width="100%"
        height={110}
        borderRadius={Radius.lg}
        style={{ marginTop: Spacing.lg }}
      />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight || 0,
  },
  nameCard: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  chipRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.sm },
  tabsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  body: { padding: Spacing.lg, gap: Spacing.xs },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  artisanRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: -42,
  },
  nameBlockCentered: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  infoItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    ...Shadow.sm,
  },
});
