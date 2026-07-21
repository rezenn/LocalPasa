import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow, Typography } from "../../constants/theme";
import { useArtisan } from "../../hooks/useApi";
import { ProductDetailSkeleton } from "../../components/skeletons";

const { width } = Dimensions.get("window");

// Products are subdocuments of an Artisan with no independent _id exposed to
// the client, so a product is addressed by `artisanId` + its array `index`
// (the `id` route param) rather than by a standalone product id.
export default function ProductDetailScreen() {
  const { id, artisanId } = useLocalSearchParams<{
    id: string;
    artisanId: string;
  }>();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const { data: artisan, loading, error } = useArtisan(artisanId ?? "");

  const index = Number(id);
  const product =
    artisan?.products && !Number.isNaN(index)
      ? artisan.products[index]
      : undefined;

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `${product.name} — ${product.price}${
          artisan ? ` from ${artisan.name} on LocalPasa` : ""
        }`,
      });
    } catch {
      // user cancelled share sheet — no-op
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <Header router={router} title="Product" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProductDetailSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !artisan || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <Header router={router} title="Product" />
        <View style={styles.centered}>
          <Ionicons name="bag-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.errorText}>Product not found</Text>
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
      <Header router={router} title={product.name} onShare={handleShare} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image
            source={{
              uri:
                !imageError && product.image
                  ? product.image
                  : "https://via.placeholder.com/600x400/E8E2D9/6B4F3A?text=No+Image",
            }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          {product.inStock === false && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>Sold Out</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price || "Price on request"}</Text>

          {product.description ? (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Sold by</Text>
          <TouchableOpacity
            style={styles.artisanCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/artisan/${artisan._id}` as any)}
          >
            <Image source={{ uri: artisan.image }} style={styles.artisanImg} />
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.chatBtn}
          activeOpacity={0.85}
          onPress={() => router.push(`/chat/${artisan._id}` as any)}
        >
          <Ionicons name="chatbubble-outline" size={18} color={Colors.white} />
          <Text style={styles.chatBtnText}>
            {product.inStock === false ? "Ask about restock" : "Message artisan to order"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Header({
  router,
  title,
  onShare,
}: {
  router: ReturnType<typeof useRouter>;
  title: string;
  onShare?: () => void;
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <TouchableOpacity
        style={styles.headerBtn}
        onPress={onShare}
        disabled={!onShare}
      >
        <Ionicons
          name="share-outline"
          size={20}
          color={onShare ? Colors.white : "transparent"}
        />
      </TouchableOpacity>
    </View>
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
  },
  headerBtn: {
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
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  errorText: { fontSize: 16, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
  imageWrap: { width, height: 280, backgroundColor: Colors.border },
  image: { width: "100%", height: "100%" },
  soldOutBadge: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  soldOutText: { color: Colors.white, fontWeight: "700", fontSize: 13 },
  body: { padding: Spacing.lg, gap: Spacing.xs },
  name: { ...Typography.h1 },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  description: { ...Typography.body, lineHeight: 21, color: Colors.textSecondary },
  artisanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  artisanImg: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.border,
  },
  artisanName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  artisanCraft: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    ...Shadow.md,
  },
  chatBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
