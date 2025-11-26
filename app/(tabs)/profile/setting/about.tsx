// app/(tabs)/profile/settings/about.tsx
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Giới thiệu Livestock-care</Text>

      <Text style={styles.paragraph}>
        Livestock-care là ứng dụng hỗ trợ người chăn nuôi trong việc tra cứu
        bệnh, triệu chứng và hướng xử lý tham khảo cho vật nuôi: dê, lợn, bò, gà.
      </Text>

      <Text style={styles.paragraph}>
        Ứng dụng tập trung vào:
      </Text>
      <Text style={styles.bullet}>• Phân loại bệnh theo loài và nhóm bệnh.</Text>
      <Text style={styles.bullet}>• Mô tả triệu chứng chi tiết, dễ hiểu.</Text>
      <Text style={styles.bullet}>• Gợi ý nhóm thuốc và hướng xử lý ở mức tham khảo.</Text>

      <Text style={styles.paragraph}>
        Livestock-care KHÔNG thay thế bác sĩ thú y. Mọi quyết định điều trị
        cuối cùng vẫn cần dựa vào thăm khám trực tiếp và tư vấn chuyên môn.
      </Text>

      <Text style={styles.paragraph}>
        Mục tiêu của ứng dụng là giúp người chăn nuôi:
      </Text>
      <Text style={styles.bullet}>• Nhận biết sớm dấu hiệu bất thường.</Text>
      <Text style={styles.bullet}>• Giảm phụ thuộc vào tin đồn, kinh nghiệm truyền miệng thiếu kiểm chứng.</Text>
      <Text style={styles.bullet}>• Ghi nhớ thông tin bệnh một cách hệ thống, rõ ràng.</Text>

      <Text style={styles.paragraph}>
        Phiên bản hiện tại là bản nền tảng, dữ liệu có thể chưa đầy đủ cho tất
        cả bệnh và tất cả loài. Ứng dụng sẽ được cập nhật dần theo thời gian.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  paragraph: { fontSize: 14, color: "#333", marginBottom: 8 },
  bullet: { fontSize: 14, color: "#333", marginBottom: 4 },
});
