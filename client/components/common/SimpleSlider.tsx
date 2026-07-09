import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from "react-native";
import { Colors } from "../../constants/theme";

interface SimpleSliderProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}

const THUMB_SIZE = 20;

// A minimal single-thumb slider built on PanResponder so we don't need to
// pull in a native slider dependency (which would need a custom dev client
// to work reliably). Track width is measured on layout; thumb position is
// derived from `value` so it stays controlled.
export default function SimpleSlider({
  min,
  max,
  value,
  step = 1,
  onChange,
}: SimpleSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const valueToX = (v: number) => {
    if (trackWidthRef.current <= 0) return 0;
    const pct = (clamp(v) - min) / (max - min || 1);
    return pct * trackWidthRef.current;
  };

  const xToValue = (x: number) => {
    const width = trackWidthRef.current || 1;
    const pct = clamp2(x / width, 0, 1);
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped);
  };

  const clamp2 = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const x = e.nativeEvent.locationX;
          onChange(xToValue(x));
        },
        onPanResponderMove: (e) => {
          const x = e.nativeEvent.locationX;
          onChange(xToValue(x));
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [min, max, step],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w;
    setTrackWidth(w);
  };

  const thumbX = trackWidth ? valueToX(value) : 0;

  return (
    <View style={styles.wrap} onLayout={onLayout} {...panResponder.panHandlers}>
      <View style={styles.track} />
      <View style={[styles.fill, { width: thumbX }]} />
      <View
        style={[
          styles.thumb,
          { transform: [{ translateX: thumbX - THUMB_SIZE / 2 }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: THUMB_SIZE + 8,
    justifyContent: "center",
    paddingHorizontal: THUMB_SIZE / 2,
    marginHorizontal: -THUMB_SIZE / 2,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  fill: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    left: THUMB_SIZE / 2,
  },
  thumb: {
    position: "absolute",
    left: THUMB_SIZE / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
