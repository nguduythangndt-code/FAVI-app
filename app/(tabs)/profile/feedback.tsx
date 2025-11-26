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

export default function FeedbackScreen() {
  const router = useRouter();
  const [type, setType] = useState<"feature" | "bug" | "other">("feature");
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (!content.trim()) {
      Alert.alert("Thiếu nội dung", "Vui lòng nhập nội dung góp ý hoặc báo lỗi.");
      return;
    }
    Alert.alert("Đã gửi", "Cảm ơn bạn đã đóng góp cho Favi!");
    setContent("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gửi góp ý & báo lỗi</Text>
      <Text style={styles.desc}>
        Mọi góp ý của bạn sẽ giúp Favi ngày càng tốt hơn cho bà con chăn nuôi.
      </Text>

      <Text style={styles.label}>Loại nội dung</Text>
      <View style={styles.typeRow}>
        <TypeChip
          label="Góp ý tính năng"
          active={type === "feature"}
          onPress={() => setType("feature")}
        />
        <TypeChip
          label="Báo lỗi"
          active={type === "bug"}
          onPress={() => setType("bug")}
        />
        <TypeChip
          label="Khác"
          active={type === "other"}
          onPress={() => setType("other")}
        />
      </View>

      <Text style={styles.label}>Nội dung chi tiết</Text>
      <TextInput
        style={styles.textArea}
        value={content}
        onChangeText={setContent}
        placeholder="Mô tả vấn đề hoặc góp ý của bạn..."
        multiline
        numberOfLines={6}
      />

      <Pressable style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendText}>Gửi góp ý</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Quay lại</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function TypeChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: "#2563EB1A", borderColor: "#2563EB" },
      ]}
    >
      <Text style={[styles.chipText, active && { color: "#2563EB" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  desc: { fontSize: 14, color: "#4B5563", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", marginTop: 12, marginBottom: 4 },
  typeRow: { flexDirection: "row", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { fontSize: 13, color: "#4B5563" },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#F9FAFB",
    textAlignVertical: "top",
  },
  sendBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  sendText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: { paddingVertical: 12, marginTop: 10 },
  backText: { color: "#6B7280", textAlign: "center", fontSize: 14 },
});
