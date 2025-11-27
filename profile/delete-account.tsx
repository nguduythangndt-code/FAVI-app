import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");

  const handleDelete = () => {
    if (confirmText.toUpperCase() !== "XÓA") {
      Alert.alert("Chưa xác nhận", 'Vui lòng gõ chính xác từ khóa "XÓA".');
      return;
    }
    if (!password.trim()) {
      Alert.alert("Thiếu mật khẩu", "Vui lòng nhập mật khẩu để xác nhận.");
      return;
    }

    // TODO: Gọi API xoá tài khoản, sau đó logout & điều hướng về màn hình chính
    Alert.alert(
      "Đã gửi yêu cầu",
      "Yêu cầu xoá tài khoản của bạn đã được ghi nhận (demo)."
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Xoá tài khoản</Text>

      <Text style={styles.warningTitle}>⚠ Cảnh báo quan trọng</Text>
      <Text style={styles.paragraph}>
        Khi bạn xoá tài khoản, toàn bộ dữ liệu cá nhân liên quan đến tài khoản
        này sẽ bị xoá khỏi hệ thống. Hành động này không thể hoàn tác.
      </Text>

      <View style={styles.box}>
        <Text style={styles.boxText}>
          • Bạn sẽ không đăng nhập lại bằng tài khoản này được nữa.{"\n"}
          • Các dữ liệu cá nhân (thông tin hồ sơ, cài đặt…) sẽ bị xoá.{"\n"}
          • Dữ liệu thống kê ẩn danh (không chứa thông tin cá nhân) có thể vẫn
          được giữ lại để phục vụ phân tích hệ thống.
        </Text>
      </View>

      <Text style={styles.label}>
        Gõ từ khóa <Text style={{ fontWeight: "700" }}>"XÓA"</Text> để xác nhận:
      </Text>
      <TextInput
        style={styles.input}
        value={confirmText}
        onChangeText={setConfirmText}
        placeholder='Nhập "XÓA"'
      />

      <Text style={styles.label}>Nhập mật khẩu của bạn</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
      />

      <Pressable style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Xoá tài khoản vĩnh viễn</Text>
      </Pressable>

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
  warningTitle: { fontSize: 16, fontWeight: "600", color: "#DC2626" },
  paragraph: { fontSize: 14, color: "#4B5563", marginTop: 6, marginBottom: 12 },
  box: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  boxText: { fontSize: 13, color: "#7F1D1D" },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
  },
  deleteBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  deleteText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  backBtn: { paddingVertical: 12, marginTop: 10 },
  backText: { color: "#6B7280", textAlign: "center", fontSize: 14 },
});
