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
} from "react-native";

import {
  loadDrugGroups,
  loadDrugListByGroup,
} from "../../../src/services/drugs";
import type {
  DrugGroupItem,
  DrugGroupId,
  DrugListItem,
} from "../../../src/types/drugs";
import { colors, radius, spacing, shadow } from "../../../src/theme";

type DrugSearchItem = DrugListItem & { group: DrugGroupId };

export default function DrugGroupsScreen() {
  const router = useRouter();

  const groups: DrugGroupItem[] = useMemo(
    () => loadDrugGroups(),
    []
  );

  const [query, setQuery] = useState("");

  // Gộp toàn bộ thuốc các nhóm để tìm kiếm
  const allDrugs: DrugSearchItem[] = useMemo(() => {
    let all: DrugSearchItem[] = [];
    groups.forEach((g) => {
      const list = loadDrugListByGroup(g.id as DrugGroupId) as DrugListItem[];
      const withGroup = list.map((item) => ({
        ...item,
        group: g.id as DrugGroupId,
      }));
      all = all.concat(withGroup);
    });
    return all;
  }, [groups]);

  const filteredDrugs: DrugSearchItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allDrugs.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [allDrugs, query]);

  const isSearching = query.trim().length > 0;

  const handlePressGroup = (groupId: string) => {
    router.push({
      pathname: "/(tabs)/drugs/[group]",
      params: { group: groupId },
    });
  };

  const handlePressDrug = (item: DrugSearchItem) => {
    router.push({
      pathname: "/(tabs)/drugs/[group]/[id]",
      params: { group: item.group, id: item.id },
    });
  };
return (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      

      {/* ✅ Chỉ hiển thị cẩm nang khi KHÔNG search */}
      {!isSearching && (
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
            Thông tin trong ứng dụng chỉ mang tính tham khảo.
          </Text>
        </View>
      )}

         {/* Thanh tìm kiếm tên hoạt chất - luôn hiển thị */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={18}
          color={colors.textMuted}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm thuốc theo tên hoạt chất"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

        {/* Nếu đang search: hiển thị danh sách thuốc */}
        {isSearching ? (
          <>
            <Text style={styles.resultTitle}>
              Kết quả theo tên hoạt chất
            </Text>
            {filteredDrugs.length === 0 ? (
              <Text style={styles.emptyText}>
                Không tìm thấy thuốc phù hợp.
              </Text>
            ) : (
              filteredDrugs.map((item) => (
                <TouchableOpacity
                  key={`${item.group}-${item.id}`}
                  style={styles.resultItem}
                  onPress={() => handlePressDrug(item)}
                >
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultGroup}>
                    Nhóm: {item.group}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </>
        ) : (
          <>
            {/* Không search: hiển thị danh sách nhóm như cũ */}
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
          </>
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
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,

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
  // Search
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 4,
    marginHorizontal: spacing.xs,
  },
  // Khi không search
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
  // Kết quả search
  resultTitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  resultItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultName: {
    fontSize: 15,
    color: colors.text,
  },
  resultGroup: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
