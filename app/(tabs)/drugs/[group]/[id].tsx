// app/(tabs)/drugs/[group]/[id].tsx

import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { loadDrugDetail } from "../../../../src/services/drugs";
import type { DrugGroupId } from "../../../../src/types/drugs";
import { colors, radius, spacing } from "../../../../src/theme";

export default function DrugDetailScreen() {
  const params = useLocalSearchParams<{ group: string; id: string }>();

  const group = params.group as DrugGroupId;
  const id = params.id as string;

  const detail = useMemo(
    () => loadDrugDetail(group, id),
    [group, id]
  );

     const hasAnyContent =
    !!detail &&
    !!(
      detail.mechanism ||
      (detail.clinical_uses && detail.clinical_uses.length > 0) ||
      (detail.pros && detail.pros.length > 0) ||
      (detail.cons && detail.cons.length > 0) ||
      (detail.advantages && detail.advantages.length > 0) ||
      (detail.disadvantages && detail.disadvantages.length > 0) ||
      (detail.mild_side_effects &&
        detail.mild_side_effects.length > 0) ||
      (detail.side_effects && detail.side_effects.length > 0) ||
      (detail.usage_recommendations &&
        detail.usage_recommendations.length > 0) ||
      (detail.recommendations &&
        detail.recommendations.length > 0) ||
      (detail.when_not_to_use &&
        detail.when_not_to_use.length > 0) ||
      (detail.contraindications &&
        detail.contraindications.length > 0) ||
      (detail.alternative_drugs &&
        detail.alternative_drugs.length > 0) ||
      (detail.alternatives &&
        detail.alternatives.length > 0) ||
      detail.note
    );




  const renderSection = (
    title: string,
    items?: string[]
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map((line: string, idx: number) => (
          <Text key={idx} style={styles.bullet}>
            • {line}
          </Text>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: detail?.name ?? "Chi tiết thuốc",
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {!detail ? (
          <Text style={styles.emptyText}>
            Không tìm thấy dữ liệu thuốc.
          </Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>{detail.name}</Text>

            {/* Cơ chế */}
            {detail.mechanism && (
              <>
                <Text style={styles.sectionTitle}>Cơ chế tác dụng</Text>
                <Text style={styles.paragraph}>
                  {detail.mechanism}
                </Text>
              </>
            )}

            {/* Khi nên dùng */}
            {renderSection(
              "Khi nên dùng",
              detail.clinical_uses
            )}

            {/* Ưu điểm */}
            {renderSection("Ưu điểm", detail.pros || detail.advantages)}

            {/* Nhược điểm */}
            {renderSection(
              "Nhược điểm",
              detail.cons || detail.disadvantages
            )}

            {/* Tác dụng phụ */}
            {renderSection(
              "Tác dụng phụ",
              detail.mild_side_effects || detail.side_effects
            )}

            {/* Khuyến cáo sử dụng */}
            {renderSection(
              "Khuyến cáo khi dùng",
              detail.usage_recommendations ||
                detail.recommendations
            )}

            {/* Khi không nên dùng */}
            {renderSection(
              "Khi không nên dùng",
              detail.when_not_to_use ||
                detail.contraindications
            )}

            {/* Thuốc có thể thay thế */}
            {renderSection(
              "Thuốc có thể thay thế",
              detail.alternative_drugs ||
                detail.alternatives
            )}

            {/* Nếu hoàn toàn chưa có content chi tiết → text mặc định */}
            {!hasAnyContent && (
              <>
                <Text style={styles.defaultText}>
                  Đây là mục tra cứu cho thuốc {detail.name}. Hiện tại ứng
                  dụng chưa cập nhật đầy đủ thông tin chi tiết cho thuốc này.
                </Text>
                <Text style={styles.defaultText}>
                  Khi sử dụng thuốc: luôn đọc kỹ nhãn, tuân thủ hướng dẫn trên
                  bao bì hoặc ý kiến bác sĩ thú y. Ứng dụng không cung cấp liều
                  dùng cụ thể, chỉ mang tính tham khảo.
                </Text>
              </>
            )}

            {/* Ghi chú chung / disclaimer riêng */}
            {detail.note && (
              <Text style={styles.disclaimer}>{detail.note}</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  bullet: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 2,
  },
  paragraph: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  defaultText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  disclaimer: {
    marginTop: spacing.lg,
    fontSize: 12,
    color: colors.textMuted,
  },
});
