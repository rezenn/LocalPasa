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
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useArtisan } from "../../hooks/useApi";
import { savedApi } from "../../api/index";

const { width } = Dimensions.get("window");

const StarRating = ({ rating }: { rating: number }) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Ionicons
        key={s}
        name={s <= Math.round(rating) ? "star" : "star-outline"}
        size={12}
        color="#F5A623"
      />
    ))}
  </View>
);

export default function ArtisanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "about" | "products" | "workshops" | "reviews"
  >("about");

  const { data: artisan, loading, error } = useArtisan(id ?? "");

  const toggleSave = async () => {
    try {
      if (saved) {
        await savedApi.remove(id!, "artisan");
        setSaved(false);
      } else {
        await savedApi.save(id!, "artisan");
        setSaved(true);
      }
    } catch {
      Alert.alert("Error", "Could not update saved items.");
    }
  };

  if (loading)
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.primary}
          size="large"
        />
      </SafeAreaView>
    );

  if (error || !artisan)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={Colors.error}
          />
          <Text style={styles.errorText}>Could not load artisan details</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  const TABS = ["about", "products", "workshops", "reviews"] as const;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Hero image */}
      <View style={styles.hero}>
        <Image
          source={{
            uri: artisan.image || "https://via.placeholder.com/400x240",
          }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.topBtn} onPress={toggleSave}>
              <Ionicons
                name={saved ? "heart" : "heart-outline"}
                size={20}
                color={saved ? "#FF6B6B" : Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBtn}>
              <Ionicons name="share-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: artisan.image }} style={styles.avatar} />
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Name + rating */}
        <View style={styles.nameBlock}>
          <Text style={styles.artisanName}>{artisan.name}</Text>
          <View style={styles.craftRow}>
            <Text style={styles.craftLabel}>{artisan.craft}</Text>
            {artisan.city && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color={Colors.primary} />
                <Text style={styles.locationText}>{artisan.city}</Text>
              </View>
            )}
          </View>
          {artisan.rating != null && (
            <View style={styles.ratingRow}>
              <StarRating rating={artisan.rating} />
              <Text style={styles.ratingText}>
                {artisan.rating.toFixed(1)} ({artisan.reviewCount ?? 0} reviews)
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => router.push(`/screens/chat/${artisan._id}` as any)}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color={Colors.white}
            />
            <Text style={styles.chatBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dirBtn}>
            <Ionicons name="navigate" size={18} color={Colors.primary} />
            <Text style={styles.dirBtnText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSave}>
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* About */}
        {activeTab === "about" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bodyText}>
              {artisan.longBio ||
                artisan.bio ||
                "A skilled local artisan dedicated to preserving Nepal's rich cultural heritage through traditional craftsmanship."}
            </Text>
            {artisan.experience && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={Colors.primary}
                />
                <Text style={styles.infoText}>
                  {artisan.experience} years of experience
                </Text>
              </View>
            )}
            {artisan.priceRange && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="pricetag-outline"
                  size={14}
                  color={Colors.primary}
                />
                <Text style={styles.infoText}>
                  Price range: {artisan.priceRange}
                </Text>
              </View>
            )}
            {artisan.contact?.email && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="mail-outline"
                  size={14}
                  color={Colors.primary}
                />
                <Text style={styles.infoText}>{artisan.contact.email}</Text>
              </View>
            )}
          </View>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Products & Works</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/screens/products-list?artisanId=${artisan._id}` as any,
                  )
                }
              >
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {(artisan.products ?? []).slice(0, 6).map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.productCard}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{
                      uri: p.image || "https://via.placeholder.com/120",
                    }}
                    style={styles.productImg}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.productPrice}>{p.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {(artisan.products ?? []).length === 0 && (
                <Text style={styles.emptyText}>No products listed yet.</Text>
              )}
            </View>
          </View>
        )}

        {/* Workshops */}
        {activeTab === "workshops" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workshops</Text>
            {(artisan.workshops ?? []).map((w, i) => (
              <View key={i} style={styles.workshopCard}>
                <View style={styles.workshopHeader}>
                  <Text style={styles.workshopName}>{w.name}</Text>
                  <Text style={styles.workshopPrice}>{w.price}</Text>
                </View>
                <Text style={styles.workshopMeta}>
                  {w.duration} · Max {w.maxParticipants} participants
                </Text>
                {w.description && (
                  <Text style={styles.workshopDesc}>{w.description}</Text>
                )}
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>Book Workshop</Text>
                </TouchableOpacity>
              </View>
            ))}
            {(artisan.workshops ?? []).length === 0 && (
              <Text style={styles.emptyText}>No workshops scheduled.</Text>
            )}
          </View>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Write a review</Text>
              </TouchableOpacity>
            </View>
            {(artisan.reviews ?? []).map((r) => (
              <View key={r._id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.author[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <StarRating rating={r.rating} />
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
            {(artisan.reviews ?? []).length === 0 && (
              <Text style={styles.emptyText}>
                No reviews yet. Be the first!
              </Text>
            )}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: { height: 220, position: "relative" },
  heroImage: { width: "100%", height: 220 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  topBar: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
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
  topActions: { flexDirection: "row", gap: Spacing.sm },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -36,
    left: "50%",
    transform: [{ translateX: -36 }],
    borderWidth: 4,
    borderColor: Colors.surface,
    borderRadius: 40,
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  body: { flex: 1, backgroundColor: Colors.background, marginTop: 40 },
  nameBlock: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  artisanName: {
    fontSize: 22,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    textAlign: "center",
  },
  craftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: 4,
  },
  craftLabel: {
    fontSize: 12,
    color: Colors.white,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    fontWeight: "600",
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  locationText: { fontSize: 12, color: Colors.textMuted },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  ratingText: { fontSize: 12, color: Colors.textSecondary },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  chatBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 12,
  },
  chatBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  dirBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  dirBtnText: { color: Colors.primary, fontWeight: "700", fontSize: 14 },
  iconBtn: {
    width: 46,
    height: 46,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tabBarContent: { paddingHorizontal: Spacing.lg },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginRight: 4,
  },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textMuted, fontWeight: "500" },
  tabTextActive: { color: Colors.primary, fontWeight: "700" },
  section: { padding: Spacing.lg },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  bodyText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: Spacing.sm,
  },
  infoText: { fontSize: 13, color: Colors.textSecondary },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  productCard: {
    width: (width - Spacing.lg * 2 - Spacing.md * 2) / 3,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: "hidden",
    ...Shadow.sm,
  },
  productImg: { width: "100%", height: 90 },
  productInfo: { padding: Spacing.sm },
  productName: { fontSize: 11, fontWeight: "600", color: Colors.text },
  productPrice: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
    marginTop: 2,
  },
  workshopCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  workshopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  workshopName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  workshopPrice: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  workshopMeta: { fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
  workshopDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  bookBtn: {
    backgroundColor: Colors.primary + "15",
    borderRadius: Radius.md,
    paddingVertical: 8,
    alignItems: "center",
  },
  bookBtnText: { color: Colors.primary, fontWeight: "700", fontSize: 13 },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { fontWeight: "700", color: Colors.primary, fontSize: 14 },
  reviewAuthor: { fontSize: 13, fontWeight: "600", color: Colors.text },
  reviewDate: { fontSize: 11, color: Colors.textMuted },
  reviewText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    paddingVertical: 24,
  },
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
