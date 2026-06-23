import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useArtisan } from "../../hooks/useApi";

interface Message {
  id: string;
  text: string;
  sender: "user" | "artisan";
  time: string;
}

const QUICK_REPLIES = [
  "What are your working hours?",
  "Do you take custom orders?",
  "Can I visit your workshop?",
  "What is your price range?",
];

export default function ChatScreen() {
  const { artisanId } = useLocalSearchParams<{ artisanId: string }>();
  const router = useRouter();
  const { data: artisan } = useArtisan(artisanId ?? "");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Namaste! I'm interested in your craft. Can you tell me more about your work?",
      sender: "user",
      time: "10:30 AM",
    },
    {
      id: "2",
      text: "Namaste! Thank you for reaching out. I specialise in traditional Thangka paintings. I have been practising this art for over 20 years. What specifically would you like to know?",
      sender: "artisan",
      time: "10:32 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text: msgText, sender: "user", time },
    ]);
    setInput("");
    // Simulate artisan reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          text: "Thank you for your message! I'll get back to you shortly. You can also visit my workshop at Thamel, Kathmandu.",
          sender: "artisan",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1200);
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const artisanName = artisan?.name ?? "Artisan";
  const artisanCraft = artisan?.craft ?? "Craftsperson";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.topInfo}>
          <View style={styles.topAvatar}>
            {artisan?.image ? (
              <Image
                source={{ uri: artisan.image }}
                style={styles.topAvatarImg}
              />
            ) : (
              <Text style={styles.topAvatarText}>{artisanName[0]}</Text>
            )}
          </View>
          <View>
            <Text style={styles.topName}>{artisanName}</Text>
            <Text style={styles.topCraft}>{artisanCraft}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.sender === "user"
                  ? styles.bubbleUser
                  : styles.bubbleArtisan,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.sender === "user" && styles.bubbleTextUser,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.bubbleTime,
                  item.sender === "user" && styles.bubbleTimeUser,
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* Quick replies */}
        <View style={styles.quickReplies}>
          <FlatList
            data={QUICK_REPLIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(q) => q}
            contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.quickChip}
                onPress={() => sendMessage(item)}
              >
                <Text style={styles.quickChipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  backBtn: { padding: 4 },
  topInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  topAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  topAvatarImg: { width: 40, height: 40, borderRadius: 20 },
  topAvatarText: { fontWeight: "700", color: Colors.primary, fontSize: 16 },
  topName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  topCraft: { fontSize: 12, color: Colors.textMuted },
  callBtn: { padding: 8 },
  list: { flex: 1 },
  listContent: { padding: Spacing.md, gap: 8 },
  bubble: {
    maxWidth: "80%",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: 2,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleArtisan: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    ...Shadow.sm,
  },
  bubbleText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  bubbleTextUser: { color: Colors.white },
  bubbleTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  bubbleTimeUser: { color: "rgba(255,255,255,0.7)" },
  quickReplies: {
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  quickChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipText: { fontSize: 12, color: Colors.textSecondary },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.5 },
});
