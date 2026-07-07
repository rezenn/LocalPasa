import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useArtisan } from "../../hooks/useApi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {
  const { id, artisanId } = useLocalSearchParams<{
    id: string;
    artisanId: string;
  }>();
  const router = useRouter();

  const { data: artisan, loading, error } = useArtisan(artisanId ?? "");

  const product = artisan?.products?.[Number(id)];

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.primary}
          size="large"
        />
      </SafeAreaView>
    );
  }

  if (error || !artisan || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={Colors.error}
          />
          <Text style={styles.errorText}>Could not load product details</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={{
              uri: product.image || "https://via.placeholder.com/400x260",
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />

          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {product.inStock === false && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>Sold Out</Text>
            </View>
          )}
        </View>

        <View style={styles.contentBlock}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>
            {product.price || "Price on request"}
          </Text>

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.bodyText}>{product.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artisan</Text>
            <TouchableOpacity
              style={styles.artisanRow}
              onPress={() => router.push(`/artisan/${artisan._id}` as any)}
            >
              <Image
                source={{
                  uri: artisan.image || "https://via.placeholder.com/60",
                }}
                style={styles.artisanAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.artisanName}>{artisan.name}</Text>
                <Text style={styles.artisanCraft}>{artisan.craft}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.chatBtn,
              product.inStock === false && styles.chatBtnDisabled,
            ]}
            disabled={product.inStock === false}
            onPress={() => router.push(`/chat/${artisan._id}` as any)}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color={Colors.white}
            />
            <Text style={styles.chatBtnText}>
              {product.inStock === false
                ? "Currently Unavailable"
                : "Message Artisan to Order"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: { height: 260, position: "relative" },
  heroImage: { width: "100%", height: 260 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  topBar: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldOutBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  soldOutText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  body: { flex: 1, backgroundColor: Colors.background },
  contentBlock: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  productName: {
    fontSize: 22,
    fontFamily: "CrimsonBold",
    color: Colors.text,
  },
  productPrice: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700",
    marginTop: 4,
  },
  section: { marginTop: Spacing.lg },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bodyText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  artisanAvatar: { width: 44, height: 44, borderRadius: 22 },
  artisanName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  artisanCraft: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    marginTop: Spacing.xl,
  },
  chatBtnDisabled: { backgroundColor: Colors.border },
  chatBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: { fontSize: 15, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: { color: Colors.white, fontWeight: "700" },
});
