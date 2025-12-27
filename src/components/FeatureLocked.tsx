import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../src/theme";

export function FeatureLocked({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: "center" }}>
        <View
          style={{
            padding: spacing.lg,
            backgroundColor: colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons
            name="warning-outline"
            size={22}
            color={colors.primary}
            style={{ marginBottom: spacing.sm }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.text,
              marginBottom: spacing.xs,
            }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, lineHeight: 20 }}>
            {message}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
