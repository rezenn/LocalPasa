import React, { useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";
import { Colors } from "../../constants/theme";

interface SimpleSliderProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}

const THUMB_SIZE = 24;

export default function SimpleSlider({
  min,
  max,
  value,
  step = 1,
  onChange,
}: SimpleSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);
  const thumbOffsetRef = useRef(0);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const valueToX = (v: number) => {
    if (trackWidthRef.current <= 0) return 0;
    const clamped = clamp(v);
    const pct = (clamped - min) / (max - min || 1);
    return pct * trackWidthRef.current;
  };

  const xToValue = (x: number) => {
    const width = trackWidthRef.current || 1;
    const clampedX = Math.max(0, Math.min(x, width));
    const pct = clampedX / width;
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const x = e.nativeEvent.locationX - THUMB_SIZE / 2;
          const newValue = xToValue(x);
          onChange(newValue);
        },
        onPanResponderMove: (e) => {
          const x = e.nativeEvent.locationX - THUMB_SIZE / 2;
          const newValue = xToValue(x);
          onChange(newValue);
        },
      }),
    [min, max, step, onChange],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w - THUMB_SIZE;
    setTrackWidth(w);
  };

  const thumbX = trackWidth ? valueToX(value) : 0;

  return (
    <View style={styles.wrap}>
      <View
        style={styles.trackContainer}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} />
        <View style={[styles.fill, { width: thumbX }]} />
        <View
          style={[
            styles.thumb,
            { transform: [{ translateX: thumbX - THUMB_SIZE / 2 }] },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  trackContainer: {
    height: 32,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    width: "100%",
  },
  fill: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    left: 0,
  },
  thumb: {
    position: "absolute",
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
