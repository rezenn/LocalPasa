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
import ArtisanCard from "../../components/cards/ArtisansCard";
import StarRating from "../../components/common/Ratings";
import { useSite } from "../../hooks/useApi";
import { savedApi } from "../../api/index";
import { ApiError } from "../../api/client";
import { Artisan } from "../../types";

const TABS = ["Summary", "Deep Dive", "Kids Mode"];

export default function SiteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Summary");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Review form state
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { data: site, loading, error } = useSite(id ?? "");

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      if (saved) {
        await savedApi.remove(id, "site");
        setSaved(false);
      } else {
        await savedApi.save(id, "site");
        setSaved(true);
      }
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to update saved";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleArtisanPress = (artisan: Artisan) => {
    console.log("Artisan pressed:", artisan._id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          style={styles.loadingCenter}
          color={Colors.primary}
          size="large"
        />
      </SafeAreaView>
    );
  }

  if (error || !site) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Site not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayRating = site.computedRating ?? site.rating ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: site.image }} style={styles.heroImage} />
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

          <View style={styles.badgeContainer}>
            {site.isHiddenGem && (
              <View style={styles.gemBadge}>
                <Ionicons name="diamond" size={11} color="#002852" />
                <Text style={styles.gemBadgeText}>Hidden gem of the week</Text>
              </View>
            )}
            {site.mustVisit && (
              <View style={styles.mustVisitBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={10}
                  color={Colors.white}
                />
                <Text style={styles.mustVisitText}>Must visit</Text>
              </View>
            )}
          </View>
        </View>

        {/* Name card */}
        <View style={styles.nameCard}>
          <Text style={styles.siteName}>{site.name}</Text>
          <View style={styles.siteMetaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="location" size={12} color={Colors.error} />
              <Text style={styles.metaChipText}>
                {site.city || site.location}
              </Text>
            </View>
            {site.distance ? (
              <View style={styles.metaChip}>
                <Ionicons name="navigate" size={12} color={Colors.primary} />
                <Text style={styles.metaChipText}>{site.distance}</Text>
              </View>
            ) : null}
            <View style={[styles.metaChip, styles.starChip]}>
              <StarRating rating={displayRating} size={12} />
              <Text style={styles.metaChipText}>
                {displayRating.toFixed(1)}
                {site.reviewCount ? ` (${site.reviewCount})` : ""}
              </Text>
            </View>
            <View style={[styles.metaChip, styles.freeChip]}>
              <Ionicons
                name="ticket-outline"
                size={12}
                color={Colors.primary}
              />
              <Text style={[styles.metaChipText, { color: Colors.primary }]}>
                {site.price}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Body */}
        <View style={styles.body}>
          {activeTab === "Summary" && (
            <>
              <Text style={styles.summaryText}>{site.summary}</Text>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons
                    name="language-outline"
                    size={18}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.actionBtnText}>Translate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnPrimary]}
                >
                  <Ionicons name="map-outline" size={18} color={Colors.white} />
                  <Text style={[styles.actionBtnText, { color: Colors.white }]}>
                    Get Directions
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Ionicons
                    name={saved ? "heart" : "heart-outline"}
                    size={18}
                    color={saved ? "#FF6B6B" : Colors.textSecondary}
                  />
                  <Text style={styles.actionBtnText}>
                    {saved ? "Saved" : "Save"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.actionBtnText}>Share</Text>
                </TouchableOpacity>
              </View>

              {/* Map placeholder */}
              <View style={styles.locationHeader}>
                <Text style={styles.sectionTitle}>Location</Text>
                <TouchableOpacity>
                  <Text style={styles.openMaps}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={40} color={Colors.border} />
                <Text style={styles.mapText}>Map View</Text>
              </View>

              {/* Did you know */}
              {site.didYouKnow ? (
                <View style={styles.didYouKnow}>
                  <Text style={styles.didYouKnowTitle}>💡 Did You Know?</Text>
                  <Text style={styles.didYouKnowText}>{site.didYouKnow}</Text>
                </View>
              ) : null}

              {/* Nearby Artisans */}
              {site.nearbyArtisans.length > 0 && (
                <>
                  <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>Nearby Artisans</Text>
                    <TouchableOpacity>
                      <Text style={styles.openMaps}>See all</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.artisanScroll}
                  >
                    {site.nearbyArtisans.map((artisan) => (
                      <ArtisanCard
                        key={artisan._id}
                        artisan={artisan}
                        onPress={() => handleArtisanPress(artisan)}
                      />
                    ))}
                  </ScrollView>
                </>
              )}

              {/* Reviews */}
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>
                  Reviews {site.reviewCount ? `(${site.reviewCount})` : ""}
                </Text>
              </View>
              {site.reviews.length === 0 ? (
                <Text style={styles.noReviews}>
                  No reviews yet. Be the first!
                </Text>
              ) : (
                site.reviews.map((review) => (
                  <View key={review._id} style={styles.review}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {review.author[0]}
                        </Text>
                      </View>
                      <View style={styles.reviewMeta}>
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

          {activeTab === "Deep Dive" && (
            <>
              {site.history ? (
                <View style={styles.deepSection}>
                  <Text style={styles.deepTitle}>🏛 History</Text>
                  <Text style={styles.summaryText}>{site.history}</Text>
                </View>
              ) : null}
              {site.myth ? (
                <View style={styles.deepSection}>
                  <Text style={styles.deepTitle}>📖 Myths & Legends</Text>
                  <Text style={styles.summaryText}>{site.myth}</Text>
                </View>
              ) : null}
              {site.openingHours ? (
                <View style={styles.deepSection}>
                  <Text style={styles.deepTitle}>🕐 Opening Hours</Text>
                  <Text style={styles.summaryText}>{site.openingHours}</Text>
                </View>
              ) : null}
              {!site.history && !site.myth && !site.openingHours && (
                <Text style={styles.noReviews}>
                  No deep dive content available yet.
                </Text>
              )}
            </>
          )}

          {activeTab === "Kids Mode" && (
            <>
              {site.didYouKnow ? (
                <View style={styles.didYouKnow}>
                  <Text style={styles.didYouKnowTitle}>💡 Fun Fact!</Text>
                  <Text style={styles.didYouKnowText}>{site.didYouKnow}</Text>
                </View>
              ) : null}
              {(site.quizzes?.length ?? 0) > 0 ? (
                <View style={styles.deepSection}>
                  <Text style={styles.deepTitle}>🎯 Quiz Time!</Text>
                  {site.quizzes!.map((quiz, i) => (
                    <View key={i} style={styles.quizItem}>
                      <Text style={styles.quizQuestion}>
                        {i + 1}. {quiz.question}
                      </Text>
                      {quiz.options.map((opt, j) => (
                        <Text key={j} style={styles.quizOption}>
                          {String.fromCharCode(65 + j)}. {opt}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noReviews}>No quizzes available yet.</Text>
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
  scroll: { flex: 1 },
  loadingCenter: { flex: 1 },
  heroWrapper: { height: 260, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
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
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: { flexDirection: "row", gap: Spacing.sm },
  badgeContainer: {
    position: "absolute",
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    gap: Spacing.sm,
    zIndex: 10,
  },
  mustVisitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.mustVisit,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  mustVisitText: { color: Colors.white, fontSize: 10, fontWeight: "600" },
  gemBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8EEBE",
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 0.5,
    borderColor: "#002852",
  },
  gemBadgeText: {
    color: "#002852",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  nameCard: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  siteName: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  siteMetaRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  starChip: { backgroundColor: "#FFF8E1", borderColor: "#FFE082" },
  freeChip: { backgroundColor: Colors.badge, borderColor: "#A5D6A7" },
  metaChipText: { fontSize: 12, color: Colors.text, fontWeight: "500" },
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
  body: { padding: Spacing.lg },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: "wrap",
  },
  actionBtn: {
    flex: 1,
    minWidth: 70,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    flex: 2,
  },
  actionBtnText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  openMaps: { fontSize: 13, color: Colors.primary, fontWeight: "500" },
  mapPlaceholder: {
    height: 150,
    backgroundColor: "#E8F0E8",
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapText: { color: Colors.textMuted, marginTop: Spacing.xs, fontSize: 12 },
  didYouKnow: {
    backgroundColor: "#FFF9E6",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  didYouKnowTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  didYouKnowText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  artisanScroll: { marginBottom: Spacing.lg },
  noReviews: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
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
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  reviewMeta: { flex: 1 },
  reviewAuthor: { fontSize: 13, fontWeight: "700", color: Colors.text },
  reviewDate: { fontSize: 11, color: Colors.textMuted },
  reviewText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  deepSection: { marginBottom: Spacing.lg },
  deepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  quizItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quizQuestion: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  quizOption: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  errorText: { fontSize: 18, color: Colors.text, marginBottom: Spacing.md },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  errorButtonText: { color: Colors.white, fontWeight: "600" },
});
