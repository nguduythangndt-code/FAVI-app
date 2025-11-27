// app/(tabs)/profile/settings/privacy.tsx
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chính sách bảo mật & giới hạn trách nhiệm</Text>

      <Text style={styles.sectionTitle}>1. Dữ liệu người dùng</Text>
      <Text style={styles.paragraph}>
        Phiên bản hiện tại của Livestock-care chủ yếu làm việc với dữ liệu bệnh
        và thông tin tham khảo. Ứng dụng không thu thập các thông tin nhạy cảm
        như số CMND/CCCD, tài khoản ngân hàng...
      </Text>

      <Text style={styles.sectionTitle}>2. Thông tin bệnh & thuốc</Text>
      <Text style={styles.paragraph}>
        Toàn bộ nội dung về bệnh, triệu chứng, nhóm thuốc trong ứng dụng chỉ
        mang tính chất tham khảo. Các mô tả được xây dựng để hỗ trợ người chăn
        nuôi hiểu vấn đề, KHÔNG phải là chẩn đoán chính thức.
      </Text>
      <Text style={styles.paragraph}>
        Ứng dụng không hiển thị liều dùng cụ thể (mg/kg, ml/kg, số ngày…). Người
        dùng cần tuân thủ liều trên nhãn thuốc hoặc theo hướng dẫn của bác sĩ
        thú y.
      </Text>

      <Text style={styles.sectionTitle}>3. Trách nhiệm sử dụng</Text>
      <Text style={styles.paragraph}>
        Người dùng tự chịu trách nhiệm với mọi quyết định điều trị dựa trên
        thông tin trong ứng dụng. Trong mọi trường hợp nặng, diễn biến nhanh
        hoặc bất thường, cần liên hệ thú y tại chỗ hoặc cơ sở thú y gần nhất.
      </Text>

      <Text style={styles.sectionTitle}>4. Cập nhật & thay đổi</Text>
      <Text style={styles.paragraph}>
        Nội dung trong Livestock-care có thể được cập nhật, chỉnh sửa theo thời
        gian để phù hợp hơn với thực tế chăn nuôi. Một số thông tin cũ có thể
        được thay thế hoặc gỡ bỏ nếu không còn phù hợp.
      </Text>

      <Text style={styles.disclaimer}>
        *Bằng việc tiếp tục sử dụng ứng dụng, bạn đồng ý rằng đây là công cụ hỗ
        trợ tham khảo, không thay thế vai trò của bác sĩ thú y.*
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginTop: 8, marginBottom: 4 },
  paragraph: { fontSize: 14, color: "#333", marginBottom: 6 },
  disclaimer: {
    fontSize: 12,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
    marginBottom: 20,
  },
});
