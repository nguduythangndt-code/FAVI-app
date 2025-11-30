// app/(tabs)/category/[animal]/[group]/[id].tsx

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../../../src/theme";
import {
  logDiseaseView,
  type DiseaseViewSource,
} from "../../../../../src/services/analytics";
import {
  getDiseaseDetail,
  type DiseaseDetail,
} from "../../../../../src/services/diseaseDetailService";

// =======================
// ICON THEO LOÀI
// =======================

const ANIMAL_ICONS: Record<string, string> = {
  goat: "logo-react",
  pig: "logo-octocat",
  cattle: "shapes-outline",
  chicken: "aperture-outline",
};

// =======================
// HELPER RENDER
// =======================

const renderBullets = (items?: any) => {
  if (items == null) return null;

  const arr: string[] = [];

  const toLabel = (key: string) => {
    const map: Record<string, string> = {
      description: "Mô tả tình trạng",
      guideline: "Hướng dẫn xử lý",
    };
    if (map[key]) return map[key];
    return key.replace(/_/g, " ").replace(/-/g, " ");
  };

  const pushValue = (value: any) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => pushValue(v));
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      const text = String(value).trim();
      if (text) arr.push(text);
    }
  };

  if (
    typeof items === "string" ||
    typeof items === "number" ||
    typeof items === "boolean"
  ) {
    pushValue(items);
  } else if (Array.isArray(items)) {
    pushValue(items);
  } else if (typeof items === "object") {
    Object.entries(items).forEach(([key, value]) => {
      const label = toLabel(key);
      arr.push(label + ":");
      pushValue(value);
    });
  }

  if (arr.length === 0) return null;

  return (
    <View style={{ marginTop: 4 }}>
      {arr.map((item, idx) => (
        <Text key={idx} style={styles.bulletText}>
          {"\u2022"} {item}
        </Text>
      ))}
    </View>
  );
};

const SYMPTOMATIC_GROUP_LABELS: Record<string, string> = {
  antiinflammatory: "Kháng viêm - giảm đau",
  respiratory_support: "Hỗ trợ hô hấp",
  electrolyte: "Bù nước - điện giải",
  vitamin: "Vitamin - phục hồi",
  digestive_support: "Hỗ trợ tiêu hoá",
  digestive: "Hỗ trợ tiêu hoá",
  other: "Điều trị triệu chứng khác",
};

const renderSymptomaticTreatment = (
  symptomatic?:
    | {
        [key: string]:
          | {
              main: string;
              alternative?: string | string[];
            }
          | string[];
      }
    | string[]
    | undefined
) => {
  if (!symptomatic) return null;

  if (Array.isArray(symptomatic)) {
    return renderBullets(symptomatic);
  }

  const getLabel = (key: string) => {
    if (SYMPTOMATIC_GROUP_LABELS[key]) {
      return SYMPTOMATIC_GROUP_LABELS[key];
    }
    return key
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  };

  return (
    <View style={{ marginTop: 4 }}>
      {Object.entries(symptomatic).map(([key, value]) => {
        let main: string | undefined;
        let alternatives: string[] = [];

        if (Array.isArray(value)) {
          if (value.length > 0) {
            main = String(value[0]);
            alternatives = value.slice(1).map((v) => String(v));
          }
        } else if (value && typeof value === "object") {
          // @ts-ignore
          main = value.main as string;
          // @ts-ignore
          const altRaw = value.alternative as string | string[] | undefined;
          if (typeof altRaw === "string") {
            const t = altRaw.trim();
            if (t) alternatives = [t];
          } else if (Array.isArray(altRaw)) {
            alternatives = altRaw.map((v) => String(v));
          }
        }

        if (!main) return null;

        return (
          <View key={key} style={{ marginBottom: 8 }}>
            <Text style={styles.symptomaticGroupTitle}>{getLabel(key)}</Text>
            <Text style={styles.bulletText}>
              • <Text style={{ fontWeight: "600" }}>Thuốc chính: </Text>
              {main}
            </Text>
            {alternatives.length > 0 && (
              <Text style={styles.bulletText}>
                • <Text style={{ fontWeight: "600" }}>Thay thế: </Text>
                {alternatives.join(", ")}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children?: React.ReactNode;
}) => {
  if (!children) return null;
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {icon && (
          <Ionicons name={icon as any} size={18} color={colors.primary} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

// =======================
// COMPONENT CHI TIẾT BỆNH
// =======================

export default function DiseaseDetailScreen() {
  const params = useLocalSearchParams<Record<string, string | string[]>>();

  const getParam = (key: string): string => {
    const value = params[key];
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
  };

  const animal = getParam("animal");
  const group = getParam("group");
  const id = getParam("id");
  const rawFromScreen = getParam("fromScreen");
  const searchQueryRaw = getParam("searchQuery");

  const fromScreen: DiseaseViewSource =
    rawFromScreen === "quicksearch" ? "quicksearch" : "category";

  const searchQuery = searchQueryRaw || undefined;

  const detail = getDiseaseDetail(animal, group, id);
  const displayName =
    (detail && detail.name) ||
    (typeof params.name === "string" ? params.name : "") ||
    id;

  // ====== LOG HÀNH VI XEM BỆNH ======
  const viewStartRef = useRef<number | null>(null);
  const hasLoggedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!detail) return;

    viewStartRef.current = Date.now();

    // Auto log sau 12s nếu chưa log
    timerRef.current = setTimeout(() => {
      if (hasLoggedRef.current || !viewStartRef.current) return;
      const duration = Date.now() - viewStartRef.current;
      logDiseaseView({
        animal,
        group,
        diseaseId: id,
        diseaseName: displayName ?? null,
        fromScreen,
        searchQuery: searchQuery ?? null,
        timeOnScreenMs: duration ?? null,
      });

      hasLoggedRef.current = true;
    }, 12000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!hasLoggedRef.current && viewStartRef.current) {
        const duration = Date.now() - viewStartRef.current;
        if (duration >= 3000) {
          logDiseaseView({
            animal,
            group,
            diseaseId: id,
            diseaseName: detail?.name ?? displayName ?? id,
            fromScreen,
            searchQuery,
            timeOnScreenMs: duration,
          });
          hasLoggedRef.current = true;
        }
      }
    };
  }, [animal, group, id, detail?.name, fromScreen, searchQuery, displayName]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!detail) return;
    if (hasLoggedRef.current) return;

    if (!viewStartRef.current) viewStartRef.current = Date.now();
    const duration = Date.now() - viewStartRef.current;

    if (duration < 500) return;

    logDiseaseView({
      animal,
      group,
      diseaseId: id,
      diseaseName: detail.name,
      fromScreen,
      searchQuery,
      timeOnScreenMs: duration,
    });
    hasLoggedRef.current = true;
  };

  if (!detail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Chưa có dữ liệu chi tiết cho bệnh này
          </Text>
          <Text style={styles.emptyText}>
            Kiểm tra lại mã bệnh hoặc bổ sung file chi tiết tương ứng.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const advanced = detail as any;
  const headerIcon = (ANIMAL_ICONS[animal] as any) || "medkit-outline";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={120}
      >
        {/* HEADER TÊN BỆNH + ICON */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Ionicons name={headerIcon} size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.diseaseName}>{displayName}</Text>
            {advanced.summary ? (
              <Text style={styles.summaryText}>{advanced.summary}</Text>
            ) : null}
          </View>
        </View>

        {/* NGUYÊN NHÂN */}
        <Section title="Nguyên nhân" icon="alert-circle-outline">
          {advanced.causes
            ? renderBullets(advanced.causes)
            : detail.cause
            ? renderBullets(detail.cause)
            : null}
        </Section>

        {/* YẾU TỐ NGUY CƠ */}
        <Section title="Yếu tố nguy cơ" icon="warning-outline">
          {advanced.risk_factors && renderBullets(advanced.risk_factors)}
        </Section>

        {/* TRIỆU CHỨNG CHI TIẾT */}
        <Section title="Triệu chứng chi tiết" icon="list-circle-outline">
          {advanced.clinical_signs_detailed
            ? renderBullets(advanced.clinical_signs_detailed)
            : detail.symptoms
            ? renderBullets(detail.symptoms)
            : null}
        </Section>

        {/* TRIỆU CHỨNG THEO MỨC ĐỘ */}
        {advanced.clinical_signs_by_stage && (
          <Section title="Triệu chứng theo mức độ" icon="analytics-outline">
            <View>
              {advanced.clinical_signs_by_stage.mild && (
                <>
                  <Text style={styles.stageTitle}>⚪ Mức độ nhẹ</Text>
                  {renderBullets(advanced.clinical_signs_by_stage.mild)}
                </>
              )}

              {advanced.clinical_signs_by_stage.moderate && (
                <>
                  <Text style={styles.stageTitle}>🟡 Mức độ vừa</Text>
                  {renderBullets(advanced.clinical_signs_by_stage.moderate)}
                </>
              )}

              {advanced.clinical_signs_by_stage.severe && (
                <>
                  <Text style={styles.stageTitle}>🔴 Mức độ nặng</Text>
                  {renderBullets(advanced.clinical_signs_by_stage.severe)}
                </>
              )}
            </View>
          </Section>
        )}

        {/* ĐIỀU TRỊ - SCHEMA CŨ */}
        {(detail.treatment?.mild ||
          detail.treatment?.severe ||
          detail.treatment?.alternative ||
          detail.treatment?.note) && (
          <Section title="Điều trị (mô tả chung)" icon="medkit-outline">
            {detail.treatment?.mild && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Trường hợp nhẹ: </Text>
                {detail.treatment.mild}
              </Text>
            )}

            {detail.treatment?.severe && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Trường hợp nặng: </Text>
                {detail.treatment.severe}
              </Text>
            )}

            {detail.treatment?.alternative && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Thuốc thay thế: </Text>
                {detail.treatment.alternative}
              </Text>
            )}

            {detail.treatment?.note && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Lưu ý: </Text>
                {detail.treatment.note}
              </Text>
            )}
          </Section>
        )}

        {/* ĐIỀU TRỊ - SCHEMA MỚI */}
        {(advanced.treatment?.primary_drugs ||
          advanced.treatment?.alternative_drugs ||
          advanced.treatment?.symptomatic_treatment ||
          advanced.treatment?.supportive_care ||
          advanced.treatment?.dose_policy) && (
          <Section
            title="Hướng dẫn điều trị (mang tính tham khảo)"
            icon="pulse-outline"
          >
            {advanced.treatment?.primary_drugs && (
              <>
                <Text style={styles.stageTitle}>💊 Thuốc ưu tiên</Text>
                {renderBullets(advanced.treatment.primary_drugs)}
              </>
            )}

            {advanced.treatment?.alternative_drugs && (
              <>
                <Text style={styles.stageTitle}>🔁 Thuốc có thể thay thế</Text>
                {renderBullets(advanced.treatment.alternative_drugs)}
              </>
            )}

            {advanced.treatment?.symptomatic_treatment && (
              <>
                <Text style={styles.stageTitle}>🩺 Điều trị triệu chứng</Text>
                {renderSymptomaticTreatment(
                  advanced.treatment.symptomatic_treatment
                )}
              </>
            )}

            {advanced.treatment?.supportive_care && (
              <>
                <Text style={styles.stageTitle}>🧴 Chăm sóc - hỗ trợ</Text>
                {renderBullets(advanced.treatment.supportive_care)}
              </>
            )}

            {advanced.treatment?.dose_policy && (
              <Text style={styles.dosePolicyText}>
                {advanced.treatment.dose_policy}
              </Text>
            )}
          </Section>
        )}

        {/* XỬ LÝ CA NẶNG */}
        {advanced.severe_case_treatment && (
          <Section title="Xử lý ca nặng" icon="flask-outline">
            <View>
              {advanced.severe_case_treatment.case_type_1 && (
                <>
                  <Text style={styles.stageTitle}>
                    🩻 Trường hợp nặng loại 1
                  </Text>
                  {renderBullets(advanced.severe_case_treatment.case_type_1)}
                </>
              )}

              {advanced.severe_case_treatment.case_type_2 && (
                <>
                  <Text style={styles.stageTitle}>
                    🧪 Trường hợp nặng loại 2
                  </Text>
                  {renderBullets(advanced.severe_case_treatment.case_type_2)}
                </>
              )}

              {advanced.severe_case_treatment.note && (
                <Text style={styles.dosePolicyText}>
                  {advanced.severe_case_treatment.note}
                </Text>
              )}
            </View>
          </Section>
        )}

        {/* PHÒNG BỆNH */}
        <Section title="Phòng bệnh" icon="shield-checkmark-outline">
          {advanced.prevention_list
            ? renderBullets(advanced.prevention_list)
            : detail.prevention
            ? renderBullets(detail.prevention)
            : null}
        </Section>

        {/* LƯU Ý THÊM */}
        <Section title="Lưu ý thêm" icon="reader-outline">
          {advanced.notes && renderBullets(advanced.notes)}
        </Section>

        {/* DISCLAIMER */}
        {detail.disclaimer ? (
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>{detail.disclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// =======================
// STYLES
// =======================

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
    paddingBottom: spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  headerIconWrap: {
    width: 50,
    height: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },

  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  stageTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: spacing.sm,
    marginBottom: 2,
    color: colors.text,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "600",
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 2,
  },
  symptomaticGroupTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  dosePolicyText: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: "italic",
    color: colors.textMuted,
  },

  disclaimerBox: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#FFF4E5",
    borderWidth: 1,
    borderColor: "#FFE2BF",
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#8A5A10",
  },

  emptyContainer: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
