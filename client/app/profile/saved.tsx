import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useSaved } from "../../hooks/useApi";

const TABS = ["Sites", "Artisans", "Events"] as const;
type Tab = (typeof TABS)[number];

export default function SavedScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Sites");
  const { data, loading, error, refetch } = useSaved();

  const sites = data?.sites ?? [];
  const artisans = data?.artisans ?? [];
  const events = data?.events ?? [];

  const total = sites.length + artisans.length + events.length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Saved Places</Text>
          <Text style={styles.headerSub}>{total} bookmarks</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t}
            </Text>
            <View style={[styles.tabCount, tab === t && styles.tabCountActive]}>
              <Text
                style={[
                  styles.tabCountText,
                  tab === t && styles.tabCountTextActive,
                ]}
              >
                {t === "Sites"
                  ? sites.length
                  : t === "Artisans"
                    ? artisans.length
                    : events.length}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.primary}
          size="large"
        />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Failed to load saved items</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {tab === "Sites" &&
            (sites.length === 0 ? (
              <View style={styles.center}>
                <Ionicons
                  name="bookmark-outline"
                  size={48}
                  color={Colors.border}
                />
                <Text style={styles.emptyText}>No saved sites yet</Text>
                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => router.push("/(dashboard)/explore" as any)}
                >
                  <Text style={styles.exploreBtnText}>Explore sites</Text>
                </TouchableOpacity>
              </View>
            ) : (
              sites.map((site: any) => (
                <TouchableOpacity
                  key={site._id}
                  style={styles.card}
                  onPress={() => router.push(`/site/${site._id}` as any)}
                  activeOpacity={0.85}
                >
                  {site.image && (
                    <Image
                      source={{ uri: site.image }}
                      style={styles.cardImg}
                    />
                  )}
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName}>{site.name}</Text>
                    <Text style={styles.cardSub}>
                      {site.city || site.location}
                    </Text>
                    {site.price && (
                      <View style={styles.pricePill}>
                        <Text style={styles.pricePillText}>{site.price}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              ))
            ))}

          {tab === "Artisans" &&
            (artisans.length === 0 ? (
              <View style={styles.center}>
                <Ionicons
                  name="people-outline"
                  size={48}
                  color={Colors.border}
                />
                <Text style={styles.emptyText}>No saved artisans yet</Text>
                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => router.push("/artisans-list" as any)}
                >
                  <Text style={styles.exploreBtnText}>Browse artisans</Text>
                </TouchableOpacity>
              </View>
            ) : (
              artisans.map((a: any) => (
                <TouchableOpacity
                  key={a._id}
                  style={styles.card}
                  onPress={() => router.push(`/artisan/${a._id}` as any)}
                  activeOpacity={0.85}
                >
                  {a.image && (
                    <Image source={{ uri: a.image }} style={styles.cardImg} />
                  )}
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName}>{a.name}</Text>
                    <Text style={styles.cardSub}>
                      {a.craft} · {a.city || a.location}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              ))
            ))}

          {tab === "Events" &&
            (events.length === 0 ? (
              <View style={styles.center}>
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={Colors.border}
                />
                <Text style={styles.emptyText}>No saved events yet</Text>
                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => router.push("/events-list" as any)}
                >
                  <Text style={styles.exploreBtnText}>Browse events</Text>
                </TouchableOpacity>
              </View>
            ) : (
              events.map((e: any) => (
                <TouchableOpacity
                  key={e._id}
                  style={styles.card}
                  onPress={() => router.push(`/event/${e._id}` as any)}
                  activeOpacity={0.85}
                >
                  <View style={styles.dateBox}>
                    <Text style={styles.dateNum}>{e.date}</Text>
                    <Text style={styles.dateMonth}>{e.month}</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName}>{e.title}</Text>
                    <Text style={styles.cardSub}>{e.location}</Text>
                    <Text style={styles.cardPrice}>{e.price}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              ))
            ))}

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.brown,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, color: Colors.white, fontFamily: "CrimsonBold" },
  headerSub: { fontSize: 12, color: "#E2DBDB" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: "500" },
  tabTextActive: { color: Colors.primary, fontWeight: "700" },
  tabCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabCountActive: { backgroundColor: Colors.primary },
  tabCountText: { fontSize: 11, color: Colors.textMuted, fontWeight: "700" },
  tabCountTextActive: { color: Colors.white },
  list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    overflow: "hidden",
    ...Shadow.sm,
    paddingRight: Spacing.md,
  },
  cardImg: { width: 68, height: 68 },
  dateBox: {
    width: 52,
    height: 52,
    backgroundColor: Colors.brown,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
    borderRadius: Radius.md,
  },
  dateNum: { color: Colors.white, fontSize: 16, fontWeight: "800" },
  dateMonth: {
    color: "#E2DBDB",
    fontSize: 9,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  cardBody: { flex: 1, paddingVertical: Spacing.sm },
  cardName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  cardSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardPrice: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  pricePill: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 4,
  },
  pricePillText: { fontSize: 10, color: "#2C7A3A", fontWeight: "600" },
  center: { alignItems: "center", gap: Spacing.md, marginTop: 80 },
  emptyText: { fontSize: 15, color: Colors.textMuted },
  exploreBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  exploreBtnText: { color: Colors.white, fontWeight: "600" },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
});
