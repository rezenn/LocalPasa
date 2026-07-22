import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { SkeletonBox } from "./Skeleton";

/** Matches components/cards/SiteCard.tsx */
export const SiteCardSkeleton: React.FC = () => (
  <View style={styles.siteContainer}>
    <SkeletonBox width="100%" height={100} borderRadius={0} />
    <View style={styles.siteInfo}>
      <SkeletonBox width="80%" height={13} />
      <SkeletonBox width="60%" height={10} style={{ marginTop: 6 }} />
      <SkeletonBox width="40%" height={9} style={{ marginTop: 6 }} />
    </View>
  </View>
);

/** Matches components/cards/ArtisansCard.tsx */
export const ArtisanCardSkeleton: React.FC = () => (
  <View style={styles.artisanContainer}>
    <SkeletonBox width="100%" height={100} borderRadius={0} />
    <View style={styles.artisanInfo}>
      <SkeletonBox width="75%" height={13} />
      <SkeletonBox width="55%" height={10} style={{ marginTop: 6 }} />
      <SkeletonBox width="35%" height={9} style={{ marginTop: 6 }} />
    </View>
  </View>
);

/** Matches components/cards/EventCard.tsx */
export const EventCardSkeleton: React.FC = () => (
  <View style={styles.eventContainer}>
    <SkeletonBox width={46} height={46} borderRadius={Radius.lg} />
    <View style={styles.eventInfo}>
      <SkeletonBox width="70%" height={13} />
      <SkeletonBox width="90%" height={10} style={{ marginTop: 8 }} />
      <SkeletonBox width="50%" height={10} style={{ marginTop: 6 }} />
    </View>
  </View>
);

/** Matches app/events-list/index.tsx card row */
export const EventListItemSkeleton: React.FC = () => (
  <View style={styles.eventListItem}>
    <SkeletonBox width={48} height={48} borderRadius={Radius.md} />
    <View style={styles.eventListBody}>
      <SkeletonBox width="85%" height={14} />
      <SkeletonBox width="55%" height={10} style={{ marginTop: 6 }} />
      <View style={styles.eventListTags}>
        <SkeletonBox width={50} height={16} borderRadius={Radius.full} />
        <SkeletonBox width={50} height={16} borderRadius={Radius.full} />
      </View>
    </View>
  </View>
);

/** Horizontal row of N site or artisan card skeletons, for home-feed sections */
export const CardRowSkeleton: React.FC<{
  variant: "site" | "artisan";
  count?: number;
}> = ({ variant, count = 2 }) => (
  <View style={styles.row}>
    {Array.from({ length: count }).map((_, i) =>
      variant === "site" ? (
        <SiteCardSkeleton key={i} />
      ) : (
        <ArtisanCardSkeleton key={i} />
      ),
    )}
  </View>
);

export const EventListSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <View style={{ marginBottom: Spacing.md, marginTop: Spacing.md }}>
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </View>
);

export const ListRowSkeleton: React.FC<{ imageSize?: number }> = ({
  imageSize = 80,
}) => (
  <View style={styles.listRow}>
    <SkeletonBox
      width={imageSize}
      height={imageSize}
      borderRadius={Radius.md}
    />
    <View style={styles.listRowBody}>
      <SkeletonBox width="65%" height={14} />
      <SkeletonBox width="40%" height={11} style={{ marginTop: 6 }} />
      <View style={styles.listRowMeta}>
        <SkeletonBox width={36} height={12} />
        <SkeletonBox width={50} height={16} borderRadius={Radius.full} />
        <SkeletonBox width={40} height={12} />
      </View>
    </View>
  </View>
);

/** Stacked list of N row skeletons, for sites-list / artisans-list screens */
export const ListRowsSkeleton: React.FC<{
  count?: number;
  imageSize?: number;
}> = ({ count = 6, imageSize = 80 }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <ListRowSkeleton key={i} imageSize={imageSize} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  siteContainer: {
    width: 170,
    height: 160,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
    marginRight: Spacing.md,
  },
  siteInfo: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm },
  artisanContainer: {
    width: 140,
    height: 160,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
    marginRight: Spacing.md,
  },
  artisanInfo: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  eventInfo: { flex: 1 },
  eventListItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  eventListBody: { flex: 1 },
  eventListTags: { flexDirection: "row", gap: Spacing.xs, marginTop: 8 },
  row: {
    flexDirection: "row",
    paddingLeft: Spacing.lg,
    paddingBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    ...Shadow.sm,
  },
  listRowBody: { flex: 1, gap: 2 },
  listRowMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: 8,
  },
});
