import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chính sách bảo mật</Text>

      <Text style={styles.paragraph}>
        Favi tôn trọng và bảo vệ dữ liệu cá nhân của người dùng. Phần dưới đây
        là tóm tắt chính sách bảo mật, bản chi tiết sẽ được hoàn thiện trong hồ sơ
        phát hành chính thức.
      </Text>

      <Text style={styles.paragraph}>
        • Favi có thể thu thập một số dữ liệu cơ bản như số điện thoại, email để
        phục vụ việc đăng nhập và hỗ trợ người dùng.
      </Text>
      <Text style={styles.paragraph}>
        • Thông tin được sử dụng nhằm cải thiện chất lượng dịch vụ, gửi thông báo
        quan trọng và hỗ trợ kỹ thuật.
      </Text>
      <Text style={styles.paragraph}>
        • Favi không bán hay chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba với
        mục đích quảng cáo, trừ khi có sự đồng ý rõ ràng.
      </Text>

      <Text style={styles.note}>
        Nội dung chính sách bảo mật chi tiết phải đồng nhất với phần đăng ký trên Google Play Console.
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
  note: { fontSize: 13, color: "#DC2626", marginTop: 8 },
  backBtn: { paddingVertical: 12, marginTop: 16 },
  backText: { color: "#6B7280", textAlign: "center", fontSize: 14 },
});
