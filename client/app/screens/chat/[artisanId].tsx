import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../api/client";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../../constants/theme";

type ChatMessage = {
  id: string;
  author: "me" | "them";
  text: string;
  ts: number;
};

const STORAGE_PREFIX = "localpasa_chat_";

export default function ChatScreen() {
  const { artisanId } = useLocalSearchParams<{ artisanId: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const flatRef = useRef<FlatList<ChatMessage> | null>(null);

  const storageKey = STORAGE_PREFIX + (artisanId ?? "unknown");

  useEffect(() => {
    (async () => {
      try {
        // try load from server first
        if (artisanId) {
          try {
            const resp = await api.get<{ message: string }>(
              `/chat/${artisanId}`,
            );
            // server returns array in data, but api.get parses data.data — here we expect array
            // The api client returns data directly; adjust if shape differs
            // Fallback to local storage if server call fails
            // @ts-ignore
            const serverMessages = resp as unknown as Array<any>;
            if (serverMessages && serverMessages.length) {
              const mapped = serverMessages.map((m: any) => ({
                id: m._id || String(m.createdAt),
                author: m.userId ? "them" : "them",
                text: m.text,
                ts: new Date(m.createdAt).getTime(),
              }));
              setMessages(mapped as ChatMessage[]);
            } else {
              const raw = await AsyncStorage.getItem(storageKey);
              if (raw) setMessages(JSON.parse(raw));
              else {
                const seed: ChatMessage = {
                  id: `s_${Date.now()}`,
                  author: "them",
                  text: "Hello — thanks for reaching out! How can I help with my work or products?",
                  ts: Date.now(),
                };
                setMessages([seed]);
              }
            }
          } catch {
            const raw = await AsyncStorage.getItem(storageKey);
            if (raw) setMessages(JSON.parse(raw));
          }
        }
      } catch {
        setMessages([]);
      }
    })();
  }, [storageKey]);

  useEffect(() => {
    // persist messages
    AsyncStorage.setItem(storageKey, JSON.stringify(messages)).catch(() => {});
  }, [messages, storageKey]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.length > 1000) return; // simple validation
    const msg: ChatMessage = {
      id: `m_${Date.now()}`,
      author: "me",
      text: trimmed,
      ts: Date.now(),
    };
    setMessages((m) => [...m, msg]);
    setText("");
    setSending(true);

    // optimistic UI — notify backend via API client which handles tokens
    try {
      await api.post(`/chat/send`, { artisanId, text: trimmed });
    } catch {
      // network failed — keep local copy
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.author === "me";
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
        >
          <Text
            style={[
              styles.msgText,
              isMe ? styles.msgTextMe : styles.msgTextThem,
            ]}
          >
            {item.text}
          </Text>
          <Text style={styles.msgTs}>
            {new Date(item.ts).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        <FlatList
          ref={(r) => (flatRef.current = r)}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onContentSizeChange={() =>
            flatRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.composerRow}>
          <TextInput
            style={styles.input}
            placeholder="Write a message..."
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={(t) => {
              if (t.length <= 1000) setText(t);
            }}
            multiline
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={sendMessage}
            disabled={sending || !text.trim()}
          >
            {sending ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Ionicons name="send" size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "CrimsonBold",
    color: Colors.white,
  },
  list: { padding: Spacing.lg, paddingBottom: 12 },
  msgRow: { marginBottom: 10 },
  msgRowMe: { alignItems: "flex-end" },
  msgRowThem: { alignItems: "flex-start" },
  bubble: { maxWidth: "85%", padding: 10, borderRadius: Radius.md },
  bubbleMe: { backgroundColor: Colors.primary, borderTopRightRadius: 4 },
  bubbleThem: { backgroundColor: Colors.surface, borderTopLeftRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 20 },
  msgTextMe: { color: Colors.white },
  msgTextThem: { color: Colors.text },
  msgTs: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: "right",
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    color: Colors.text,
  },
  sendBtn: {
    marginLeft: Spacing.sm,
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
