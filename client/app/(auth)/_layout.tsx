import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="SignupScreen" />
      <Stack.Screen name="ForgotPasswordScreen" />
      <Stack.Screen name="ResetPasswordScreen" />
    </Stack>
  );
}
