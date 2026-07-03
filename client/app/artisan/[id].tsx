import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import StarRating from "../../components/common/Ratings";
import { useArtisan } from "../../hooks/useApi";
import { savedApi } from "../../api/index";
import { ApiError } from "../../api/client";

export default function ArtisanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  const { data: artisan, loading, error } = useArtisan(id ?? "");

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      if (saved) {
        await savedApi.remove(id, "artisan");
        setSaved(false);
      } else {
        await savedApi.save(id, "artisan");
        setSaved(true);
      }
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

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

  if (error || !artisan) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errBox}>
          <Ionicons
            name="alert-circle-outline"
            size={56}
            color={Colors.border}
          />
          <Text style={styles.errText}>Artisan not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.errBtn}>
            <Text style={styles.errBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const rating = artisan.computedRating ?? artisan.rating ?? 0;
  const TABS = ["Profile", "Products", "Reviews"];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: artisan.image }} style={styles.heroImg} />
          <View style={styles.heroOverlay} />
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.navRight}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={handleSave}
                disabled={saving}
              >
                <Ionicons
                  name={saved ? "heart" : "heart-outline"}
                  size={20}
                  color={saved ? "#FF6B6B" : Colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <Ionicons name="share-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Identity card */}
        <View style={styles.idCard}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: artisan.image }} style={styles.avatar} />
          </View>
          <View style={styles.idInfo}>
            <Text style={styles.name}>{artisan.name}</Text>
            <Text style={styles.craft}>{artisan.craft}</Text>
            <View style={styles.metaRow}>
              <View style={styles.chip}>
                <Ionicons name="location" size={11} color={Colors.error} />
                <Text style={styles.chipText}>
                  {artisan.city || artisan.location}
                </Text>
              </View>
              {artisan.experience ? (
                <View style={styles.chip}>
                  <Ionicons
                    name="time-outline"
                    size={11}
                    color={Colors.primary}
                  />
                  <Text style={styles.chipText}>
                    {artisan.experience} yrs exp
                  </Text>
                </View>
              ) : null}
              <View style={[styles.chip, styles.starChip]}>
                <Ionicons name="star" size={11} color={Colors.secondary} />
                <Text style={styles.chipText}>{rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() => router.push(`/chat/${artisan._id}` as any)}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={Colors.white}
            />
            <Text style={styles.ctaPrimaryText}>Chat with Artisan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={handleSave}
            disabled={saving}
          >
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={18}
              color={saved ? "#FF6B6B" : Colors.primary}
            />
            <Text style={styles.ctaSecondaryText}>
              {saved ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary}>
            <Ionicons
              name="share-social-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.ctaSecondaryText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === t && styles.tabTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.body}>
          {/* ── PROFILE ── */}
          {activeTab === "Profile" && (
            <>
              {artisan.bio ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.bodyText}>{artisan.bio}</Text>
                </View>
              ) : null}
              {artisan.longBio ? (
                <Text style={styles.bodyText}>{artisan.longBio}</Text>
              ) : null}

              {artisan.priceRange ? (
                <View style={styles.infoBox}>
                  <Ionicons
                    name="pricetag-outline"
                    size={18}
                    color={Colors.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoBoxTitle}>Price Range</Text>
                    <Text style={styles.infoBoxText}>{artisan.priceRange}</Text>
                  </View>
                </View>
              ) : null}

              {artisan.contact && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contact</Text>
                  <View style={styles.contactGrid}>
                    {artisan.contact.email ? (
                      <View style={styles.contactItem}>
                        <View style={styles.contactIcon}>
                          <Ionicons
                            name="mail-outline"
                            size={16}
                            color={Colors.primary}
                          />
                        </View>
                        <Text style={styles.contactText} numberOfLines={1}>
                          {artisan.contact.email}
                        </Text>
                      </View>
                    ) : null}
                    {artisan.contact.website ? (
                      <View style={styles.contactItem}>
                        <View style={styles.contactIcon}>
                          <Ionicons
                            name="globe-outline"
                            size={16}
                            color={Colors.primary}
                          />
                        </View>
                        <Text style={styles.contactText} numberOfLines={1}>
                          {artisan.contact.website}
                        </Text>
                      </View>
                    ) : null}
                    {artisan.contact.instagram ? (
                      <View style={styles.contactItem}>
                        <View style={styles.contactIcon}>
                          <Ionicons
                            name="logo-instagram"
                            size={16}
                            color="#E1306C"
                          />
                        </View>
                        <Text style={styles.contactText}>
                          {artisan.contact.instagram}
                        </Text>
                      </View>
                    ) : null}
                    {artisan.contact.whatsapp ? (
                      <View style={styles.contactItem}>
                        <View style={styles.contactIcon}>
                          <Ionicons
                            name="logo-whatsapp"
                            size={16}
                            color="#25D366"
                          />
                        </View>
                        <Text style={styles.contactText}>
                          {artisan.contact.whatsapp}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              )}

              {artisan.workshops?.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Workshops</Text>
                  {artisan.workshops.map((w, i) => (
                    <View key={i} style={styles.workshopCard}>
                      <View style={styles.workshopHeader}>
                        <Text style={styles.workshopName}>{w.name}</Text>
                        <Text style={styles.workshopPrice}>{w.price}</Text>
                      </View>
                      <View style={styles.workshopMeta}>
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={Colors.textMuted}
                        />
                        <Text style={styles.workshopMetaText}>
                          {w.duration}
                        </Text>
                        <Ionicons
                          name="people-outline"
                          size={12}
                          color={Colors.textMuted}
                        />
                        <Text style={styles.workshopMetaText}>
                          Max {w.maxParticipants}
                        </Text>
                      </View>
                      {w.description ? (
                        <Text style={styles.workshopDesc}>{w.description}</Text>
                      ) : null}
                      <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Book Workshop</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === "Products" && (
            <>
              {!artisan.products?.length ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="basket-outline"
                    size={48}
                    color={Colors.border}
                  />
                  <Text style={styles.emptyText}>No products listed yet.</Text>
                </View>
              ) : (
                <View style={styles.productsGrid}>
                  {artisan.products.map((p, i) => (
                    <View key={i} style={styles.productCard}>
                      {p.image ? (
                        <Image
                          source={{ uri: p.image }}
                          style={styles.productImg}
                        />
                      ) : (
                        <View style={styles.productImgPlaceholder}>
                          <Ionicons
                            name="image-outline"
                            size={28}
                            color={Colors.border}
                          />
                        </View>
                      )}
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {p.name}
                        </Text>
                        <Text style={styles.productPrice}>{p.price}</Text>
                        {!p.inStock && (
                          <Text style={styles.outOfStock}>Out of stock</Text>
                        )}
                        {p.inStock && (
                          <TouchableOpacity style={styles.orderBtn}>
                            <Text style={styles.orderBtnText}>Enquire</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "Reviews" && (
            <>
              {!artisan.reviews?.length ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="star-outline"
                    size={48}
                    color={Colors.border}
                  />
                  <Text style={styles.emptyText}>No reviews yet.</Text>
                </View>
              ) : (
                artisan.reviews.map((review) => (
                  <View key={review._id} style={styles.review}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>
                          {review.author[0]}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewAuthor}>{review.author}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                      <StarRating rating={review.rating} size={12} />
                    </View>
                    <Text style={styles.reviewText}>{review.text}</Text>
                  </View>
                ))
              )}
            </>
          )}
        </View>
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
  hero: { height: 220, position: "relative" },
  heroImg: { width: "100%", height: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topNav: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: { flexDirection: "row", gap: Spacing.sm },
  idCard: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarWrap: { marginTop: -40 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  idInfo: { flex: 1, paddingTop: 4 },
  name: { fontSize: 20, fontWeight: "800", color: Colors.text },
  craft: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  starChip: { backgroundColor: "#FFF8E1", borderColor: "#FFE082" },
  chipText: { fontSize: 11, color: Colors.text, fontWeight: "500" },
  ctaRow: { flexDirection: "row", gap: Spacing.sm, padding: Spacing.lg },
  ctaPrimary: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
  },
  ctaPrimaryText: { fontSize: 13, color: Colors.white, fontWeight: "700" },
  ctaSecondary: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  ctaSecondaryText: { fontSize: 11, color: Colors.primary, fontWeight: "600" },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.xl,
  },
  tab: { paddingVertical: Spacing.md, marginRight: Spacing.xl },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: "500" },
  tabTextActive: { color: Colors.primary, fontWeight: "700" },
  body: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bodyText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  infoBox: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: "#EEF2FF",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 2,
  },
  infoBoxText: { fontSize: 13, color: Colors.textSecondary },
  contactGrid: { gap: Spacing.sm },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EAE2",
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: { flex: 1, fontSize: 13, color: Colors.text },
  workshopCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  workshopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  workshopName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  workshopPrice: { fontSize: 14, fontWeight: "800", color: Colors.primary },
  workshopMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  workshopMetaText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  workshopDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 8,
    alignItems: "center",
  },
  bookBtnText: { color: Colors.white, fontSize: 13, fontWeight: "700" },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  productCard: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  productImg: { width: "100%", height: 120 },
  productImgPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#F0EAE2",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { padding: Spacing.sm },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 6,
  },
  outOfStock: { fontSize: 11, color: Colors.error, fontWeight: "500" },
  orderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: 6,
    alignItems: "center",
  },
  orderBtnText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  review: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  reviewAuthor: { fontSize: 13, fontWeight: "700", color: Colors.text },
  reviewDate: { fontSize: 11, color: Colors.textMuted },
  reviewText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  errBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  errText: { fontSize: 16, color: Colors.text },
  errBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  errBtnText: { color: Colors.white, fontWeight: "600" },
});
