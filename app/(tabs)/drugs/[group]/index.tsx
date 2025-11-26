import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useLayoutEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, radius, shadow, spacing } from "../../../../src/theme";


// ========= IMPORT 9 NHÓM THUỐC =========
import { Ionicons } from "@expo/vector-icons";
import antibiotic from "../../../data/drugs/antibiotic/list.json";
import antiinflammatory from "../../../data/drugs/antiinflammatory_analgesic/list.json";
import externalParasite from "../../../data/drugs/antiparasitic_external/list.json";
import internalParasite from "../../../data/drugs/antiparasitic_internal/list.json";
import bloodParasite from "../../../data/drugs/blood_parasite/list.json";
import digestiveSupport from "../../../data/drugs/digestive_support/list.json";
import electrolyte from "../../../data/drugs/electrolyte/list.json";
import respiratorySupport from "../../../data/drugs/respiratory_support/list.json";
import vitamin from "../../../data/drugs/vitamin_tonic/list.json";

type DrugItem = {
  id: string;
  name: string;
};

// ICON CHO NHÓM
const GROUP_ICONS: Record<string, string> = {
  antibiotic: "medkit-outline",
  antiinflammatory_analgesic: "bandage-outline",
  antiparasitic_external: "shield-checkmark-outline",
  antiparasitic_internal: "bug-outline",
  blood_parasite: "alert-circle-outline",
  digestive_support: "restaurant-outline",
  electrolyte: "water-outline",
  rrespiratory_support: "pulse-outline",

  vitamin_tonic: "sparkles-outline",
};

export default function DrugListByGroupScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { group } = useLocalSearchParams();

  const groupId: string =
    Array.isArray(group) ? group[0] : (group as string);

  const groupTitles: Record<string, string> = {
    antiinflammatory_analgesic: "Kháng viêm - giảm đau",
    antiparasitic_external: "Ký sinh trùng ngoài",
    antiparasitic_internal: "Ký sinh trùng nội",
    blood_parasite: "Ký sinh trùng máu",
    digestive_support: "Hỗ trợ tiêu hoá - đường ruột",
    electrolyte: "Điện giải - bù nước",
    respiratory_support: "Hỗ trợ hô hấp",
    vitamin_tonic: "Vitamin - khoáng - bổ trợ",
    antibiotic: "Kháng sinh",
  };

  const groupDescriptions: Record<string, string> = {
    antiinflammatory_analgesic:
      "Thuốc giảm đau, hạ sốt, kháng viêm. Dùng trong các ca bệnh cấp - mãn.",
    antiparasitic_external:
      "Thuốc trị ve, rận, ghẻ, ký sinh ngoài da.",
    antiparasitic_internal:
      "Thuốc tẩy giun, sán, ký sinh đường ruột.",
    blood_parasite:
      "Thuốc điều trị ký sinh trùng máu, sốt, thiếu máu.",
    digestive_support:
      "Thuốc hỗ trợ tiêu hoá, chướng hơi, rối loạn tiêu hoá.",
    electrolyte:
      "Điện giải - bù nước khi tiêu chảy, mất nước, suy kiệt.",
    respiratory_support:
      "Thuốc hỗ trợ ho, thở khó, viêm phổi.",
    vitamin_tonic:
      "Vitamin, khoáng, thuốc bổ tăng sức đề kháng.",
    antibiotic:
      "Kháng sinh điều trị các ca nhiễm khuẩn.",
  };

  useLayoutEffect(() => {
    const title = groupTitles[groupId] || "Nhóm thuốc";
    navigation.setOptions({ title });
  }, [navigation, groupId]);

  function getDrugListByGroup(groupId: string): DrugItem[] {
    if (groupId === "antiinflammatory_analgesic") return antiinflammatory;
    if (groupId === "antiparasitic_external") return externalParasite;
    if (groupId === "antiparasitic_internal") return internalParasite;
    if (groupId === "blood_parasite") return bloodParasite;
    if (groupId === "digestive_support") return digestiveSupport;
    if (groupId === "electrolyte") return electrolyte;
    if (groupId === "respiratory_support") return respiratorySupport;
    if (groupId === "vitamin_tonic") return vitamin;
    if (groupId === "antibiotic") return antibiotic;
    return [];
  }

  const data = getDrugListByGroup(groupId);
  const titleInScreen = groupTitles[groupId] || "Nhóm thuốc";
  const description =
    groupDescriptions[groupId] || "Các thuốc của nhóm này.";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ===== HEADER TRONG MÀN ===== */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>{titleInScreen}</Text>
          <Text style={styles.subtitle}>{description}</Text>
        </View>

        {/* ===== DANH SÁCH THUỐC ===== */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/drugs/[group]/[id]",
                  params: { group: groupId, id: item.id },
                })
              }
              style={styles.card}
            >
              {/* Icon nhóm */}
              <View style={styles.iconWrap}>
                <Ionicons
                  name={
                    (GROUP_ICONS[groupId] as any) ||
                    "medkit-outline"
                  }
                  size={22}
                  color={colors.primary}
                />
              </View>

              {/* Tên thuốc */}
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>
                  Xem chi tiết công dụng và cách dùng
                </Text>
              </View>

              {/* Chevron */}
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // ===== HEADER =====
  headerBlock: {
    marginBottom: spacing.xl,
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },

  listContent: {
    paddingTop: spacing.sm,
  },

  // ===== CARD THUỐC =====
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
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  cardTextWrap: {
    flex: 1,
    marginRight: spacing.md,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
});
