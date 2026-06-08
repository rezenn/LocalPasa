import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";

interface StarRatingProps {
  rating: number;
  size?: number;
}

const Ratings: React.FC<StarRatingProps> = ({ rating, size = 12 }) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.floor(rating) ? "star" : "star-outline"}
          size={size}
          color={Colors.star}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 1,
  },
});

export default Ratings;
