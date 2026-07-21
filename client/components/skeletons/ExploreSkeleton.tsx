import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { SkeletonBox } from "./Skeleton";
import { SiteCardSkeleton, ArtisanCardSkeleton } from "./CardSkeletons";

/** Matches HiddenGemBanner while the hidden gem is loading */
export const HiddenGemBannerSkeleton: React.FC = () => (
  <SkeletonBox
    width="100%"
    height={140}
    borderRadius={Radius.lg}
    style={styles.gemBanner}
  />
);

/** Grid of site/artisan card skeletons, matches the 2-column FlatList grid
 * used for search results in explore.tsx */
export const CardGridSkeleton: React.FC<{
  variant: "site" | "artisan";
  count?: number;
}> = ({ variant, count = 4 }) => (
  <View style={styles.grid}>
    {Array.from({ length: count }).map((_, i) =>
      variant === "site" ? (
        <SiteCardSkeleton key={i} />
      ) : (
        <ArtisanCardSkeleton key={i} />
      ),
    )}
  </View>
);

/** Full search-results skeleton — sites grid, artisans grid, events list */
export const SearchResultsSkeleton: React.FC = () => (
  <View>
    <SkeletonBox
      width={120}
      height={16}
      style={{ marginLeft: Spacing.lg, marginTop: Spacing.md }}
    />
    <CardGridSkeleton variant="site" count={4} />

    <SkeletonBox
      width={140}
      height={16}
      style={{ marginLeft: Spacing.lg, marginTop: Spacing.md }}
    />
    <CardGridSkeleton variant="artisan" count={4} />

    <SkeletonBox
      width={120}
      height={16}
      style={{ marginLeft: Spacing.lg, marginTop: Spacing.md, marginBottom: Spacing.sm }}
    />
    {Array.from({ length: 3 }).map((_, i) => (
      <View key={i} style={styles.eventRow}>
        <SkeletonBox width={46} height={46} borderRadius={Radius.lg} />
        <View style={{ flex: 1 }}>
          <SkeletonBox width="70%" height={13} />
          <SkeletonBox width="90%" height={10} style={{ marginTop: 8 }} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  gemBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: Spacing.lg,
    paddingBottom: Spacing.md,
    rowGap: Spacing.md,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
});
