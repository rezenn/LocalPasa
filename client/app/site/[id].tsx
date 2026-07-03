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
  Animated,
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

// ─── Quiz component ───────────────────────────────────────────────────────────
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

function QuizCard({ quiz, index }: { quiz: QuizQuestion; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleAnswer = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  };

  const reset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <View style={qStyles.card}>
      <View style={qStyles.qHeader}>
        <View style={qStyles.qNum}>
          <Text style={qStyles.qNumText}>{index + 1}</Text>
        </View>
        <Text style={qStyles.question}>{quiz.question}</Text>
      </View>

      <View style={qStyles.options}>
        {quiz.options.map((opt, i) => {
          const isCorrect = i === quiz.correct;
          const isSelected = i === selected;
          let bg: string = Colors.surface;
          let border: string = Colors.border;
          let textColor: string = Colors.text;
          let icon: "checkmark-circle" | "close-circle" | null = null;
          let iconColor: string = Colors.primary;

          if (revealed) {
            if (isCorrect) {
              bg = "#E8F5E9";
              border = "#4CAF50";
              textColor = "#1B5E20";
              icon = "checkmark-circle";
              iconColor = "#4CAF50";
            } else if (isSelected && !isCorrect) {
              bg = "#FFEBEE";
              border = "#F44336";
              textColor = "#B71C1C";
              icon = "close-circle";
              iconColor = "#F44336";
            } else {
              bg = "#FAFAFA";
              border = Colors.border;
              textColor = Colors.textMuted;
            }
          } else if (isSelected) {
            bg = "#EEF2FF";
            border = Colors.primary;
          }

          return (
            <TouchableOpacity
              key={i}
              style={[
                qStyles.option,
                { backgroundColor: bg, borderColor: border },
              ]}
              onPress={() => handleAnswer(i)}
              activeOpacity={revealed ? 1 : 0.75}
              disabled={revealed}
            >
              <View style={qStyles.optionLetter}>
                <Text
                  style={[
                    qStyles.optionLetterText,
                    revealed && isCorrect && { color: "#4CAF50" },
                    revealed &&
                      isSelected &&
                      !isCorrect && { color: "#F44336" },
                  ]}
                >
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text
                style={[qStyles.optionText, { color: textColor }]}
                numberOfLines={3}
              >
                {opt}
              </Text>
              {icon && (
                <Ionicons
                  name={icon}
                  size={20}
                  color={iconColor}
                  style={qStyles.optionIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {revealed && (
        <View style={qStyles.result}>
          {selected === quiz.correct ? (
            <View style={qStyles.resultCorrect}>
              <Ionicons name="trophy" size={18} color="#4CAF50" />
              <Text style={qStyles.resultCorrectText}>
                Correct! Well done! 🎉
              </Text>
            </View>
          ) : (
            <View style={qStyles.resultWrong}>
              <Ionicons name="information-circle" size={18} color="#F57C00" />
              <Text style={qStyles.resultWrongText}>
                The correct answer is{" "}
                <Text style={{ fontWeight: "800" }}>
                  {String.fromCharCode(65 + quiz.correct)}
                </Text>
              </Text>
            </View>
          )}
          <TouchableOpacity style={qStyles.tryAgain} onPress={reset}>
            <Ionicons name="refresh" size={14} color={Colors.primary} />
            <Text style={qStyles.tryAgainText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const qStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  qHeader: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.md },
  qNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brown,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  qNumText: { color: Colors.white, fontSize: 13, fontWeight: "800" },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 22,
  },
  options: { gap: Spacing.sm },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  optionLetter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F0EAE2",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLetterText: { fontSize: 12, fontWeight: "800", color: Colors.primary },
  optionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  optionIcon: { flexShrink: 0 },
  result: {
    marginTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  resultCorrect: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  resultCorrectText: { fontSize: 13, fontWeight: "700", color: "#2E7D32" },
  resultWrong: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  resultWrongText: { fontSize: 13, color: "#E65100" },
  tryAgain: { flexDirection: "row", alignItems: "center", gap: 4 },
  tryAgainText: { fontSize: 12, color: Colors.primary, fontWeight: "600" },
});

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function SiteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Summary");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      Alert.alert(
        "Error",
        err instanceof ApiError ? err.message : "Failed to update saved",
      );
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

  if (error || !site) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={56}
            color={Colors.border}
          />
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
          <View style={styles.heroBadges}>
            {site.isHiddenGem && (
              <View style={styles.gemBadge}>
                <Ionicons name="diamond" size={11} color="#002852" />
                <Text style={styles.gemBadgeText}>Hidden Gem</Text>
              </View>
            )}
            {site.mustVisit && (
              <View style={styles.mustVisitBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={10}
                  color={Colors.white}
                />
                <Text style={styles.mustVisitText}>Must Visit</Text>
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
              <Ionicons name="star" size={12} color={Colors.secondary} />
              <Text style={styles.metaChipText}>
                {displayRating.toFixed(1)}
                {site.reviewCount ? ` (${site.reviewCount})` : ""}
              </Text>
            </View>
            <View style={[styles.metaChip, styles.freeChip]}>
              <Ionicons name="ticket-outline" size={12} color="#2C7A3A" />
              <Text style={[styles.metaChipText, { color: "#2C7A3A" }]}>
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
          {/* ── SUMMARY ── */}
          {activeTab === "Summary" && (
            <>
              <Text style={styles.summaryText}>{site.summary}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtnPrimary}
                  onPress={() => router.push("/translate" as any)}
                >
                  <Ionicons
                    name="language-outline"
                    size={18}
                    color={Colors.white}
                  />
                  <Text style={styles.actionBtnPrimaryText}>Translate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Ionicons
                    name={saved ? "heart" : "heart-outline"}
                    size={18}
                    color={saved ? "#FF6B6B" : Colors.textSecondary}
                  />
                  <Text style={styles.actionBtnSecondaryText}>
                    {saved ? "Saved" : "Save"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnSecondary}>
                  <Ionicons
                    name="map-outline"
                    size={18}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.actionBtnSecondaryText}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnSecondary}>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.actionBtnSecondaryText}>Share</Text>
                </TouchableOpacity>
              </View>

              {site.didYouKnow ? (
                <View style={styles.didYouKnow}>
                  <Text style={styles.didYouKnowTitle}>💡 Did You Know?</Text>
                  <Text style={styles.didYouKnowText}>{site.didYouKnow}</Text>
                </View>
              ) : null}

              <View style={styles.locationHeader}>
                <Text style={styles.sectionTitle}>Location</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={40} color={Colors.border} />
                <Text style={styles.mapText}>{site.location}</Text>
              </View>

              {site.nearbyArtisans?.length > 0 && (
                <>
                  <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>Nearby Artisans</Text>
                    <TouchableOpacity
                      onPress={() => router.push("/artisans-list" as any)}
                    >
                      <Text style={styles.linkText}>See all</Text>
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
                        onPress={() =>
                          router.push(`/artisan/${artisan._id}` as any)
                        }
                      />
                    ))}
                  </ScrollView>
                </>
              )}

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>
                  Reviews {site.reviewCount ? `(${site.reviewCount})` : ""}
                </Text>
              </View>
              {!site.reviews?.length ? (
                <Text style={styles.noContent}>
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

          {/* ── DEEP DIVE ── */}
          {activeTab === "Deep Dive" && (
            <>
              {site.history ? (
                <View style={styles.deepSection}>
                  <View style={styles.deepTitleRow}>
                    <Text style={styles.deepEmoji}>🏛</Text>
                    <Text style={styles.deepTitle}>History</Text>
                  </View>
                  <Text style={styles.summaryText}>{site.history}</Text>
                </View>
              ) : null}
              {site.myth ? (
                <View style={styles.deepSection}>
                  <View style={styles.deepTitleRow}>
                    <Text style={styles.deepEmoji}>📖</Text>
                    <Text style={styles.deepTitle}>Myths & Legends</Text>
                  </View>
                  <Text style={styles.summaryText}>{site.myth}</Text>
                </View>
              ) : null}
              {site.openingHours ? (
                <View style={styles.infoBox}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={Colors.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoBoxTitle}>Opening Hours</Text>
                    <Text style={styles.infoBoxText}>{site.openingHours}</Text>
                  </View>
                </View>
              ) : null}
              {!site.history && !site.myth && !site.openingHours && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="book-outline"
                    size={48}
                    color={Colors.border}
                  />
                  <Text style={styles.noContent}>
                    Deep dive content coming soon.
                  </Text>
                </View>
              )}
            </>
          )}

          {/* ── KIDS MODE ── */}
          {activeTab === "Kids Mode" && (
            <>
              <View style={styles.kidsHeader}>
                <Text style={styles.kidsTitle}>🎮 Fun Learning!</Text>
                <Text style={styles.kidsSubtitle}>
                  Test what you know about {site.name}
                </Text>
              </View>

              {site.didYouKnow ? (
                <View style={styles.funFact}>
                  <Text style={styles.funFactEmoji}>💡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.funFactTitle}>Fun Fact!</Text>
                    <Text style={styles.funFactText}>{site.didYouKnow}</Text>
                  </View>
                </View>
              ) : null}

              {(site.quizzes?.length ?? 0) > 0 ? (
                <View>
                  <Text style={styles.quizSectionTitle}>🎯 Quiz Time!</Text>
                  {site.quizzes!.map((quiz, i) => (
                    <QuizCard key={i} quiz={quiz} index={i} />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={{ fontSize: 48 }}>🎯</Text>
                  <Text style={styles.noContent}>
                    No quizzes available yet.
                  </Text>
                </View>
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
  heroWrapper: { height: 260, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
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
  heroBadges: {
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
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 0.5,
    borderColor: "#002852",
  },
  gemBadgeText: { color: "#002852", fontSize: 10, fontWeight: "600" },
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
  freeChip: { backgroundColor: "#E8F5E9", borderColor: "#A5D6A7" },
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
  body: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
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
  actionBtnPrimary: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "700",
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  actionBtnSecondaryText: {
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
  linkText: { fontSize: 13, color: Colors.primary, fontWeight: "500" },
  mapPlaceholder: {
    height: 130,
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
  noContent: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: Spacing.md,
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
  deepTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  deepEmoji: { fontSize: 18 },
  deepTitle: { fontSize: 17, fontWeight: "700", color: Colors.text },
  infoBox: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: "#EEF2FF",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 2,
  },
  infoBoxText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  kidsHeader: {
    backgroundColor: "#FFF9E6",
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: "center",
  },
  kidsTitle: { fontSize: 22, fontWeight: "800", color: Colors.text },
  kidsSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  funFact: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: "#E8F5E9",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  funFactEmoji: { fontSize: 24 },
  funFactTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 4,
  },
  funFactText: { fontSize: 13, color: "#1B5E20", lineHeight: 20 },
  quizSectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  errorText: { fontSize: 18, color: Colors.text },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  errorButtonText: { color: Colors.white, fontWeight: "600" },
});
