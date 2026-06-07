import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Colors from "@/constants/colors";

// Alternative simpler version with just the light gradient overlay
export const SimpleGradientButton = ({
  title = "Get Started",
  onPress = () => router.push("/(auth)/LoginScreen"),
  backgroundColor = Colors.button.primary,
  // ensure a tuple type so expo-linear-gradient accepts it
  lightGradient = ["transparent", "rgba(255,255,255,0.2)"] as readonly [
    string,
    string,
    ...string[],
  ],
}: {
  title?: string;
  onPress?: () => void;
  backgroundColor?: string;
  lightGradient?: readonly [string, string, ...string[]];
}) => {
  return (
    <TouchableOpacity
      style={stylesSimple.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[stylesSimple.background, { backgroundColor }]}>
        <LinearGradient
          colors={lightGradient as readonly [string, string, ...string[]]}
          style={stylesSimple.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1.5 }}
        >
          <Text style={stylesSimple.text}>{title}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const stylesSimple = StyleSheet.create({
  button: {
    borderRadius: 8,
    width: "100%",
    marginTop: 4,
    overflow: "hidden",
  },
  background: {
    width: "100%",
  },
  gradientOverlay: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
  },
});

export default function App() {
  return (
    <SimpleGradientButton
      title="Get Started"
      lightGradient={["transparent", "rgba(255,255,255,0.2)"]}
    />
  );
}
