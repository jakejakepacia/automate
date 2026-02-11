import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/colors";

export default function GradientButton({
  title,
  onPress,
  style,
  textStyle,
  gradient = Colors.primaryGradient,
}) {
  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={gradient}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} // horizontal gradient
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
