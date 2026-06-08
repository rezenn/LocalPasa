import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import Colors from "@/constants/colors";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import PhoneInput from "react-native-phone-number-input";
import Toast from "react-native-toast-message";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptConditions, setAcceptConditions] = useState(false);

  const phoneInputRef = React.useRef<PhoneInput>(null);
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    // if (
    //   !firstName ||
    //   !lastName ||
    //   !phoneNumber ||
    //   !email ||
    //   !password ||
    //   !confirmPassword
    // ) {
    //   Alert.alert("Error", "Please fill in all fields");
    //   return;
    // }

    // // Validate email
    // if (!validateEmail(email)) {
    //   Alert.alert("Error", "Please enter a valid email address");
    //   return;
    // }

    // // Validate phone number
    // // const isValidPhoneNumber =
    // //   phoneInputRef.current?.isValidNumber(phoneNumber);
    // // if (!isValidPhoneNumber) {
    // //   Alert.alert("Error", "Please enter a valid international phone number");
    // //   return;
    // // }

    // // Validate password strength
    // if (password.length < 6) {
    //   Alert.alert("Error", "Password must be at least 6 characters");
    //   return;
    // }

    // // Check if passwords match
    // if (password !== confirmPassword) {
    //   Alert.alert("Error", "Passwords do not match");
    //   return;
    // }

    // // Check terms acceptance
    // if (!acceptConditions) {
    //   Alert.alert("Error", "Please accept the terms and conditions");
    //   return;
    // }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully! Please login.",
      });
      router.replace("/(onboarding)/OnboardingScreen1");
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/LoginScreen")}>
          <Text style={styles.signupLink}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer2}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input2}
              placeholder="First Name"
              placeholderTextColor={Colors.text.secondary}
              value={firstName}
              onChangeText={setFirstName}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input2}
              placeholder="Last Name"
              placeholderTextColor={Colors.text.secondary}
              value={lastName}
              onChangeText={setLastName}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor={Colors.text.secondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter your password"
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
              <Text style={styles.eyeText}>
                {showPassword ? (
                  <AntDesign name="eye" size={24} color="black" />
                ) : (
                  <Feather name="eye-off" size={24} color="black" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm password"
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
              <Text style={styles.eyeText}>
                {showPassword2 ? (
                  <AntDesign name="eye" size={24} color="black" />
                ) : (
                  <Feather name="eye-off" size={24} color="black" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={acceptConditions}
              onValueChange={setAcceptConditions}
              color={acceptConditions ? Colors.button.primary : undefined}
            />
            <Text style={styles.checkboxLabel}>
              I accept the terms and Conditions
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divContainer}>
        <View style={styles.divider} />
        <Text style={styles.divText}>Or</Text>
        <View style={styles.divider} />
      </View>

      {/* Google Sign In Button */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() =>
          Alert.alert("Google Signup", "Google Sign In coming soon!")
        }
      >
        <View style={styles.buttonContent}>
          {/* <Image
            source={require("@/assets/images/google-icon.png")}
            style={styles.googleIcon}
            resizeMode="contain"
          /> */}
          <Text style={styles.buttonText}>Sign up with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  form: {
    gap: 20,
    marginTop: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputContainer2: {
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-evenly",
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
  input2: {
    backgroundColor: Colors.background,
    height: 48,
    width: 150,
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
    top: 14,
  },
  eyeText: {
    fontSize: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
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
    marginTop: 10,
    marginBottom: 20,
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
  divContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  divider: {
    marginHorizontal: 10,
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.primary,
  },
  divText: {
    marginHorizontal: 12,
    color: "#888888",
    fontWeight: "500",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DADCE0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4043",
  },
});
