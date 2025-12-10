// app/(tabs)/category/[animal]/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../../src/theme";

// ====== IMPORT LIST BỆNH CHO 4 LOÀI ======
// GOAT
import goatDigestive from "../../../data/goat/digestive/list.json";
import goatRespiratory from "../../../data/goat/respiratory/list.json";
import goatReproductive from "../../../data/goat/reproductive/list.json";
import goatParasite from "../../../data/goat/parasite/list.json";
import goatBloodParasite from "../../../data/goat/blood_parasite/list.json";
import goatOther from "../../../data/goat/other/list.json";

// PIG
import pigDigestive from "../../../data/pig/digestive/list.json";
import pigRespiratory from "../../../data/pig/respiratory/list.json";
import pigReproductive from "../../../data/pig/reproductive/list.json";
import pigParasite from "../../../data/pig/parasite/list.json";
import pigBloodParasite from "../../../data/pig/blood_parasite/list.json";
import pigOther from "../../../data/pig/other/list.json";

// CATTLE
import cattleDigestive from "../../../data/cattle/digestive/list.json";
import cattleRespiratory from "../../../data/cattle/respiratory/list.json";
import cattleReproductive from "../../../data/cattle/reproductive/list.json";
import cattleParasite from "../../../data/cattle/parasite/list.json";
import cattleBloodParasite from "../../../data/cattle/blood_parasite/list.json";
import cattleOther from "../../../data/cattle/other/list.json";

// CHICKEN
import chickenDigestive from "../../../data/chicken/digestive/list.json";
import chickenRespiratory from "../../../data/chicken/respiratory/list.json";
import chickenReproductive from "../../../data/chicken/reproductive/list.json";
import chickenParasite from "../../../data/chicken/parasite/list.json";
import chickenBloodParasite from "../../../data/chicken/blood_parasite/list.json";
import chickenOther from "../../../data/chicken/other/list.json";

// ====== CARE LIST ======
import { loadCareList } from "../../../../src/services/care";
import { CareAnimal, CareTopicSummary } from "../../../../src/types/care";

type GroupItem = {
  id: string;
  name: string;
};

type DiseaseItem = {
  id: string;
  name: string;
  group: string; // respiratory, digestive...
  _searchName: string; // tên đã normalize để search
};

const ANIMAL_NAME_MAP: Record<string, string> = {
  goat: "Dê",
  pig: "Heo",
  cattle: "Bò",
  chicken: "Gà",
};

const BASE_GROUPS: GroupItem[] = [
  { id: "respiratory", name: "Hô hấp - phổi" },
  { id: "parasite", name: "Ký sinh trùng" },
  { id: "blood_parasite", name: "Ký sinh trùng máu" },
  { id: "digestive", name: "Tiêu hoá - tiêu chảy" },
  { id: "reproductive", name: "Sinh sản" },
  { id: "other", name: "Bệnh khác" },
];

const GROUPS_BY_ANIMAL: Record<string, GroupItem[]> = {
  goat: BASE_GROUPS,
  pig: BASE_GROUPS,
  cattle: BASE_GROUPS,
  chicken: BASE_GROUPS,
};

// Icon cho từng nhóm bệnh
const GROUP_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  respiratory: "cloud-outline",
  digestive: "restaurant-outline",
  parasite: "bug-outline",
  blood_parasite: "water-outline",
  reproductive: "male-female-outline",
  other: "medkit-outline",
};

const CARE_ICON: keyof typeof Ionicons.glyphMap = "leaf-outline";

// ====== HELPERS ======
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const withGroup = (items: any[], groupId: string): DiseaseItem[] =>
  items.map((d) => ({
    ...(d as any),
    group: groupId,
    _searchName: normalize((d as any).name || ""),
  }));

export default function AnimalGroupIndexScreen() {
  const { animal } = useLocalSearchParams<{ animal?: string }>();
  const [searchText, setSearchText] = useState("");
  const [mode, setMode] = useState<"disease" | "care">("disease");

  const currentAnimal = (animal || "goat") as CareAnimal;
  const displayName = ANIMAL_NAME_MAP[currentAnimal] ?? "Thú nuôi";

  const allGroups = GROUPS_BY_ANIMAL[currentAnimal] ?? BASE_GROUPS;
  const hasSearch = mode === "disease" && searchText.trim().length > 0;

        const subtitleParagraphs = useMemo(() => {
    if (mode === "disease") {
      return [
        `Phần này giúp tra cứu nhanh các nhóm bệnh thường gặp trên ${displayName} theo biểu hiện lâm sàng.`,
        "Thông tin được trình bày theo nhóm cơ quan và tính chất bệnh, giúp bà con dễ đối chiếu và nhận diện sớm.",
        "Việc chẩn đoán và điều trị cần kết hợp quan sát thực tế và tư vấn thú y. Thông tin trong ứng dụng chỉ mang tính tham khảo.",
      ];
    }

    return [
      `Chăm sóc ${displayName} là một quá trình dài, bắt đầu từ việc hiểu đàn đang ở giai đoạn nào.`,
      "Mỗi giai đoạn nuôi đều có những việc cần làm khác nhau. Khi hiểu đúng tình trạng đàn và chăm sóc đúng cách, đàn sẽ khỏe mạnh hơn và rủi ro cũng giảm đi.",
      "Chọn mục phù hợp dưới đây để xem hướng dẫn chi tiết.",
    ];
  }, [mode, displayName]);



  // Dùng để hiển thị tên nhóm trong kết quả search
  const getGroupName = (groupId: string) =>
    allGroups.find((g) => g.id === groupId)?.name ?? groupId;

  // ====== INDEX BỆNH THEO LOÀI ======
  const diseaseIndex: DiseaseItem[] = useMemo(() => {
    switch (currentAnimal) {
      case "goat":
        return [
          ...withGroup(goatDigestive as any[], "digestive"),
          ...withGroup(goatRespiratory as any[], "respiratory"),
          ...withGroup(goatReproductive as any[], "reproductive"),
          ...withGroup(goatParasite as any[], "parasite"),
          ...withGroup(goatBloodParasite as any[], "blood_parasite"),
          ...withGroup(goatOther as any[], "other"),
        ];
      case "pig":
        return [
          ...withGroup(pigDigestive as any[], "digestive"),
          ...withGroup(pigRespiratory as any[], "respiratory"),
          ...withGroup(pigReproductive as any[], "reproductive"),
          ...withGroup(pigParasite as any[], "parasite"),
          ...withGroup(pigBloodParasite as any[], "blood_parasite"),
          ...withGroup(pigOther as any[], "other"),
        ];
      case "cattle":
        return [
          ...withGroup(cattleDigestive as any[], "digestive"),
          ...withGroup(cattleRespiratory as any[], "respiratory"),
          ...withGroup(cattleReproductive as any[], "reproductive"),
          ...withGroup(cattleParasite as any[], "parasite"),
          ...withGroup(cattleBloodParasite as any[], "blood_parasite"),
          ...withGroup(cattleOther as any[], "other"),
        ];
      case "chicken":
        return [
          ...withGroup(chickenDigestive as any[], "digestive"),
          ...withGroup(chickenRespiratory as any[], "respiratory"),
          ...withGroup(chickenReproductive as any[], "reproductive"),
          ...withGroup(chickenParasite as any[], "parasite"),
          ...withGroup(chickenBloodParasite as any[], "blood_parasite"),
          ...withGroup(chickenOther as any[], "other"),
        ];
      default:
        return [];
    }
  }, [currentAnimal]);

  // Kết quả search theo tên bệnh
  const searchResults = useMemo(() => {
    if (!hasSearch) return [];
    const q = normalize(searchText);
    return diseaseIndex.filter((d) => d._searchName.includes(q));
  }, [hasSearch, searchText, diseaseIndex]);

  // Danh sách nhóm chăm sóc theo loài
  const careList: CareTopicSummary[] = useMemo(
    () => loadCareList(currentAnimal),
    [currentAnimal]
  );

  return (
    <>
      <Stack.Screen
  options={{
    title:
      mode === "disease"
        ? `Nhóm bệnh trên ${displayName}`
        : `Chăm sóc ${displayName}`,
  }}
/>


      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header mô tả */}
                      <View style={styles.header}>
            <Text style={styles.title}>
              {mode === "disease"
                ? `Cẩm nang tra cứu bệnh trên ${displayName}`
                : `Cẩm nang chăm sóc ${displayName}`}
            </Text>

            {subtitleParagraphs.map((p, idx) => (
              <Text
                key={idx}
                style={[
                  styles.subtitle,
                  idx > 0 && { marginTop: 4 }, // khoảng cách giữa các đoạn
                ]}
              >
                {p}
              </Text>
            ))}
          </View>


          {/* ====== HÀNG CHUYỂN CHẾ ĐỘ: DANH MỤC / CHĂM SÓC ====== */}
          <View style={styles.modeSwitchRow}>
            {/* Tab: Danh mục bệnh */}
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "disease" && styles.modeButtonActive,
              ]}
              onPress={() => setMode("disease")}
            >
              <Text
                style={
                  mode === "disease"
                    ? styles.modeButtonActiveText
                    : styles.modeButtonText
                }
              >
                Danh mục bệnh
              </Text>
            </TouchableOpacity>

            {/* Tab: Chăm sóc */}
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "care" && styles.modeButtonActive,
              ]}
              onPress={() => setMode("care")}
            >
              <Text
                style={
                  mode === "care"
                    ? styles.modeButtonActiveText
                    : styles.modeButtonText
                }
              >
                Chăm sóc
              </Text>
            </TouchableOpacity>
          </View>

          {/* ====== CHỈ HIỆN SEARCH KHI Ở TAB DANH MỤC BỆNH ====== */}
          {mode === "disease" && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Tìm nhanh tên bệnh</Text>
              </View>

              <View style={styles.searchBar}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={colors.textMuted}
                />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Nhập tên bệnh (tụ huyết trùng, viêm phổi,...)"
                  placeholderTextColor={colors.textMuted}
                  style={styles.searchInput}
                  returnKeyType="search"
                />
              </View>
            </>
          )}

          {/* Nhãn phía trên list */}
          <View style={styles.sectionHeaderList}>
            <Text style={styles.sectionLabel}>
              {mode === "care"
                ? "Nhóm chăm sóc"
                : hasSearch
                ? "Kết quả theo tên bệnh"
                : "Nhóm bệnh chính"}
            </Text>
          </View>

          {/* ====== NỘI DUNG CHÍNH THEO MODE ====== */}
          {mode === "care" ? (
            // === LIST CHĂM SÓC ===
            <FlatList
              data={careList}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: spacing.xl }}
              renderItem={({ item }) => (
                <Link
                  href={{
                    pathname: "/(tabs)/category/[animal]/care/[careId]",
                    params: {
                      animal: currentAnimal,
                      careId: item.id,
                    },
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.card}>
                    <View style={styles.cardLeft}>
                      <View style={styles.iconCircle}>
                        <Ionicons
                          name={CARE_ICON}
                          size={20}
                          color={colors.primary}
                        />
                      </View>

                      <View style={styles.cardTextWrap}>
                        <Text style={styles.cardTitle}>
                          {item.name ?? item.title ?? "Chăm sóc"}
                        </Text>
                        {(item.shortDesc || item.description) && (
                          <Text style={styles.cardSubtitle}>
                            {item.shortDesc ?? item.description}
                          </Text>
                        )}
                      </View>
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
          ) : hasSearch ? (
            // === KẾT QUẢ SEARCH BỆNH ===
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: spacing.xl }}
              ListEmptyComponent={
                <Text style={{ fontSize: 13, color: colors.textMuted }}>
                  Không tìm thấy bệnh phù hợp.
                </Text>
              }
              renderItem={({ item }) => (
                <Link
                  href={{
                    pathname: "/(tabs)/category/[animal]/[group]/[id]",
                    params: {
                      animal: currentAnimal,
                      group: item.group,
                      id: item.id,
                    },
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.card}>
                    <View style={styles.cardLeft}>
                      <View style={styles.iconCircle}>
                        <Ionicons
                          name={GROUP_ICONS[item.group] || "medkit-outline"}
                          size={20}
                          color={colors.primary}
                        />
                      </View>

                      <View style={styles.cardTextWrap}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardSubtitle}>
                          Nhóm: {getGroupName(item.group)}
                        </Text>
                      </View>
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
          ) : (
            // === LIST NHÓM BỆNH CHÍNH ===
            <FlatList
              data={allGroups}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: spacing.xl }}
              renderItem={({ item }) => (
                <Link
                  href={{
                    pathname: "/(tabs)/category/[animal]/[group]",
                    params: { animal: currentAnimal, group: item.id },
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.card}>
                    <View style={styles.cardLeft}>
                      <View style={styles.iconCircle}>
                        <Ionicons
                          name={GROUP_ICONS[item.id] || "medkit-outline"}
                          size={20}
                          color={colors.primary}
                        />
                      </View>

                      <View style={styles.cardTextWrap}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        
                      </View>
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
          )}
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

  // Header
    header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18, // chữ sát hơn, không bị thưa
  },


  // ===== MODE SWITCH (Danh mục / Chăm sóc) =====
  modeSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeButtonText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  modeButtonActiveText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
  },

  // Section labels
  sectionHeader: {
    marginBottom: spacing.xs,
  },
  sectionHeaderList: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Search bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 4,
  },

  // Card list
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#374151",   // xám đậm, nhìn rất “app xịn”,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
