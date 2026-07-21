import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Radius } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Single shared shimmer driver reused by every SkeletonBox on screen,
 * instead of each box running its own animation loop. Starts lazily on
 * first mount and keeps looping cheaply (native driver) for the app's
 * lifetime — negligible cost, avoids dozens of independent loops when a
 * screen renders many placeholders at once.
 */
const sharedProgress = new Animated.Value(0);
let sharedLoopStarted = false;
function ensureSharedLoopStarted() {
  if (sharedLoopStarted) return;
  sharedLoopStarted = true;
  Animated.loop(
    Animated.timing(sharedProgress, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }),
  ).start();
}

/** Hook: tracks the OS-level "reduce motion" accessibility setting so
 * skeletons can fall back to a static state instead of animating. */
function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      if (mounted) setReduceMotion(!!enabled);
    });
    const sub = AccessibilityInfo.addEventListener?.(
      "reduceMotionChanged",
      (enabled) => setReduceMotion(!!enabled),
    );
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return reduceMotion;
}

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Single shimmering placeholder block. Building block for every skeleton
 * layout in the app — compose these to match a screen's real shape.
 *
 * - Hidden from screen readers (placeholders carry no information).
 * - Falls back to a static block, no animation, when the user has
 *   "Reduce Motion" enabled (WCAG 2.3.3).
 */
export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = "100%",
  height = 14,
  borderRadius = Radius.sm,
  style,
}) => {
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (!reduceMotion) ensureSharedLoopStarted();
  }, [reduceMotion]);

  const translateX = sharedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: Colors.border,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {!reduceMotion && (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: SCREEN_WIDTH,
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.45)", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
};

/** A block of skeleton text lines with the last line shortened. */
export const SkeletonLines: React.FC<{
  lines?: number;
  lineHeight?: number;
  gap?: number;
  lastLineWidth?: `${number}%`;
  style?: ViewStyle;
}> = ({ lines = 3, lineHeight = 12, gap = 8, lastLineWidth = "60%", style }) => (
  <View
    accessible={false}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    style={[{ gap }, style]}
  >
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        height={lineHeight}
        width={i === lines - 1 ? lastLineWidth : "100%"}
      />
    ))}
  </View>
);

/**
 * Wrap a whole skeleton layout with this so screen readers announce
 * "Loading" once instead of silently skipping content, while every box
 * inside stays hidden from the accessibility tree.
 */
export const SkeletonRegion: React.FC<{
  label?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}> = ({ label = "Loading", style, children }) => (
  <View
    accessible
    accessibilityRole="progressbar"
    accessibilityLabel={label}
    style={style}
  >
    {children}
  </View>
);

export default SkeletonBox;
