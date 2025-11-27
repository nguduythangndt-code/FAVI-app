// app/(tabs)/profile/settings/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  const goAbout = () => {
    router.push("/(tabs)/profile/settings/about" as any);
  };

  const goPrivacy = () => {
    router.push("/(tabs)/profile/settings/privacy" as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt & thông tin</Text>

      <TouchableOpacity style={styles.item} onPress={goAbout}>
        <Text style={styles.itemTitle}>Giới thiệu ứng dụng</Text>
        <Text style={styles.itemDesc}>
          Mục tiêu và phạm vi sử dụng của Livestock-care.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={goPrivacy}>
        <Text style={styles.itemTitle}>Chính sách bảo mật & trách nhiệm</Text>
        <Text style={styles.itemDesc}>
          Cách ứng dụng xử lý thông tin và giới hạn trách nhiệm.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 16 },

  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  itemDesc: { fontSize: 13, color: "#666" },
});
