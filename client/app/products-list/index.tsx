import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useArtisan } from "../../hooks/useApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

export default function ProductsListScreen() {
  const { artisanId } = useLocalSearchParams<{ artisanId?: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: artisan, loading, error } = useArtisan(artisanId ?? "");

  // Filter products based on search, but keep each item's original index
  // (into artisan.products) since that index is how /product/[id] addresses
  // a specific product — the product data model has no _id of its own.
  const allProducts = artisan?.products ?? [];
  const products = allProducts
    .map((p: any, originalIndex: number) => ({ ...p, originalIndex }))
    .filter(
      (p: any) =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()),
    );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Products</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !artisan) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Products</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={Colors.error}
          />
          <Text style={styles.errorText}>Could not load products</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {artisan.name}'s Products
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Product Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          found
        </Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item: any, index) =>
          item._id || item.id || `product-${item.originalIndex ?? index}`
        }
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
              router.push(
                `/product/${item.originalIndex}?artisanId=${artisanId}` as any,
              );
            }}
          >
            <Image
              source={{
                uri:
                  item.image ||
                  "https://via.placeholder.com/200/CCCCCC/FFFFFF?text=No+Image",
              }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            {item.inStock === false && (
              <View style={styles.soldOutOverlay}>
                <View style={styles.soldOutBadge}>
                  <Text style={styles.soldOutText}>Sold Out</Text>
                </View>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={2}>
                {item.name}
              </Text>
              {item.description && (
                <Text style={styles.cardDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              )}
              <View style={styles.cardBottom}>
                <Text style={styles.cardPrice}>
                  {item.price || "Price on request"}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    item.inStock === false && styles.addBtnDisabled,
                  ]}
                  disabled={item.inStock === false}
                >
                  <Ionicons
                    name={item.inStock === false ? "close" : "add"}
                    size={18}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              {search
                ? "Try adjusting your search"
                : "This artisan hasn't listed any products yet"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    paddingTop: Platform.OS === "android" ? Spacing.sm : Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "CrimsonBold",
    color: Colors.white,
  },
  headerRight: {
    width: 40,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
  },
  countContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  countText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  grid: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  columnWrapper: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  card: {
    flex: 1,
    maxWidth: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadow.sm,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: Colors.border,
  },
  soldOutOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldOutBadge: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  soldOutText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: Spacing.sm,
    gap: 4,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: {
    backgroundColor: Colors.border,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  retryText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
