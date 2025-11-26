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

type GroupItem = {
  id: string;
  name: string;
};

type DiseaseItem = {
  id: string;
  name: string;
  group: string;         // respiratory, digestive...
  _searchName: string;   // tên đã normalize để search
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

// Icon cho từng nhóm
const GROUP_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  respiratory: "cloud-outline",
  digestive: "restaurant-outline",
  parasite: "bug-outline",
  blood_parasite: "water-outline",
  reproductive: "male-female-outline",
  other: "medkit-outline",
};

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
  const { animal } = useLocalSearchParams<{ animal: string }>();
  const [searchText, setSearchText] = useState("");

  const currentAnimal = animal || "goat";
  const displayName = ANIMAL_NAME_MAP[currentAnimal] ?? "Thú nuôi";

  const allGroups = GROUPS_BY_ANIMAL[currentAnimal] ?? BASE_GROUPS;
  const hasSearch = searchText.trim().length > 0;

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

  return (
    <>
      <Stack.Screen options={{ title: `Nhóm bệnh - ${displayName}` }} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header mô tả */}
          <View style={styles.header}>
            <Text style={styles.title}>Nhóm bệnh trên {displayName}</Text>
            <Text style={styles.subtitle}>
              Chọn nhóm bệnh hoặc nhập tên bệnh để xem chi tiết.
            </Text>
          </View>

          {/* Nhãn nhỏ phía trên search */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Tìm nhanh tên bệnh</Text>
          </View>

          {/* Thanh tìm kiếm tên bệnh */}
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

          {/* Nhãn nhỏ phía trên list */}
          <View style={styles.sectionHeaderList}>
            <Text style={styles.sectionLabel}>
              {hasSearch ? "Kết quả theo tên bệnh" : "Nhóm bệnh chính"}
            </Text>
          </View>

          {/* Nếu đang search -> list bệnh, ngược lại -> list nhóm */}
          {hasSearch ? (
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
                          name={
                            GROUP_ICONS[item.group] || "medkit-outline"
                          }
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
                        <Text style={styles.cardSubtitle}>
                          Mã nhóm: {item.id}
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
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
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
