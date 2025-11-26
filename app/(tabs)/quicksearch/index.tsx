// app/(tabs)/quicksearch/index.tsx

// ================== IMPORT ICON / ROUTER / RN ==================
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../src/theme";

import {
  quicksearch,
  AnimalType,
  DiseaseListItem,
  QuicksearchResult,
} from "../../../src/utils/quicksearch";

// ================== IMPORT DATA DÊ ==================
import goatBloodParasite from "../../data/goat/blood_parasite/list.json";
import goatDigestive from "../../data/goat/digestive/list.json";
import goatOther from "../../data/goat/other/list.json";
import goatParasite from "../../data/goat/parasite/list.json";
import goatReproductive from "../../data/goat/reproductive/list.json";
import goatRespiratory from "../../data/goat/respiratory/list.json";

// ================== IMPORT DATA HEO ==================
import pigBloodParasite from "../../data/pig/blood_parasite/list.json";
import pigDigestive from "../../data/pig/digestive/list.json";
import pigOther from "../../data/pig/other/list.json";
import pigParasite from "../../data/pig/parasite/list.json";
import pigReproductive from "../../data/pig/reproductive/list.json";
import pigRespiratory from "../../data/pig/respiratory/list.json";

// ================== IMPORT DATA BÒ ==================
import cattleBloodParasite from "../../data/cattle/blood_parasite/list.json";
import cattleDigestive from "../../data/cattle/digestive/list.json";
import cattleOther from "../../data/cattle/other/list.json";
import cattleParasite from "../../data/cattle/parasite/list.json";
import cattleReproductive from "../../data/cattle/reproductive/list.json";
import cattleRespiratory from "../../data/cattle/respiratory/list.json";

// ================== IMPORT DATA GÀ ==================
import chickenBloodParasite from "../../data/chicken/blood_parasite/list.json";
import chickenDigestive from "../../data/chicken/digestive/list.json";
import chickenOther from "../../data/chicken/other/list.json";
import chickenParasite from "../../data/chicken/parasite/list.json";
import chickenReproductive from "../../data/chicken/reproductive/list.json";
import chickenRespiratory from "../../data/chicken/respiratory/list.json";

// ================== MAP list.json -> DiseaseListItem ==================
const mapListToEngineIndex = (
  animal: AnimalType,
  groupKey: string,
  rawList: any[]
): DiseaseListItem[] => {
  const items: DiseaseListItem[] = [];

  rawList.forEach((item) => {
    const id = item.id as string | undefined;
    if (!id) return;

    const rawSearchText = (item as any).searchText || "";
    if (!rawSearchText) return; // bỏ item rỗng searchText

    items.push({
      id,
      name: item.name as string,
      animal,
      group: groupKey,
      groupLabel: (item as any).groupLabel || (item as any).group || groupKey,
      searchText: rawSearchText,
      severityLevel: (item as any).severityLevel ?? 0,
    });
  });

  return items;
};

// ================== BUILD DATA CHO 4 LOÀI ==================
const goatAll: DiseaseListItem[] = [
  ...mapListToEngineIndex("goat", "digestive", goatDigestive as any[]),
  ...mapListToEngineIndex("goat", "respiratory", goatRespiratory as any[]),
  ...mapListToEngineIndex("goat", "reproductive", goatReproductive as any[]),
  ...mapListToEngineIndex("goat", "parasite", goatParasite as any[]),
  ...mapListToEngineIndex("goat", "blood_parasite", goatBloodParasite as any[]),
  ...mapListToEngineIndex("goat", "other", goatOther as any[]),
];

const pigAll: DiseaseListItem[] = [
  ...mapListToEngineIndex("pig", "digestive", pigDigestive as any[]),
  ...mapListToEngineIndex("pig", "respiratory", pigRespiratory as any[]),
  ...mapListToEngineIndex("pig", "reproductive", pigReproductive as any[]),
  ...mapListToEngineIndex("pig", "parasite", pigParasite as any[]),
  ...mapListToEngineIndex("pig", "blood_parasite", pigBloodParasite as any[]),
  ...mapListToEngineIndex("pig", "other", pigOther as any[]),
];

const cattleAll: DiseaseListItem[] = [
  ...mapListToEngineIndex("cattle", "digestive", cattleDigestive as any[]),
  ...mapListToEngineIndex("cattle", "respiratory", cattleRespiratory as any[]),
  ...mapListToEngineIndex(
    "cattle",
    "reproductive",
    cattleReproductive as any[]
  ),
  ...mapListToEngineIndex("cattle", "parasite", cattleParasite as any[]),
  ...mapListToEngineIndex(
    "cattle",
    "blood_parasite",
    cattleBloodParasite as any[]
  ),
  ...mapListToEngineIndex("cattle", "other", cattleOther as any[]),
];

const chickenAll: DiseaseListItem[] = [
  ...mapListToEngineIndex("chicken", "digestive", chickenDigestive as any[]),
  ...mapListToEngineIndex(
    "chicken",
    "respiratory",
    chickenRespiratory as any[]
  ),
  ...mapListToEngineIndex(
    "chicken",
    "reproductive",
    chickenReproductive as any[]
  ),
  ...mapListToEngineIndex("chicken", "parasite", chickenParasite as any[]),
  ...mapListToEngineIndex(
    "chicken",
    "blood_parasite",
    chickenBloodParasite as any[]
  ),
  ...mapListToEngineIndex("chicken", "other", chickenOther as any[]),
];

// ================== GHÉP INDEX CHO SEARCH ENGINE ==================
const DISEASE_INDEX: DiseaseListItem[] = [
  ...goatAll,
  ...pigAll,
  ...cattleAll,
  ...chickenAll,
];

// ================== TYPE LỊCH SỬ ==================
type SearchHistoryItem = {
  query: string;
  animal: AnimalType;
  animalLabel: string;
};

// ================== UI MÀN TÌM KIẾM ==================
const QuickSearchScreen = () => {
  const router = useRouter();
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);
  const [query, setQuery] = useState("");
  const [history] = useState<SearchHistoryItem[]>([]); // TODO: load từ storage/log thật

  const results: QuicksearchResult[] = useMemo(() => {
    if (!selectedAnimal) return [];
    if (!query.trim()) return [];
    return quicksearch(query, DISEASE_INDEX, selectedAnimal);
  }, [selectedAnimal, query]);

  const handleSelectResult = (item: DiseaseListItem) => {
    router.push({
      pathname: "/(tabs)/quicksearch/detail",
      params: {
        animal: item.animal,
        group: item.group,
        id: item.id,
        name: item.name,
      },
    });
  };

  const renderAnimalButton = (animal: AnimalType, label: string) => {
    const isActive = selectedAnimal === animal;

    return (
      <TouchableOpacity
        key={animal}
        onPress={() => setSelectedAnimal(animal)}
        style={[styles.animalChip, isActive && styles.animalChipActive]}
      >
        <Text
          style={[
            styles.animalChipText,
            isActive && styles.animalChipTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const showHistory = selectedAnimal && query.trim().length === 0 && history.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* CHỌN LOÀI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn loài</Text>

          <View style={styles.chipRow}>
            {renderAnimalButton("goat", "Dê")}
            {renderAnimalButton("pig", "Heo")}
            {renderAnimalButton("cattle", "Bò")}
            {renderAnimalButton("chicken", "Gà")}
          </View>
        </View>

        {/* THANH TÌM KIẾM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhập triệu chứng</Text>

          <View
            style={[
              styles.searchBar,
              !selectedAnimal && styles.searchBarDisabled,
            ]}
          >
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Ví dụ: lờ đờ, tiêu chảy, khó thở..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              editable={!!selectedAnimal}
              returnKeyType="search"
            />
          </View>

          {!selectedAnimal && (
            <Text style={styles.helperText}>
              Hãy chọn loài trước rồi mới nhập triệu chứng.
            </Text>
          )}

          {selectedAnimal && query.trim().length === 0 && (
            <Text style={styles.helperText2}>
              Nhập càng nhiều biểu hiện bạn quan sát được, kết quả sẽ càng chính xác.
            </Text>
          )}

          {selectedAnimal && query.trim().length > 0 && (
  <View style={styles.infoBanner}>
    <Ionicons
      name="information-circle-outline"
      size={18}
      color={colors.primary}
      style={{ marginRight: 8 }}
    />
    <Text style={styles.infoBannerText}>
      Dưới đây là các bệnh có biểu hiện gần giống nhất. Chạm vào từng bệnh để xem chi tiết.
    </Text>
  </View>
)}


          {showHistory && (
            <View style={{ marginTop: spacing.md }}>
              <Text style={styles.historyLabel}>Lịch sử tìm gần đây</Text>

              {history.map((h, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setQuery(h.query)}
                  style={styles.historyItem}
                >
                  <Text style={styles.historyQuery}>{h.query}</Text>
                  <Text style={styles.historyMeta}>{h.animalLabel}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* KẾT QUẢ */}
        <View style={{ marginTop: spacing.lg }}>
          {selectedAnimal && query.trim().length > 0 && results.length === 0 && (
            <Text style={styles.noResult}>Không tìm thấy bệnh phù hợp.</Text>
          )}

          {results.map((item) => (
            <TouchableOpacity
              key={`${item.animal}-${item.group}-${item.id}`}
              onPress={() => handleSelectResult(item)}
              style={styles.resultCard}
            >
              <View>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultMeta}>
                  {item.groupLabel} ·{" "}
                  {item.animal === "goat"
                    ? "Dê"
                    : item.animal === "pig"
                    ? "Heo"
                    : item.animal === "cattle"
                    ? "Bò"
                    : "Gà"}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuickSearchScreen;

// ================== STYLES ==================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: spacing.xs,
    color: colors.text,
  },

  // hàng chọn loài
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  animalChip: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  animalChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  animalChipText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },
  animalChipTextActive: {
    color: "white",
    fontWeight: "600",
  },

  // search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  searchBarDisabled: { opacity: 0.55 },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.text,
  },

  helperText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textMuted,
  },
  helperText2: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },

  // banner thông báo sau khi nhập
  infoBanner: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
  },

  // lịch sử tìm kiếm
  historyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  historyItem: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyQuery: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },
  historyMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  // kết quả
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...shadow.card,
  },
  resultName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },

  noResult: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
