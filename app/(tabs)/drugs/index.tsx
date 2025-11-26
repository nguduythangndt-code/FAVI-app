// app/(tabs)/drugs/index.tsx

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
  FlatList,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../src/theme";

import groups from "../../data/drugs/group/list.json";

// ====== IMPORT TẤT CẢ LIST THUỐC ======
import antiinflammatory from "../../data/drugs/antiinflammatory_analgesic/list.json";
import electrolyte from "../../data/drugs/electrolyte/list.json";
import vitamin from "../../data/drugs/vitamin_tonic/list.json";
import antiparasitic_internal from "../../data/drugs/antiparasitic_internal/list.json";
import antiparasitic_external from "../../data/drugs/antiparasitic_external/list.json";
import respiratory_support from "../../data/drugs/respiratory_support/list.json";
import digestive_support from "../../data/drugs/digestive_support/list.json";
import blood_parasite from "../../data/drugs/blood_parasite/list.json";
import antibiotic from "../../data/drugs/antibiotic/list.json";

// ====== ICON ======
const GROUP_ICONS: Record<string, string> = {
  antibiotic: "medkit-outline",
  antiinflammatory_analgesic: "bandage-outline",
  electrolyte: "water-outline",
  vitamin_tonic: "sparkles-outline",
  antiparasitic_internal: "bug-outline",
  antiparasitic_external: "shield-checkmark-outline",
  respiratory_support: "pulse-outline",
  digestive_support: "restaurant-outline",
  blood_parasite: "alert-circle-outline",
};

// ====== HELPER ======
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const withGroup = (items: any[], group: string) =>
  items.map((d) => ({
    ...d,
    group,
    _search: normalize(d.name),
  }));

export default function DrugsHomeScreen() {
  const router = useRouter();

  // ====== STATE SEARCH ======
  const [searchText, setSearchText] = useState("");
  const hasSearch = searchText.trim().length > 0;

  // ====== BUILD INDEX TẤT CẢ THUỐC ======
  const drugIndex = useMemo(
    () => [
      ...withGroup(antibiotic, "antibiotic"),
      ...withGroup(antiinflammatory, "antiinflammatory_analgesic"),
      ...withGroup(electrolyte, "electrolyte"),
      ...withGroup(vitamin, "vitamin_tonic"),
      ...withGroup(antiparasitic_internal, "antiparasitic_internal"),
      ...withGroup(antiparasitic_external, "antiparasitic_external"),
      ...withGroup(respiratory_support, "respiratory_support"),
      ...withGroup(digestive_support, "digestive_support"),
      ...withGroup(blood_parasite, "blood_parasite"),
    ],
    []
  );

  // ====== KẾT QUẢ SEARCH ======
  const results = useMemo(() => {
    if (!hasSearch) return [];
    const q = normalize(searchText);
    return drugIndex.filter((d) => d._search.includes(q));
  }, [searchText, hasSearch, drugIndex]);

  const getGroupName = (groupId: string) =>
    groups.find((g) => g.id === groupId)?.name ?? groupId;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục thuốc</Text>
          <Text style={styles.subtitle}>
            Chọn nhóm thuốc hoặc nhập tên thuốc/hoạt chất để xem gợi ý sử dụng.
          </Text>
        </View>

        {/* SEARCH LABEL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Tìm nhanh tên thuốc</Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Nhập tên thuốc hoặc hoạt chất (oxytetracycline, imidocarb...)"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* LIST LABEL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>
            {hasSearch ? "Kết quả tìm kiếm" : "Nhóm thuốc chính"}
          </Text>
        </View>

        {/* NẾU SEARCH -> LIST THUỐC */}
        {hasSearch ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                Không tìm thấy thuốc phù hợp.
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/drugs/[group]/[id]",
                    params: { group: item.group, id: item.id },
                  })
                }
                style={styles.card}
              >
                <View style={styles.leftSide}>
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name={(GROUP_ICONS[item.group] as any) || "help-circle"}
                      size={22}
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
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          // ====== CHƯA SEARCH -> LIST NHÓM ======
          groups.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/drugs/[group]",
                  params: { group: item.id },
                })
              }
            >
              <View style={styles.leftSide}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={(GROUP_ICONS[item.id] as any) || "help-circle-outline"}
                    size={22}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    Xem danh sách thuốc trong nhóm
                  </Text>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: spacing.xl,
  },

  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
  },

  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

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
  },

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
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
