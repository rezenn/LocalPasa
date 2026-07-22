import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import SiteCard from "../../components/cards/SiteCard";
import ArtisanCard from "../../components/cards/ArtisansCard";
import EventCard from "../../components/cards/EventCard";
import { savedApi } from "../../api/index";
import { useAsync } from "../../hooks/index";
import { Site, Artisan, Event } from "../../types";
import { CardRowSkeleton, EventListSkeleton } from "../../components/skeletons";
import {
  getAllSavedExtras,
  setSavedNote,
  setSavedReminder,
  clearSavedReminder,
  SavedExtra,
} from "../../utils/savedExtras";
import { scheduleLocalNotification } from "../../utils/notifications";

const REMINDER_OPTIONS = [
  { label: "Tomorrow", days: 1 },
  { label: "This weekend", days: 5 },
  { label: "Next week", days: 7 },
];

const TABS = ["Sites", "Artisans", "Events"] as const;
type TabKey = (typeof TABS)[number];

export default function SavedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("Sites");
  const [extras, setExtras] = useState<Record<string, SavedExtra>>({});
  const [noteModalItem, setNoteModalItem] = useState<{
    id: string;
    type: "site" | "artisan" | "event";
    name: string;
  } | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const { data, loading, error, refetch } = useAsync(
    () => savedApi.getAll(),
    [],
  );

  const loadExtras = async () => {
    const all = await getAllSavedExtras();
    setExtras(all);
  };

  useEffect(() => {
    loadExtras();
  }, []);

  const openNoteModal = (
    id: string,
    type: "site" | "artisan" | "event",
    name: string,
  ) => {
    const key = `${type}:${id}`;
    setNoteDraft(extras[key]?.note ?? "");
    setNoteModalItem({ id, type, name });
  };

  const saveNote = async () => {
    if (!noteModalItem) return;
    await setSavedNote(
      noteModalItem.id,
      noteModalItem.type,
      noteDraft.slice(0, 300),
    );
    await loadExtras();
    setNoteModalItem(null);
  };

  const pickReminder = async (days: number, label: string) => {
    if (!noteModalItem) return;
    const date = new Date();
    date.setDate(date.getDate() + days);
    await setSavedReminder(
      noteModalItem.id,
      noteModalItem.type,
      date.toISOString(),
      label,
    );
    // Schedule the actual on-device notification for this reminder
    // (US-026) — degrades silently to a stored-only reminder if
    // expo-notifications isn't installed or permission wasn't granted.
    await scheduleLocalNotification(
      "Time to plan your visit!",
      `You saved "${noteModalItem.name}" for ${label.toLowerCase()} — don't forget to check it out.`,
      date,
    );
    await loadExtras();
  };

  const removeReminder = async () => {
    if (!noteModalItem) return;
    await clearSavedReminder(noteModalItem.id, noteModalItem.type);
    await loadExtras();
  };

  const sites: Site[] = (data?.sites as Site[]) ?? [];

  // Export/share the saved list as a plain-text trip plan (US-032) — uses
  // React Native's built-in Share sheet rather than a generated PDF, so a
  // travel companion can receive it via any app (Messages, WhatsApp, email…).
  const exportSavedList = async () => {
    if (sites.length === 0) {
      Alert.alert("Nothing to export", "Save a few places first.");
      return;
    }
    const lines = sites.map((site, i) => {
      const note = extras[`site:${site._id}`]?.note;
      return `${i + 1}. ${site.name} — ${site.city || site.location}${
        note ? `\n   Note: ${note}` : ""
      }`;
    });
    const message = `My LocalPasa trip plan 🇳🇵\n\n${lines.join("\n")}`;
    try {
      await Share.share({ message, title: "My LocalPasa Trip Plan" });
    } catch {
      // person cancelled the share sheet — nothing to do
    }
  };
  const artisans: Artisan[] = (data?.artisans as Artisan[]) ?? [];
  const events: Event[] = (data?.events as Event[]) ?? [];

  const handleUnsave = async (
    itemId: string,
    itemType: "site" | "artisan" | "event",
  ) => {
    Alert.alert("Remove from saved?", "This item will be removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await savedApi.remove(itemId, itemType);
            refetch();
          } catch {
            Alert.alert("Error", "Failed to remove item. Please try again.");
          }
        },
      },
    ]);
  };

  const counts: Record<TabKey, number> = {
    Sites: sites.length,
    Artisans: artisans.length,
    Events: events.length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Saved Places</Text>
            <Text style={styles.headerSub}>Your personal collection</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.itineraryBtn}
              onPress={exportSavedList}
            >
              <Ionicons name="share-outline" size={14} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itineraryBtn}
              onPress={() => router.push("/itinerary" as any)}
            >
              <Ionicons name="map" size={14} color={Colors.white} />
              <Text style={styles.itineraryBtnText}>Build Itinerary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
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
            {counts[tab] > 0 && (
              <View
                style={[styles.badge, activeTab === tab && styles.badgeActive]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    activeTab === tab && styles.badgeTextActive,
                  ]}
                >
                  {counts[tab]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        activeTab === "Sites" ? (
          <CardRowSkeleton variant="site" />
        ) : activeTab === "Artisans" ? (
          <CardRowSkeleton variant="artisan" />
        ) : (
          <EventListSkeleton />
        )
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Failed to load saved items</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Sites tab */}
          {activeTab === "Sites" &&
            (sites.length === 0 ? (
              <EmptyState message="No saved sites yet" />
            ) : (
              <FlatList
                data={sites}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  const extra = extras[`site:${item._id}`];
                  return (
                    <View style={styles.savedRow}>
                      <SiteCard
                        site={item}
                        onPress={() => router.push(`/site/${item._id}` as any)}
                      />
                      <TouchableOpacity
                        style={styles.unsaveBtn}
                        onPress={() => handleUnsave(item._id, "site")}
                      >
                        <Text style={styles.unsaveText}>✕</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.noteBtn}
                        onPress={() =>
                          openNoteModal(item._id, "site", item.name)
                        }
                      >
                        <Ionicons
                          name={
                            extra?.note
                              ? "document-text"
                              : "document-text-outline"
                          }
                          size={12}
                          color={Colors.white}
                        />
                      </TouchableOpacity>
                      {extra?.reminderDate && (
                        <View style={styles.reminderChip}>
                          <Ionicons
                            name="alarm-outline"
                            size={10}
                            color={Colors.white}
                          />
                          <Text style={styles.reminderChipText}>
                            {extra.reminderLabel || "Reminder set"}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                scrollEnabled={false}
              />
            ))}

          {/* Artisans tab */}
          {activeTab === "Artisans" &&
            (artisans.length === 0 ? (
              <EmptyState message="No saved artisans yet" />
            ) : (
              <FlatList
                data={artisans}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.savedRow}>
                    <ArtisanCard artisan={item} onPress={() => {}} />
                    <TouchableOpacity
                      style={styles.unsaveBtn}
                      onPress={() => handleUnsave(item._id, "artisan")}
                    >
                      <Text style={styles.unsaveText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.noteBtn}
                      onPress={() =>
                        openNoteModal(item._id, "artisan", item.name)
                      }
                    >
                      <Ionicons
                        name={
                          extras[`artisan:${item._id}`]?.note
                            ? "document-text"
                            : "document-text-outline"
                        }
                        size={12}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                scrollEnabled={false}
              />
            ))}

          {/* Events tab */}
          {activeTab === "Events" &&
            (events.length === 0 ? (
              <EmptyState message="No saved events yet" />
            ) : (
              <View>
                {events.map((event) => (
                  <View key={event._id} style={styles.eventRow}>
                    <EventCard event={event} onPress={() => {}} />
                    <TouchableOpacity
                      style={styles.unsaveBtnEvent}
                      onPress={() => handleUnsave(event._id, "event")}
                    >
                      <Text style={styles.unsaveText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.unsaveBtnEvent,
                        { right: Spacing.lg + 34 },
                      ]}
                      onPress={() =>
                        openNoteModal(event._id, "event", event.title)
                      }
                    >
                      <Ionicons
                        name={
                          extras[`event:${event._id}`]?.note
                            ? "document-text"
                            : "document-text-outline"
                        }
                        size={12}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}

          <View style={styles.bottomPad} />
        </ScrollView>
      )}

      {/* Notes & Reminder modal (US-030, US-031) */}
      <Modal
        visible={!!noteModalItem}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModalItem(null)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {noteModalItem?.name}
              </Text>
              <TouchableOpacity onPress={() => setNoteModalItem(null)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Your notes</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Why did you save this? What do you want to do here?"
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={300}
              value={noteDraft}
              onChangeText={setNoteDraft}
            />
            <Text style={styles.charCount}>{noteDraft.length}/300</Text>

            <Text style={styles.modalLabel}>Remind me later</Text>
            <View style={styles.reminderOptionsRow}>
              {REMINDER_OPTIONS.map((opt) => {
                const key = noteModalItem
                  ? `${noteModalItem.type}:${noteModalItem.id}`
                  : "";
                const active = extras[key]?.reminderLabel === opt.label;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[
                      styles.reminderOption,
                      active && styles.reminderOptionActive,
                    ]}
                    onPress={() => pickReminder(opt.days, opt.label)}
                  >
                    <Text
                      style={[
                        styles.reminderOptionText,
                        active && styles.reminderOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {noteModalItem &&
              extras[`${noteModalItem.type}:${noteModalItem.id}`]
                ?.reminderDate && (
                <TouchableOpacity onPress={removeReminder}>
                  <Text style={styles.clearReminderText}>Clear reminder</Text>
                </TouchableOpacity>
              )}

            <TouchableOpacity style={styles.saveNoteBtn} onPress={saveNote}>
              <Text style={styles.saveNoteBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.text}>{message}</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 60 },
  text: { fontSize: 15, color: Colors.textMuted },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    backgroundColor: Colors.brown,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: "CrimsonBold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itineraryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  itineraryBtnText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  headerSub: { fontSize: 12, color: "#E2DBDB", marginTop: 2 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    padding: 4,
    ...Shadow.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    gap: 6,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
  tabTextActive: { color: Colors.white },
  badge: {
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  badgeText: { fontSize: 10, color: Colors.textSecondary, fontWeight: "700" },
  badgeTextActive: { color: Colors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.md },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    flexWrap: "wrap",
    flexDirection: "row",
    gap: Spacing.md,
  },
  savedRow: { position: "relative" },
  unsaveBtn: {
    position: "absolute",
    top: 6,
    right: 6 + Spacing.md,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  unsaveBtnEvent: {
    position: "absolute",
    top: 10,
    right: Spacing.lg + 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  eventRow: { position: "relative" },
  unsaveText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  noteBtn: {
    position: "absolute",
    top: 6,
    right: 6 + Spacing.md + 26,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  reminderChip: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(107,79,58,0.9)",
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  reminderChipText: { color: Colors.white, fontSize: 8, fontWeight: "600" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "CrimsonBold",
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.md,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  noteInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    minHeight: 70,
    fontSize: 14,
    color: Colors.text,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: "right",
    marginTop: 2,
  },
  reminderOptionsRow: { flexDirection: "row", gap: Spacing.sm },
  reminderOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reminderOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  reminderOptionText: { fontSize: 12, color: Colors.textSecondary },
  reminderOptionTextActive: { color: Colors.white, fontWeight: "700" },
  clearReminderText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.sm,
  },
  saveNoteBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  saveNoteBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  errorBox: { alignItems: "center", marginTop: 60, gap: Spacing.md },
  errorText: { fontSize: 15, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  retryText: { color: Colors.white, fontWeight: "600" },
  bottomPad: { height: Spacing.xxxl },
});
