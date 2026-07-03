import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { profileApi } from "../../api/index";
import { useAsync } from "../../hooks/index";
import Toast from "react-native-toast-message";

const NATIONALITIES = [
  "Nepali",
  "Indian",
  "Chinese",
  "American",
  "British",
  "Japanese",
  "Korean",
  "German",
  "French",
  "Australian",
  "Canadian",
  "Other",
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: profile, loading } = useAsync(() => profileApi.getMe(), []);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);

  // Prefill once loaded
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setPhone(profile.phone ?? "");
      setNationality(profile.nationality ?? "");
    }
  }, [profile]);

  const handleSave = async () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await profileApi.update({
        fullName,
        phone: phone.trim(),
        nationality: nationality.trim(),
      });
      Toast.show({ type: "success", text1: "Profile updated!" });
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update profile");
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

  const initials = firstName
    ? `${firstName[0]}${lastName[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveHdrBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveHdrText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera" size={14} color={Colors.primary} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={Colors.textMuted}
            autoCorrect={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={Colors.textMuted}
            autoCorrect={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>{profile?.email ?? ""}</Text>
            <Ionicons name="lock-closed" size={14} color={Colors.textMuted} />
          </View>
          <Text style={styles.fieldNote}>Email cannot be changed</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+977 98XXXXXXXX"
            placeholderTextColor={Colors.textMuted}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nationality</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setShowNationalityPicker(!showNationalityPicker)}
          >
            <Text
              style={[
                styles.selectText,
                !nationality && styles.selectPlaceholder,
              ]}
            >
              {nationality || "Select nationality"}
            </Text>
            <Ionicons
              name={showNationalityPicker ? "chevron-up" : "chevron-down"}
              size={16}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
          {showNationalityPicker && (
            <View style={styles.pickerList}>
              {NATIONALITIES.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.pickerItem,
                    nationality === n && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setNationality(n);
                    setShowNationalityPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      nationality === n && styles.pickerItemTextActive,
                    ]}
                  >
                    {n}
                  </Text>
                  {nationality === n && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Role badge */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Account Type</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="person-circle" size={16} color={Colors.primary} />
            <Text style={styles.roleText}>
              {profile?.role
                ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                : "Tourist"}
            </Text>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 32 }} />
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
    justifyContent: "space-between",
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
  saveHdrBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: Radius.full,
  },
  saveHdrText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  avatarSection: { alignItems: "center", marginBottom: Spacing.xl },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadow.md,
  },
  avatarInitials: { fontSize: 36, color: Colors.white, fontWeight: "800" },
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  changePhotoText: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  formGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 15,
    color: Colors.text,
    ...Shadow.sm,
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputDisabledText: { fontSize: 15, color: Colors.textMuted },
  fieldNote: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  selectText: { fontSize: 15, color: Colors.text },
  selectPlaceholder: { color: Colors.textMuted },
  pickerList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    ...Shadow.md,
    overflow: "hidden",
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemActive: { backgroundColor: "#EEF2FF" },
  pickerItemText: { fontSize: 14, color: Colors.text },
  pickerItemTextActive: { color: Colors.primary, fontWeight: "700" },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "#EEF2FF",
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  roleText: { fontSize: 15, color: Colors.primary, fontWeight: "600" },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  saveBtnText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
});
