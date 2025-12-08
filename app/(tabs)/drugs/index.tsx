// app/(tabs)/drugs/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { loadDrugGroups } from "../../../src/services/drugs";
import type { DrugGroupItem } from "../../../src/types/drugs";
import { colors, radius, spacing } from "../../../src/theme";

export default function DrugGroupsScreen() {
  const router = useRouter();

  const groups: DrugGroupItem[] = useMemo(
    () => loadDrugGroups(),
    []
  );

  const handlePressGroup = (groupId: string) => {
    router.push({
      pathname: "/(tabs)/drugs/[group]",
      params: { group: groupId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Tiêu đề */}
        <Text style={styles.screenTitle}>Nhóm thuốc thú y</Text>

        {/* Card giới thiệu */}
        <View style={styles.introCard}>
          <View style={styles.introHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.introTitle}>Cẩm nang tra cứu thuốc</Text>
          </View>
          <Text style={styles.introText}>
            Phần này giúp tra cứu nhanh các nhóm thuốc thú y thường gặp cho
            dê, lợn, bò, gà.
          </Text>
          <Text style={styles.introText}>
           Ứng dụng chỉ hiển thị tên hoạt chất và gợi ý định tính,
          </Text>
          <Text style={styles.introText}>
            Khi sử dụng thuốc: luôn đọc kỹ nhãn, tuân thủ hướng dẫn trên bao
            bì hoặc ý kiến bác sĩ thú y.
          </Text>
          <Text style={styles.introText}>
           Thông tin trong ứng dụng chỉ mang tính
            tham khảo.
          </Text>
        </View>

        {/* Danh sách nhóm thuốc */}
        <Text style={styles.sectionTitle}>Nhóm thuốc</Text>

        {groups.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={styles.item}
            onPress={() => handlePressGroup(g.id)}
          >
            <View style={styles.itemLeft}>
              <Ionicons
                name="medkit-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.itemText}>{g.name}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ))}
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
  screenTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
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
});
