// app/(tabs)/category/[animal]/care/[careId].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from "react-native";

import { loadCareDetail } from "../../../../../src/services/care";
import { CareAnimal, CareDetail } from "../../../../../src/types/care";
import { colors, spacing, radius, shadow } from "../../../../../src/theme";
import { logCareView } from "../../../../../src/services/analytics";

export default function CareDetailScreen() {
  const params = useLocalSearchParams<{
    animal?: string;
    careId?: string;
  }>();

  const animalParam = (params.animal || "") as CareAnimal;
  const careId = (params.careId || "").toString();

  const scrollRef = useRef<ScrollView | null>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const baseOffset = useRef<number>(0);
  const viewStartRef = useRef<number | null>(null); // dùng để đo thời gian ở màn

  const careDetail: CareDetail | null = useMemo(() => {
    if (!animalParam || !careId) return null;
    return loadCareDetail(animalParam, careId);
  }, [animalParam, careId]);

  const detail: any = careDetail || {};

  const title: string = detail.title || detail.name || "Chăm sóc";

  const sections: any[] = Array.isArray(detail.sections)
    ? detail.sections
    : [];

  const overviewText: string =
    detail.overview || detail.summary || detail.shortDesc || "";

  const notesList: string[] = Array.isArray(detail.notes)
    ? detail.notes
    : Array.isArray(detail.warnings)
    ? detail.warnings
    : [];

  const warningText: string | null =
    typeof detail.warning === "string"
      ? detail.warning
      : typeof detail.disclaimer === "string"
      ? detail.disclaimer
      : null;

  // ================= LOG FIREBASE: XEM MỤC CHĂM SÓC =================
  useEffect(() => {
    // nếu không có dữ liệu thì không log
    if (!careDetail) return;

    // đánh dấu thời điểm bắt đầu xem
    viewStartRef.current = Date.now();

    return () => {
      const start = viewStartRef.current;
      if (!start) return;

      const duration = Date.now() - start;

      // chỉ log hành vi "xem thật" – ví dụ ở lại >= 12 giây
      if (duration >= 12000) {
        logCareView({
          animal: String(animalParam),
          careId: String(careId),
          careName: title,
          timeOnScreenMs: duration,
        });
      }
    };
    // phụ thuộc theo animal/careId/title; khi rời màn hoặc đổi mục sẽ chạy cleanup
  }, [animalParam, careId, title, careDetail]);
  // ================================================================

  const handlePressSection = (sectionId: string) => {
    const y = sectionPositions.current[sectionId];
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: Math.max(y - 80, 0),
        animated: true,
      });
    }
  };

  const handleContentLayout = (
    e: NativeSyntheticEvent<LayoutChangeEvent["nativeEvent"]>
  ) => {
    // lưu offset gốc để cuộn cho chuẩn khi có card phía trên
    baseOffset.current = e.nativeEvent.layout.y;
  };

  const handleSectionLayout = (sectionId: string, y: number) => {
    sectionPositions.current[sectionId] = y + baseOffset.current;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title }} />

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onLayout={handleContentLayout}
      >
        {/* Nếu không có dữ liệu */}
        {!careDetail && (
          <View style={styles.card}>
            <Text style={styles.title}>Chưa có nội dung</Text>
            <Text style={styles.bodyText}>
              Mục chăm sóc này hiện chưa có nội dung chi tiết.{"\n"}
              Sẽ được cập nhật trong các phiên bản sau.
            </Text>
          </View>
        )}

        {careDetail && (
          <>
            {/* Tổng quan */}
            <View style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              {overviewText ? (
                <Text style={styles.summary}>{overviewText}</Text>
              ) : null}
            </View>

            {/* MENU SECTIONS */}
            {sections.length > 0 && (
              <View style={styles.menuCard}>
                <Text style={styles.menuLabel}>Các mục trong hướng dẫn</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.menuScrollContent}
                >
                  {sections.map((section) => (
                    <TouchableOpacity
                      key={section.id}
                      style={styles.menuChip}
                      onPress={() => handlePressSection(section.id)}
                    >
                      <Text style={styles.menuChipText}>
                        {section.title || "Mục"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* NỘI DUNG CHI TIẾT CÁC MỤC */}
            {sections.length > 0 && (
              <View style={styles.card}>
                {sections.map((section: any) => {
                  const bodyArray: string[] =
                    Array.isArray(section.bullets) && section.bullets.length > 0
                      ? section.bullets
                      : Array.isArray(section.body) && section.body.length > 0
                      ? section.body
                      : section.content
                      ? [section.content]
                      : section.description
                      ? [section.description]
                      : [];

                  return (
                    <View
                      key={section.id}
                      style={styles.sectionBlock}
                      onLayout={(e) =>
                        handleSectionLayout(
                          section.id,
                          e.nativeEvent.layout.y
                        )
                      }
                    >
                      <Text style={styles.sectionTitle}>
                        {section.title || "Mục"}
                      </Text>

                      {/* goal (nếu có) */}
                      {section.goal && (
                        <Text style={styles.sectionGoal}>{section.goal}</Text>
                      )}

                      {/* content + bullets */}
                      {bodyArray.map((line, index) => (
                        <Text key={index} style={styles.bodyText}>
                          • {line}
                        </Text>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}

            {/* LƯU Ý (notes) */}
            {notesList.length > 0 && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>Lưu ý quan trọng</Text>
                {notesList.map((w, idx) => (
                  <Text key={idx} style={styles.warningText}>
                    • {w}
                  </Text>
                ))}
              </View>
            )}

            {/* CẢNH BÁO / DISCLAIMER */}
            {warningText && (
              <View style={styles.disclaimerCard}>
                <Text style={styles.disclaimerText}>{warningText}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  summary: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },

  // MENU SECTION
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  menuScrollContent: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  menuChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#f3f4f6",
  },
  menuChipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },

  sectionBlock: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionGoal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563eb",
    marginBottom: spacing.xs,
  },
  bodyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },

  warningCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },

  disclaimerCard: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 18,
  },
});
