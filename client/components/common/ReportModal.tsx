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

interface ReportModalProps {
  visible: boolean;
  title?: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  title = "Report Content",
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setDescription("");
      setTouched(false);
    }
  }, [visible]);

  const showError = touched && description.trim().length < 5;

  const handleSubmit = () => {
    setTouched(true);
    if (description.trim().length < 5) return;
    onSubmit(description.trim());
  };

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
            <Text style={styles.subLabel}>
              Tell us what's wrong. Your report is anonymous and will be
              reviewed by our team.
            </Text>

            <Text style={styles.label}>Report description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the issue..."
              placeholderTextColor={Colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              editable={!submitting}
            />
            {showError && (
              <Text style={styles.errorText}>
                Please describe the issue (at least 5 characters).
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
                style={styles.reportBtn}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.reportText}>Report</Text>
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
    marginBottom: Spacing.sm,
  },
  subLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 18,
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
    backgroundColor: Colors.border,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
  },
  cancelText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  reportBtn: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    minWidth: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  reportText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});

export default ReportModal;
