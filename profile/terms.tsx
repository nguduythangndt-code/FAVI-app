import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Điều khoản sử dụng</Text>

      <Text style={styles.paragraph}>
        Đây là điều khoản sử dụng tóm tắt cho Favi - Ứng dụng chăn nuôi thông minh.
        Nội dung chi tiết sẽ được cập nhật đầy đủ khi chuẩn bị phát hành chính thức
        trên CH Play.
      </Text>
      <Text style={styles.paragraph}>
        • Favi cung cấp thông tin tham khảo về bệnh, triệu chứng và thuốc trong chăn nuôi.
      </Text>
      <Text style={styles.paragraph}>
        • Người dùng tự chịu trách nhiệm trong việc áp dụng thông tin vào thực tế.
      </Text>
      <Text style={styles.paragraph}>
        • Favi không thay thế chẩn đoán, tư vấn và điều trị của bác sĩ thú y.
      </Text>
      <Text style={styles.paragraph}>
        • Việc sử dụng ứng dụng đồng nghĩa với việc bạn đồng ý với các điều khoản này.
      </Text>

      <View style={{ height: 8 }} />
      <Text style={styles.note}>
        Lưu ý: Nội dung điều khoản chính thức cần trùng khớp với tài liệu gửi lên Google Play.
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
  paragraph: { fontSize: 14, color: "#4B5563", marginBottom: 8 },
  note: { fontSize: 13, color: "#DC2626" },
  backBtn: { paddingVertical: 12, marginTop: 16 },
  backText: { color: "#6B7280", textAlign: "center", fontSize: 14 },
});
