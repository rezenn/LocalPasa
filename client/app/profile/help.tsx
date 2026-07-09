import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";

const FAQS = [
  {
    q: "How do I save a site or artisan?",
    a: "Tap the heart icon on any site, artisan, or event card to save it. You can view all your saved items under Profile > Saved Places.",
  },
  {
    q: "How does the Translate feature work?",
    a: "The Translate screen uses the MyMemory translation API. Type any text, choose your languages, and tap Translate. You can also tap common phrases to see their translation instantly.",
  },
  {
    q: "What is Kids Mode?",
    a: "Kids Mode on the site detail screen shows fun facts and interactive quizzes about the heritage site in a child-friendly format. Tap an option to answer and see instant feedback.",
  },
  {
    q: "How do I change the app language?",
    a: "Go to Profile > Language, choose your preferred language, and tap Save. The app will remember your preference across sessions.",
  },
  {
    q: "Can I chat with artisans?",
    a: "Yes! On any artisan's profile, tap the Chat with Artisan button. This opens a messaging screen where you can enquire about products and workshops.",
  },
  {
    q: "How do I update my profile photo?",
    a: "Go to Profile > Edit Profile and tap Change Photo to upload or take a new profile picture.",
  },
];

const CONTACT_ITEMS = [
  {
    icon: "mail-outline" as const,
    label: "Email Support",
    value: "support@localpasa.com",
    color: "#2196F3",
  },
  {
    icon: "globe-outline" as const,
    label: "Visit Website",
    value: "www.localpasa.com",
    color: "#4CAF50",
  },
  {
    icon: "logo-instagram" as const,
    label: "Instagram",
    value: "@localpasa",
    color: "#E1306C",
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSub}>We're here to help</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSub}>
            Browse the FAQ or reach out directly
          </Text>
        </View>

        {/* FAQ */}
        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <View
                key={idx}
                style={[
                  styles.faqItem,
                  idx < FAQS.length - 1 && styles.faqItemBorder,
                ]}
              >
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => setOpenFaq(isOpen ? null : idx)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[styles.faqQ, isOpen && styles.faqQOpen]}
                    numberOfLines={isOpen ? undefined : 2}
                  >
                    {item.q}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
                {isOpen && <Text style={styles.faqA}>{item.a}</Text>}
              </View>
            );
          })}
        </View>

        {/* Contact */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
          Contact Us
        </Text>
        <View style={styles.contactCard}>
          {CONTACT_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.contactRow,
                idx < CONTACT_ITEMS.length - 1 && styles.contactRowBorder,
              ]}
              onPress={() => {
                if (item.label === "Email Support")
                  Linking.openURL(`mailto:${item.value}`);
                else if (item.label === "Visit Website")
                  Linking.openURL(`https://${item.value}`);
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.contactIcon,
                  { backgroundColor: item.color + "18" },
                ]}
              >
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactValue}>{item.value}</Text>
              </View>
              <Ionicons
                name="open-outline"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>LocalPasa v1.0.0</Text>
          <Text style={styles.appInfoText}>
            Built with love for Nepal's cultural heritage
          </Text>
        </View>

        <View style={{ height: 40 }} />
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
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  heroBanner: {
    backgroundColor: "#EEF2FF",
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  heroEmoji: { fontSize: 40, marginBottom: Spacing.sm },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  faqList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadow.sm,
  },
  faqItem: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  faqItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    lineHeight: 20,
  },
  faqQOpen: { color: Colors.primary },
  faqA: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadow.sm,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  contactRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  contactIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: { flex: 1 },
  contactLabel: { fontSize: 14, fontWeight: "600", color: Colors.text },
  contactValue: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  appInfo: { alignItems: "center", marginTop: Spacing.xl, gap: 4 },
  appInfoText: { fontSize: 12, color: Colors.textMuted },
});
