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
import * as ImagePicker from "expo-image-picker";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { profileApi } from "../../api/index";
import { useAuth } from "../../context/AuthContext";
import { usePreferences } from "../../context/PreferencesContext";
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
  // Prefill instantly from what we already have client-side (from
  // login/register/AsyncStorage) instead of blocking on a network call —
  // this screen needs to work even if the backend is slow or unreachable.
  const { user, updateUser } = useAuth();
  const {
    prefs,
    setNationality: persistNationality,
    setAvatar: persistAvatar,
  } = usePreferences();
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [nationality, setNationality] = useState(prefs.nationality ?? "");
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  // Local device photo takes priority over whatever the backend has on
  // file — avatar upload/storage isn't wired up server-side yet, so the
  // photo is kept on-device (same pattern as nationality).
  const avatarUri = prefs.avatarUri || user?.avatar || "";

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to set a profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    const uri = result.assets[0].uri;
    setUploadingPhoto(true);
    try {
      // Apply immediately so it's visible everywhere (Profile, header, etc.)
      await persistAvatar(uri);
      updateUser({ avatar: uri });

      // Best-effort backend sync — safe to fail silently since the photo
      // already stuck locally.
      try {
        await profileApi.update({ avatar: uri });
      } catch (err) {
        console.warn("Avatar: backend sync failed, kept local photo", err);
      }

      Toast.show({ type: "success", text1: "Profile photo updated!" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // If the user object arrives/changes after mount (e.g. restored on app
  // start), sync the form once so we don't clobber in-progress edits.
  useEffect(() => {
    if (user) {
      setFirstName((prev) => prev || user.firstName || "");
      setLastName((prev) => prev || user.lastName || "");
      setPhone((prev) => prev || user.phoneNumber || "");
    }
  }, [user]);

  const handleSave = async () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    if (!trimmedFirst) {
      Alert.alert("Validation", "First name cannot be empty.");
      return;
    }
    setSaving(true);

    // Apply the edit locally right away — Profile, header greetings, etc.
    // all read from AuthContext/Preferences, so this makes the change feel
    // instant regardless of backend availability.
    updateUser({
      firstName: trimmedFirst,
      lastName: trimmedLast,
      phoneNumber: phone.trim(),
    });
    await persistNationality(nationality.trim());

    // Best-effort sync to the backend. If it fails (offline, backend not
    // running, etc.) the local edit above still stands — we just log it.
    try {
      await profileApi.update({
        fullName: `${trimmedFirst} ${trimmedLast}`.trim(),
        phone: phone.trim(),
        nationality: nationality.trim(),
      });
    } catch (err) {
      console.warn("Profile update: backend sync failed, kept local edit", err);
    }

    setSaving(false);
    Toast.show({ type: "success", text1: "Profile updated!" });
    router.back();
  };

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
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changePhotoBtn}
            onPress={handleChangePhoto}
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <Ionicons name="camera" size={14} color={Colors.primary} />
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </>
            )}
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
            <Text style={styles.inputDisabledText}>{user?.email ?? ""}</Text>
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
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
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
