import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DISCLAIMER_SHORT, DISCLAIMER_FULL } from "../constants/disclaimer";
import { colors, radius, spacing } from "../theme";

type Props = {
  variant?: "short" | "full";
  style?: any;
};

export function Disclaimer({ variant = "short", style }: Props) {
  const text = variant === "full" ? DISCLAIMER_FULL : DISCLAIMER_SHORT;

  return (
    <View style={[styles.box, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: "#fefce8",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
