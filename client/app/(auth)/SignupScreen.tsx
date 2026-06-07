import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";
import Colors from "@/constants/colors";
import SignupForm from "@/components/ui/RegisterForm";

const LoginScreen = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.Onboardingbackground }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.skylineContainer}>
            <Image
              source={require("@/assets/images/skyline.png")}
              style={styles.skyline}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formWrapper}>
              <SignupForm />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Onboardingbackground,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  logo: {
    height: 128,
    width: 256,
  },
  skylineContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
  },
  skyline: {
    height: 192,
    width: "100%",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  formWrapper: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
