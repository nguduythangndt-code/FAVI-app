// app/(tabs)/category/[animal]/[group]/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../../../src/theme";


type AnimalType = "goat" | "pig" | "cattle" | "chicken";

type DiseaseItem = {
  id: string;
  name: string;
  group?: string;
};

// ===== MAP TÊN LOÀI & NHÓM =====

const ANIMAL_LABEL: Record<AnimalType, string> = {
  goat: "Dê",
  pig: "Heo",
  cattle: "Bò",
  chicken: "Gà",
};

const GROUP_LABEL: Record<string, string> = {
  respiratory: "Nhóm hô hấp - phổi",
  digestive: "Nhóm tiêu hoá - tiêu chảy",
  parasite: "Nhóm ký sinh trùng",
  blood_parasite: "Nhóm ký sinh trùng máu",
  reproductive: "Nhóm sinh sản",
  other: "Nhóm bệnh khác",
};

// ===== IMPORT LIST JSON CHO TỪNG LOÀI / NHÓM =====
// Cấu trúc data: app/data/<animal>/<group>/list.json

// GOAT
import goatBloodParasite from "../../../../data/goat/blood_parasite/list.json";
import goatDigestive from "../../../../data/goat/digestive/list.json";
import goatOther from "../../../../data/goat/other/list.json";
import goatParasite from "../../../../data/goat/parasite/list.json";
import goatReproductive from "../../../../data/goat/reproductive/list.json";
import goatRespiratory from "../../../../data/goat/respiratory/list.json";

// PIG
import pigBloodParasite from "../../../../data/pig/blood_parasite/list.json";
import pigDigestive from "../../../../data/pig/digestive/list.json";
import pigOther from "../../../../data/pig/other/list.json";
import pigParasite from "../../../../data/pig/parasite/list.json";
import pigReproductive from "../../../../data/pig/reproductive/list.json";
import pigRespiratory from "../../../../data/pig/respiratory/list.json";

// CATTLE
import cattleDigestive from "../../../../data/cattle/digestive/list.json";
import cattleOther from "../../../../data/cattle/other/list.json";
import cattleParasite from "../../../../data/cattle/parasite/list.json";
import cattleReproductive from "../../../../data/cattle/reproductive/list.json";
import cattleRespiratory from "../../../../data/cattle/respiratory/list.json";
import cattleBloodParasite from "../../../../data/cattle/blood_parasite/list.json";

// CHICKEN
import chickenDigestive from "../../../../data/chicken/digestive/list.json";
import chickenOther from "../../../../data/chicken/other/list.json";
import chickenParasite from "../../../../data/chicken/parasite/list.json";
import chickenReproductive from "../../../../data/chicken/reproductive/list.json";
import chickenRespiratory from "../../../../data/chicken/respiratory/list.json";
import chickenBloodParasite from "../../../../data/chicken/blood_parasite/list.json";
// ===== HÀM CHỌN DATA THEO LOÀI + NHÓM =====

const getDiseaseList = (animal: AnimalType, group: string): DiseaseItem[] => {
  switch (animal) {
    case "goat":
      switch (group) {
        case "respiratory":
          return goatRespiratory as DiseaseItem[];
        case "digestive":
          return goatDigestive as DiseaseItem[];
        case "parasite":
          return goatParasite as DiseaseItem[];
        case "blood_parasite":
          return goatBloodParasite as DiseaseItem[];
        case "reproductive":
          return goatReproductive as DiseaseItem[];
        case "other":
          return goatOther as DiseaseItem[];
        default:
          return [];
      }

    case "pig":
      switch (group) {
        case "respiratory":
          return pigRespiratory as DiseaseItem[];
        case "digestive":
          return pigDigestive as DiseaseItem[];
        case "parasite":
          return pigParasite as DiseaseItem[];
        case "blood_parasite":
          return pigBloodParasite as DiseaseItem[];
        case "reproductive":
          return pigReproductive as DiseaseItem[];
        case "other":
          return pigOther as DiseaseItem[];
        default:
          return [];
      }

    case "cattle":
      switch (group) {
        case "respiratory":
          return cattleRespiratory as DiseaseItem[];
        case "digestive":
          return cattleDigestive as DiseaseItem[];
        case "parasite":
          return cattleParasite as DiseaseItem[];
        case "blood_parasite":
          return cattleBloodParasite as DiseaseItem[];
        case "reproductive":
          return cattleReproductive as DiseaseItem[];
        case "other":
          return cattleOther as DiseaseItem[];
        default:
          return [];
      }

    case "chicken":
      switch (group) {
        case "respiratory":
          return chickenRespiratory as DiseaseItem[];
        case "digestive":
          return chickenDigestive as DiseaseItem[];
        case "parasite":
          return chickenParasite as DiseaseItem[];
        case "blood_parasite":
          return chickenBloodParasite as DiseaseItem[];
        case "reproductive":
          return chickenReproductive as DiseaseItem[];
        case "other":
          return chickenOther as DiseaseItem[];
        default:
          return [];
      }

    default:
      return [];
  }
};

export default function DiseaseListScreen() {
  const params = useLocalSearchParams<{ animal?: string; group?: string }>();

  const rawAnimal = (params.animal as AnimalType | undefined) ?? "goat";
  const animal: AnimalType =
    rawAnimal === "pig" ||
    rawAnimal === "cattle" ||
    rawAnimal === "chicken" ||
    rawAnimal === "goat"
      ? rawAnimal
      : "goat";

  const groupKey = (params.group as string) ?? "respiratory";
  const animalLabel = ANIMAL_LABEL[animal];
  const groupLabel = GROUP_LABEL[groupKey] ?? "Nhóm bệnh";

  const diseases = useMemo(
    () => getDiseaseList(animal, groupKey),
    [animal, groupKey]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: `${animalLabel} - ${groupLabel}`,
        }}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{groupLabel}</Text>
            <Text style={styles.subtitle}>
              {animalLabel} · {diseases.length} bệnh trong nhóm này.
            </Text>
          </View>

          {/* Nhãn nhỏ phía trên list */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Danh sách bệnh</Text>
          </View>

          {/* Danh sách bệnh */}
          <FlatList
            data={diseases}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "/(tabs)/category/[animal]/[group]/[id]",
                  params: {
                    animal,
                    group: groupKey,
                    id: item.id,
                  },
                }}
                asChild
              >
                <TouchableOpacity style={styles.card}>
                  <View style={styles.cardTextWrap}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>
                      Mã bệnh: {item.id}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </Link>
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textMuted,
  },

  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTextWrap: {
    flex: 1,
    marginRight: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
