// app/(tabs)/category/[animal]/care/[careId].tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";


import { loadCareDetail } from "../../../../../src/services/care";
import { CareAnimal, CareDetail } from "../../../../../src/types/care";
import { colors, spacing, radius, shadow } from "../../../../../src/theme";
import { logCareView } from "../../../../../src/services/analytics";

export default function CareDetailScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    animal?: string;
    careId?: string;
  }>();

  const animalParam = (params.animal || "") as CareAnimal;
  const careId = (params.careId || "").toString();

  const scrollRef = useRef<ScrollView | null>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const sectionsContainerOffset = useRef<number>(0);
  const viewStartRef = useRef<number | null>(null); // đo thời gian ở màn
  const menuOffsetY = useRef<number>(0);
const [showScrollTop, setShowScrollTop] = useState(false);

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
    if (!careDetail) return;

    // bắt đầu xem
    viewStartRef.current = Date.now();

    return () => {
      const start = viewStartRef.current;
      if (!start) return;

      const duration = Date.now() - start;

      // chỉ log hành vi "xem thật"
      if (duration >= 12000) {
        logCareView({
          animal: String(animalParam),
          careId: String(careId),
          careName: title,
          timeOnScreenMs: duration,
        });
      }
    };
  }, [animalParam, careId, title, careDetail]);
  // ================================================================

  const handlePressSection = (sectionId: string) => {
    const y = sectionPositions.current[sectionId];
    if (y == null || !scrollRef.current) return;

    scrollRef.current.scrollTo({
      y: Math.max(y - 80, 0), // trừ nhẹ cho khỏi dính sát mép trên
      animated: true,
    });
  };

  // điều hướng sang Quicksearch (không prefill triệu chứng)
  const handleGoToQuicksearch = () => {
  if (!animalParam) return;

  router.push({
    pathname: "/(tabs)/quicksearch",
    params: {
      animal: animalParam,
      fromCare: "1",
      careSession: Date.now().toString(), // 👈 mỗi lần bấm là 1 session mới
    },
  });
};


  // vị trí card chứa toàn bộ sections trong ScrollView
  const handleSectionsContainerLayout = (e: LayoutChangeEvent) => {
    sectionsContainerOffset.current = e.nativeEvent.layout.y;
  };

  // vị trí từng section bên trong card
  const handleSectionLayout = (sectionId: string, e: LayoutChangeEvent) => {
    const localY = e.nativeEvent.layout.y;
    sectionPositions.current[sectionId] =
      sectionsContainerOffset.current + localY;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title }} />

      <ScrollView
  ref={scrollRef}
  style={styles.container}
  contentContainerStyle={styles.content}
  keyboardShouldPersistTaps="handled"
  onScroll={(e) => {
    const y = e.nativeEvent.contentOffset.y;
    // ngưỡng 260px: cuộn xuống đủ sâu mới hiện nút
    setShowScrollTop(y >600 );
  }}
  scrollEventThrottle={16}
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
  <View
    style={styles.menuCard}
    onLayout={(e) => {
      menuOffsetY.current = e.nativeEvent.layout.y;
    }}
  >
                <Text style={styles.menuLabel}>Các mục trong hướng dẫn</Text>
                <Text style={styles.menuHint}>
                  Chạm vào từng mục để nhảy nhanh đến nội dung tương ứng.
                </Text>

                <View style={styles.menuList}>
                  {sections.map((section) => {
                    const isPartHeader = section.id.startsWith("part_");

                    // PHẦN 1 / PHẦN 2: chỉ hiển thị tiêu đề, không bấm
                    if (isPartHeader) {
                      return (
                        <View
                          key={section.id}
                          style={[styles.menuItem, styles.menuItemHeader]}
                        >
                          <Text
                            style={[
                              styles.menuItemText,
                              styles.menuItemHeaderText,
                            ]}
                          >
                            {section.title || "Mục"}
                          </Text>
                        </View>
                      );
                    }

                    // Các mục nội dung thật: bấm để nhảy tới section
                    return (
                      <TouchableOpacity
                        key={section.id}
                        style={styles.menuItem}
                        onPress={() => handlePressSection(section.id)}
                      >
                        <Text style={styles.menuItemText}>
                          {section.title || "Mục"}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* NỘI DUNG CHI TIẾT CÁC MỤC */}
            {sections.length > 0 && (
              <View
                style={styles.card}
                onLayout={handleSectionsContainerLayout}
              >
                {sections.map((section: any) => (
                  <View
                    key={section.id}
                    style={styles.sectionBlock}
                    onLayout={(e) => handleSectionLayout(section.id, e)}
                  >
                    {/* Tiêu đề mục */}
                    <Text style={styles.sectionTitle}>
                      {section.title || "Mục"}
                    </Text>

                    {/* Mục tiêu (goal) nếu có */}
                    {section.goal && (
                      <Text style={styles.sectionGoal}>{section.goal}</Text>
                    )}

                    {/* Đoạn mở đầu (content) nếu có */}
                    {section.content && (
                      <Text style={styles.sectionContent}>
                        {section.content}
                      </Text>
                    )}

                    {/* Bullets chính của mục (nếu có) */}
                    {Array.isArray(section.bullets) &&
                      section.bullets.length > 0 && (
                        <View style={{ marginTop: 0 }}>
                          {section.bullets.map(
                            (line: string, index: number) => (
                              <Text key={index} style={styles.bodyText}>
                                • {line}
                              </Text>
                            )
                          )}
                        </View>
                      )}

                    {/* 👉 CTA sang Quicksearch: CHỈ cho mục bệnh theo giai đoạn */}
                    {section.id === "related_diseases_by_stage" && (
                      <View style={styles.symptomSearchCard}>
                        <Text style={styles.symptomSearchText}>
                          Khi đàn xuất hiện các dấu hiệu giống trong phần này,
                          hãy dùng mục{" "}
                          <Text style={{ fontWeight: "600" }}>
                            Tìm bệnh theo triệu chứng
                          </Text>{" "}
                          để đối chiếu kỹ triệu chứng trước khi xử lý.
                        </Text>
                        <TouchableOpacity
                          style={styles.symptomSearchButton}
                          onPress={handleGoToQuicksearch}
                        >
                          <Text style={styles.symptomSearchButtonText}>
                            Tra cứu triệu chứng
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Fallback cho data cũ: section.body hoặc section.description */}
                    {!section.bullets &&
                      Array.isArray(section.body) &&
                      section.body.map((line: string, index: number) => (
                        <Text key={index} style={styles.bodyText}>
                          • {line}
                        </Text>
                      ))}

                    {!section.bullets &&
                      !section.body &&
                      section.description && (
                        <Text style={styles.bodyText}>
                          {section.description}
                        </Text>
                      )}
                  </View>
                ))}
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

            {showScrollTop && (
  <TouchableOpacity
    style={styles.scrollTopBtn}
    onPress={() => {
      scrollRef.current?.scrollTo({
        y: Math.max(menuOffsetY.current - 16, 0),
        animated: true,
      });
    }}
  >
    <Text style={styles.scrollTopIcon}>↑</Text>
  </TouchableOpacity>
)}



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

    scrollTopBtn: {
  position: "absolute",
  right: 16,
  bottom: 24,
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#2563eb",
  justifyContent: "center",
  alignItems: "center",
  elevation: 4,
},

scrollTopIcon: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "700",
},


  // MENU SECTION (dọc)
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
    marginBottom: 2,
    textTransform: "uppercase",
  },
  menuHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    fontStyle: "italic",
  },
  menuList: {
    marginTop: 0,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  menuItemText: {
    fontSize: 14,
    color: "#111827",
  },
  menuItemHeader: {
    paddingTop: 14,
    paddingBottom: 6,
    borderBottomWidth: 0,
  },
  menuItemHeaderText: {
    fontSize: 15,
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#2563eb",
  },

  sectionBlock: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  sectionGoal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563eb",
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontStyle: "italic",
    opacity: 0.85,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 4,
  },

  // CTA sang Quicksearch (chỉ hiện ở related_diseases_by_stage)
  symptomSearchCard: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  symptomSearchText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  symptomSearchButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: "#2563eb",
  },
  symptomSearchButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
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
