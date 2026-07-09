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
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import authApi from "@/api/auth.api";
import { ApiError } from "@/api/client";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.forgotPassword(email.trim().toLowerCase());
      setSent(true);
      Toast.show({
        type: "success",
        text1: "Check your email",
        text2: "If an account exists, a reset link is on its way.",
      });

      // Dev-only convenience: the API echoes the raw token back while no
      // email provider is wired up, so the reset flow can be tested end to
      // end. This block is a no-op once a real email service is connected.
      if (result?.devResetToken) {
        router.push({
          pathname: "/(auth)/ResetPasswordScreen",
          params: { token: result.devResetToken },
        });
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      Alert.alert("Request Failed", message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={36} color={Colors.button.primary} />
        </View>
        <Text style={styles.title}>Check your inbox</Text>
        <Text style={styles.confirmText}>
          If an account exists for {email}, we've sent a link to reset your
          password. It expires in 15 minutes.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace("/(auth)/LoginScreen")}
        >
          <Text style={styles.loginButtonText}>Back to Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendWrap}
          onPress={() => setSent(false)}
        >
          <Text style={styles.resendText}>Didn't get it? Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backRow}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={18} color={Colors.text.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter the email linked to your account and we'll send you a link to
        reset your password.
      </Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.text.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Remembered your password? </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/LoginScreen")}>
          <Text style={styles.signupLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
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
  confirmText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
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
    gap: 20,
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
  signupText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "600",
  },
  signupLink: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: "900",
  },
  resendWrap: {
    marginTop: 16,
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: "600",
  },
});
