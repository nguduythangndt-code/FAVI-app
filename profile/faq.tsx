import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "Favi dùng offline được không?",
    answer:
      "Hiện tại Favi cần kết nối internet để tải dữ liệu bệnh và thuốc mới nhất. Trong tương lai, chúng tôi sẽ tối ưu để dùng ổn định hơn khi mạng yếu.",
  },
  {
    question: "Dữ liệu bệnh trong app có thay thế thú y không?",
    answer:
      "Không. Favi chỉ cung cấp thông tin tham khảo. Quyết định điều trị cuối cùng vẫn cần bác sĩ thú y hoặc người có chuyên môn.",
  },
  {
    question: "App có lưu thông tin đàn vật nuôi của tôi không?",
    answer:
      "Ở phiên bản hiện tại, Favi chưa lưu hồ sơ đàn. Tính năng quản lý đàn và lịch chăm sóc sẽ được bổ sung trong các bản cập nhật sau.",
  },
];

export default function FAQScreen() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Câu hỏi thường gặp</Text>
      <Text style={styles.desc}>
        Một số câu hỏi cơ bản khi sử dụng Favi - Ứng dụng chăn nuôi thông minh.
      </Text>

      {FAQ_DATA.map((item, index) => {
        const open = openIndex === index;
        return (
          <View key={index} style={styles.card}>
            <Pressable
              onPress={() => setOpenIndex(open ? null : index)}
              style={styles.cardHeader}
            >
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.icon}>{open ? "−" : "+"}</Text>
            </Pressable>
            {open && <Text style={styles.answer}>{item.answer}</Text>}
          </View>
        );
      })}

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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: { fontSize: 14, fontWeight: "500", flex: 1, marginRight: 8 },
  icon: { fontSize: 18, color: "#6B7280" },
  answer: { fontSize: 13, color: "#4B5563", marginTop: 6 },
  backBtn: { paddingVertical: 12, marginTop: 10 },
  backText: { color: "#6B7280", textAlign: "center", fontSize: 14 },
});
