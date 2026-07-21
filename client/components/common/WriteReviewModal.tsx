import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import StarRatingInput from "./StarRatingInput";

interface WriteReviewModalProps {
  visible: boolean;
  title: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  visible,
  title,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setRating(0);
      setText("");
      setTouched(false);
    }
  }, [visible]);

  const handleSave = () => {
    setTouched(true);
    if (rating < 1 || text.trim().length < 5) return;
    onSubmit(rating, text.trim());
  };

  const showRatingError = touched && rating < 1;
  const showTextError = touched && text.trim().length < 5;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.header}>{title}</Text>

          <View style={styles.body}>
            <Text style={styles.label}>Review</Text>
            <Text style={styles.subLabel}>Rate the site</Text>

            <View style={styles.ratingRow}>
              <StarRatingInput rating={rating} onChange={setRating} />
            </View>
            {showRatingError && (
              <Text style={styles.errorText}>Please select a rating.</Text>
            )}

            <Text style={styles.subLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Share your experience..."
              placeholderTextColor={Colors.textMuted}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
              editable={!submitting}
            />
            {showTextError && (
              <Text style={styles.errorText}>
                Please write at least 5 characters.
              </Text>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                disabled={submitting}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.md,
  },
  header: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  body: {
    padding: Spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  ratingRow: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radius.md,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  textArea: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
    padding: Spacing.md,
    fontSize: 14,
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  cancelBtn: {
    backgroundColor: "#F28B82",
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
  },
  cancelText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});

export default WriteReviewModal;
