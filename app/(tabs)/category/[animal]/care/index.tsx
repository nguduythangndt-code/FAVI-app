import React, { useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { loadCareList } from "../../../../../src/services/care";
import type {
  CareAnimal,
  CareTopicSummary,
} from "../../../../../src/types/care";

export default function CareListScreen() {
  const router = useRouter();
  const { animal } = useLocalSearchParams<{ animal: CareAnimal }>();

  const currentAnimal = (animal as CareAnimal) || "goat";

  const careList = useMemo<CareTopicSummary[]>(() => {
    return loadCareList(currentAnimal);
  }, [currentAnimal]);

  const animalLabel =
    currentAnimal === "goat"
      ? "dê"
      : currentAnimal === "pig"
      ? "lợn"
      : currentAnimal === "cattle"
      ? "bò"
      : "gà";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: "#111827",
          marginBottom: 12,
        }}
      >
        Chăm sóc {animalLabel}
      </Text>

      {careList.map((topic) => (
        <TouchableOpacity
          key={topic.id}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/category/[animal]/care/[careId]",
              params: { animal: currentAnimal, careId: topic.id },
            })
          }
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 12,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="leaf-outline"
            size={24}
            color="#2563eb"
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {topic.name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#6b7280",
                marginTop: 4,
              }}
            >
              {topic.shortDesc}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
