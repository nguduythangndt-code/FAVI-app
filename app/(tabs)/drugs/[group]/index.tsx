// app/(tabs)/drugs/[group]/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { loadDrugListByGroup } from "../../../../src/services/drugs";
import type {
  DrugGroupId,
  DrugListItem,
} from "../../../../src/types/drugs";
import { colors, radius, spacing } from "../../../../src/theme";

// Nhãn tiếng Việt cho từng nhóm thuốc
const GROUP_LABELS: Record<DrugGroupId, string> = {
  antibiotic: "Kháng sinh",
  antiinflammatory_analgesic: "Kháng viêm - giảm đau",
  electrolyte: "Điện giải - bù nước",
  vitamin_tonic: "Vitamin - khoáng - bổ trợ",
  antiparasitic_internal: "Ký sinh trùng nội",
  antiparasitic_external: "Ký sinh trùng ngoại",
  respiratory_support: "Hỗ trợ hô hấp",
  digestive_support: "Hỗ trợ tiêu hoá - đường ruột",
  blood_parasite: "Ký sinh trùng máu",
  hormone: "Hormone sinh sản",
  disinfectant_hygiene: "Thuốc khử trùng, sát trùng",
  stimulant: "Hồi sức - Cấp cứu",
  vaccine: "vaccine"
};

export default function DrugListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ group: string }>();

  const group = params.group as DrugGroupId;

  const drugs: DrugListItem[] = useMemo(
    () => loadDrugListByGroup(group),
    [group]
  );

  const groupLabel = GROUP_LABELS[group] ?? "nhóm thuốc này";

  const handlePressDrug = (id: string) => {
    router.push({
      pathname: "/(tabs)/drugs/[group]/[id]",
      params: { group, id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Danh sách thuốc",
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card giới thiệu nhóm thuốc */}
        <View style={styles.introCard}>
          <View style={styles.introHeader}>
            <Ionicons
              name="medkit-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.introTitle}>{groupLabel}</Text>
          </View>
          <Text style={styles.introText}>
            Các thuốc dưới đây là những hoạt chất thường dùng trong nhóm{" "}
            {groupLabel.toLowerCase()}. Ứng dụng chỉ hiển thị tên hoạt chất và
            gợi ý định tính, không cung cấp liều dùng cụ thể.
          </Text>
          <Text style={styles.introText}>
            Khi sử dụng thuốc: luôn đọc kỹ nhãn, tuân thủ hướng dẫn trên bao
            bì hoặc ý kiến bác sĩ thú y. Thông tin chỉ mang tính tham khảo.
          </Text>
        </View>

        {/* Danh sách thuốc */}
        {drugs.map((drug) => (
          <TouchableOpacity
            key={drug.id}
            style={styles.item}
            onPress={() => handlePressDrug(drug.id)}
          >
            <View style={styles.itemLeft}>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.itemText}>{drug.name}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ))}

        {drugs.length === 0 && (
          <Text style={styles.emptyText}>
            Chưa có dữ liệu thuốc cho nhóm này.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  introCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  introHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  introTitle: {
    marginLeft: spacing.xs,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  introText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    marginLeft: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.lg,
    fontSize: 14,
    color: colors.textMuted,
  },
});
