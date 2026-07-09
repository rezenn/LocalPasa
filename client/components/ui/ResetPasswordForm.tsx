import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import authApi from "@/api/auth.api";
import { ApiError } from "@/api/client";

const ResetPasswordForm = () => {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState(params.token ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validatePassword = (p: string) =>
    p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p);

  const handleReset = async () => {
    if (!token) {
      Alert.alert(
        "Error",
        "Missing reset token. Please use the link from your email.",
      );
      return;
    }
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both password fields");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.",
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password, confirmPassword);
      setDone(true);
      Toast.show({
        type: "success",
        text1: "Password reset",
        text2: "You can now log in with your new password.",
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not reset password. Please try again.";
      Alert.alert("Reset Failed", message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="checkmark-circle-outline"
            size={40}
            color={Colors.success}
          />
        </View>
        <Text style={styles.title}>Password Reset!</Text>
        <Text style={styles.subtitle}>
          Your password has been changed successfully. Please log in with
          your new password.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace("/(auth)/LoginScreen")}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter the code from your email and choose a new password.
      </Text>

      <View style={styles.form}>
        {!params.token && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reset Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste the code from your email"
              placeholderTextColor={Colors.text.secondary}
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter new password"
              placeholderTextColor={Colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AntDesign name="eye" size={22} color="black" />
              ) : (
                <Feather name="eye-off" size={22} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Re-enter new password"
              placeholderTextColor={Colors.text.secondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword2}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? (
                <AntDesign name="eye" size={22} color="black" />
              ) : (
                <Feather name="eye-off" size={22} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.hint}>
          At least 8 characters, with an uppercase letter, a lowercase
          letter, and a number.
        </Text>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => router.replace("/(auth)/LoginScreen")}>
          <Text style={styles.signupLink}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  iconCircle: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.background,
    height: 48,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 12,
  },
  hint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
    marginTop: -8,
  },
  loginButton: {
    backgroundColor: Colors.button.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupLink: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: "900",
  },
});
