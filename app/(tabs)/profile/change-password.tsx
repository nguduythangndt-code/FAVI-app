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

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (newPassword.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Hai mật khẩu mới không trùng khớp.");
      return;
    }

    Alert.alert("Thành công", "Mật khẩu đã được cập nhật.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>

      <Field
        label="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secure
      />
      <Field
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secure
      />
      <Field
        label="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secure
      />

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Cập nhật mật khẩu</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Quay lại</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, secure = false }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        secureTextEntry={secure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: { fontSize: 14, marginBottom: 4, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#F9FAFB",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  saveText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: { paddingVertical: 12, marginTop: 10 },
  backText: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 14,
  },
});
