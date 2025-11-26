import { useRouter } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SupportScreen() {
  const router = useRouter();

  const hotline = "0988000000";
  const zaloUrl = "https://zalo.me/0988000000";
  const email = "support@favi.app";

  const openTel = () => Linking.openURL(`tel:${hotline}`);
  const openZalo = () => Linking.openURL(zaloUrl);
  const openMail = () => Linking.openURL(`mailto:${email}`);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Liên hệ hỗ trợ</Text>
      <Text style={styles.desc}>
        Khi gặp vấn đề trong quá trình sử dụng Favi, bạn có thể liên hệ trực tiếp
        với đội ngũ hỗ trợ qua các kênh bên dưới.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kênh liên hệ</Text>

        <Pressable style={styles.row} onPress={openTel}>
          <Text style={styles.rowLabel}>📞 Gọi hotline</Text>
          <Text style={styles.rowValue}>{hotline}</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={openZalo}>
          <Text style={styles.rowLabel}>💬 Zalo hỗ trợ</Text>
          <Text style={styles.rowValue}>Mở Zalo</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={openMail}>
          <Text style={styles.rowLabel}>📧 Email hỗ trợ</Text>
          <Text style={styles.rowValue}>{email}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Quay lại</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  desc: { fontSize: 14, color: "#4B5563", marginBottom: 16 },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  row: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  rowLabel: { fontSize: 14, fontWeight: "500", marginBottom: 2 },
  rowValue: { fontSize: 13, color: "#2563EB" },
  backBtn: { paddingVertical: 12, marginTop: 16 },
  backText: { color: "#6B7280", textAlign: "center", fontSize: 14 },
});
