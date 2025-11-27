import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PermissionsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Giải thích quyền truy cập</Text>

      <Text style={styles.paragraph}>
        Để hoạt động đầy đủ tính năng, Favi có thể yêu cầu một số quyền truy cập
        trên thiết bị. Dưới đây là giải thích tóm tắt:
      </Text>

      <Text style={styles.subTitle}>1. Thông báo (Notification)</Text>
      <Text style={styles.paragraph}>
        • Dùng để gửi nhắc nhở về kiến thức, cập nhật bệnh, thông báo tính năng mới.
      </Text>

      <Text style={styles.subTitle}>2. Bộ nhớ / File</Text>
      <Text style={styles.paragraph}>
        • Dùng để lưu cache dữ liệu bệnh, thuốc nhằm tăng tốc truy cập.
      </Text>

      <Text style={styles.subTitle}>3. Camera (khi có)</Text>
      <Text style={styles.paragraph}>
        • Dùng cho các tính năng trong tương lai như chụp hình vết thương, tình trạng
        bệnh để lưu trong hồ sơ hoặc gửi cho thú y.
      </Text>

      <Text style={styles.note}>
        Favi chỉ yêu cầu quyền khi thực sự cần, và bạn hoàn toàn có thể từ chối
        hoặc tắt quyền trong cài đặt hệ thống.
      </Text>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Quay lại</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  subTitle: { fontSize: 15, fontWeight: "600", marginTop: 12 },
  paragraph: { fontSize: 14, color: "#4B5563", marginTop: 4 },
  note: { fontSize: 13, color: "#DC2626", marginTop: 12 },
  backBtn: { paddingVertical: 12, marginTop: 16 },
  backText: { color: "#6B7280", textAlign: "center", fontSize: 14 },
});
