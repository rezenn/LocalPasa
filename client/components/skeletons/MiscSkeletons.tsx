import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { SkeletonBox, SkeletonLines } from "./Skeleton";

/** Matches the hero + avatar + stats + menu-sections shape of
 * app/(dashboard)/profile.tsx */
export const ProfileSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.brown} />
    <View style={styles.hero}>
      <SkeletonBox width={88} height={88} borderRadius={44} />
      <SkeletonBox width={140} height={18} style={{ marginTop: Spacing.md }} />
      <SkeletonBox width={170} height={12} style={{ marginTop: 8 }} />
    </View>

    <View style={styles.statsRow}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.statBox}>
          <SkeletonBox width={28} height={18} />
          <SkeletonBox width={40} height={10} style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>

    {[0, 1, 2].map((s) => (
      <View key={s} style={styles.section}>
        <SkeletonBox width={90} height={12} style={{ marginBottom: Spacing.sm }} />
        <View style={styles.menuGroup}>
          {Array.from({ length: s === 2 ? 2 : 4 }).map((_, i) => (
            <View key={i} style={styles.menuItem}>
              <SkeletonBox width={36} height={36} borderRadius={Radius.md} />
              <View style={{ flex: 1 }}>
                <SkeletonBox width="55%" height={13} />
                <SkeletonBox width="75%" height={10} style={{ marginTop: 6 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    ))}
  </SafeAreaView>
);

/** Matches the hero-image + name/price + description + sold-by-artisan-row
 * shape of app/product/[id].tsx. Renders content only — callers keep their
 * own functional header (with working back button) above this. */
export const ProductDetailSkeleton: React.FC = () => (
  <>
    <SkeletonBox width="100%" height={280} borderRadius={0} />
    <View style={styles.body}>
      <SkeletonBox width="60%" height={20} />
      <SkeletonBox width={90} height={16} style={{ marginTop: 8 }} />

      <SkeletonBox width={110} height={13} style={{ marginTop: Spacing.lg }} />
      <SkeletonLines
        lines={3}
        lineHeight={12}
        gap={8}
        style={{ marginTop: Spacing.sm }}
      />

      <SkeletonBox width={70} height={13} style={{ marginTop: Spacing.lg }} />
      <View style={styles.artisanCard}>
        <SkeletonBox width={48} height={48} borderRadius={Radius.md} />
        <View style={{ flex: 1 }}>
          <SkeletonBox width="50%" height={13} />
          <SkeletonBox width="35%" height={11} style={{ marginTop: 6 }} />
        </View>
      </View>
    </View>
  </>
);

/** 2-column product card grid skeleton for app/products-list/index.tsx */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({
  count = 6,
}) => (
  <View style={styles.productGrid}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={styles.productCard}>
        <SkeletonBox width="100%" height={160} borderRadius={0} />
        <View style={styles.productCardBody}>
          <SkeletonBox width="80%" height={12} />
          <SkeletonBox width="40%" height={11} style={{ marginTop: 6 }} />
        </View>
      </View>
    ))}
  </View>
);

/** Inline text-shaped skeleton for a result area that's about to fill with
 * generated/fetched text (e.g. a translation result). */
export const OutputTextSkeleton: React.FC = () => (
  <SkeletonLines lines={2} lineHeight={14} gap={10} lastLineWidth="45%" />
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.brown,
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl + Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: -(Spacing.xl + 4),
    borderRadius: Radius.lg,
    ...Shadow.md,
  },
  statBox: { flex: 1, alignItems: "center", paddingVertical: Spacing.md },
  section: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg },
  menuGroup: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  body: { padding: Spacing.lg },
  artisanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...Shadow.sm,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  productCard: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  productCardBody: { padding: Spacing.sm },
});
