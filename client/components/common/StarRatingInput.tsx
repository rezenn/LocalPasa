import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";

interface StarRatingInputProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: number;
  color?: string;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onChange,
  size = 32,
  color = Colors.star,
}) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i)}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={size}
            color={color}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
});

export default StarRatingInput;
