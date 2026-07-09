import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [messages, setMessages] = useState<Message[]>([]);
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
          text: "Thank you for your message! I'll get back to you shortly. You can also visit my workshop.",
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
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
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
              contentContainerStyle={styles.quickContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.quickChip}
                  onPress={() => sendMessage(item)}
                  activeOpacity={0.7}
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
              returnKeyType="send"
              onSubmitEditing={() => sendMessage()}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={() => sendMessage()}
              disabled={!input.trim()}
              activeOpacity={0.7}
            >
              <Ionicons name="send" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  backBtn: {
    padding: 4,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  topAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary + "30",
  },
  topAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  topAvatarText: {
    fontWeight: "700",
    color: Colors.primary,
    fontSize: 18,
  },
  topName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  topCraft: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  callBtn: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Colors.primary + "10",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: 4,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    ...Shadow.sm,
  },
  bubbleArtisan: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: Colors.white,
  },
  bubbleTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  bubbleTimeUser: {
    color: "rgba(255,255,255,0.8)",
  },
  quickReplies: {
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border + "30",
  },
  quickContent: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  quickChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  quickChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.badge,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.sm,
  },
  sendBtnDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.border,
  },
});
