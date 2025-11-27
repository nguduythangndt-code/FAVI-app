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

export default function PersonalInfoScreen() {
  const router = useRouter();

  const [name, setName] = useState("Nguyễn Văn A");
  const [phone, setPhone] = useState("09xx xxx xxx");
  const [email, setEmail] = useState("user@example.com");
  const [farmName, setFarmName] = useState("Trang trại Favi");
  const [province, setProvince] = useState("Nghệ An");
  const [role, setRole] = useState("Chủ trại");

  const handleSave = () => {
    Alert.alert("Đã lưu", "Thông tin cá nhân đã được cập nhật.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      <Field label="Họ và tên" value={name} onChangeText={setName} />
      <Field label="Số điện thoại" value={phone} onChangeText={setPhone} />
      <Field label="Email" value={email} onChangeText={setEmail} />
      <Field label="Tên trang trại" value={farmName} onChangeText={setFarmName} />
      <Field label="Tỉnh / Thành" value={province} onChangeText={setProvince} />
      <Field label="Vai trò" value={role} onChangeText={setRole} />

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu thay đổi</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Quay lại</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Field({ label, value, onChangeText }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
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
  label: { fontSize: 14, color: "#374151", marginBottom: 4 },
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
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backBtn: { paddingVertical: 12, marginTop: 10 },
  backText: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 14,
  },
});
