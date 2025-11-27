// app/(tabs)/profile/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../src/theme";


const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Row: React.FC<{
  label: string;
  description: string;
  onPress: () => void;
}> = ({ label, description, onPress }) => (
  <Pressable style={styles.row} onPress={onPress}>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowDesc}>{description}</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </Pressable>
);

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // DEMO: chỉ quay về Danh mục (không ép login)
    router.replace("/(tabs)/category");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
<View style={styles.header}>
  <View style={styles.avatarPlaceholderSmall}>
    <Text style={styles.avatarTextSmall}>F</Text>
  </View>

  <View style={{ marginLeft: spacing.md, flex: 1 }}>
    <Text style={styles.userName}>Khách Favi</Text>

    <Text style={styles.userSub}>📱 Chưa đăng nhập</Text>
    <Text style={styles.userSub}>📧 -</Text>

    <Text style={styles.userRole}>Vai trò: Người dùng</Text>
  </View>
</View>

        {/* Tài khoản */}
        <Section title="Tài khoản">
          <Row
            label="Đăng nhập"
            description="Dùng số điện thoại hoặc email"
            onPress={() => router.push("/auth/login")}
          />
        </Section>

        {/* Thông báo */}
        <Section title="Thông báo">
          <Row
            label="Cập nhật bệnh & kiến thức"
            description="Bật/tắt nhận thông báo"
            onPress={() => {}}
          />
          <Row
            label="Tính năng mới"
            description="Thông báo khi app có cập nhật"
            onPress={() => {}}
          />
          <Row
            label="Tin tức & khuyến mãi"
            description="Không bắt buộc"
            onPress={() => {}}
          />
        </Section>

        {/* Hỗ trợ */}
        <Section title="Hỗ trợ">
          <Row
            label="Liên hệ hỗ trợ"
            description="Hotline / Zalo / Email"
            onPress={() => router.push("/(tabs)/profile/support")}
          />
          <Row
            label="Góp ý & báo lỗi"
            description="Gửi phản hồi cho đội phát triển"
            onPress={() => router.push("/(tabs)/profile/feedback")}
          />
          <Row
            label="FAQ"
            description="Câu hỏi thường gặp"
            onPress={() => router.push("/(tabs)/profile/faq")}
          />
        </Section>

        {/* Pháp lý */}
        <Section title="Pháp lý">
          <Row
            label="Điều khoản sử dụng"
            description="Tóm tắt điều khoản"
            onPress={() => router.push("/(tabs)/profile/terms")}
          />
          <Row
            label="Chính sách bảo mật"
            description="Cách chúng tôi xử lý dữ liệu"
            onPress={() => router.push("/(tabs)/profile/privacy")}
          />
          <Row
            label="Giải thích quyền truy cập"
            description="Quyền camera, file, thông báo..."
            onPress={() => router.push("/(tabs)/profile/permissions")}
          />
        </Section>

        {/* Thông tin ứng dụng */}
        <Section title="Thông tin ứng dụng">
          <Row
            label="Phiên bản"
            description="1.0.0 (demo)"
            onPress={() => {}}
          />
        </Section>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất (Demo)</Text>
        </Pressable>

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  

  header: {
  flexDirection: "row",          // đổi từ column → row
  alignItems: "center",
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.card,
  borderRadius: radius.lg,
  marginBottom: spacing.lg,
  borderWidth: 1,
  borderColor: colors.border,
  ...shadow.card,
},

avatarPlaceholderSmall: {
  width: 60,
  height: 60,
  borderRadius: 999,
  backgroundColor: colors.primary,
  justifyContent: "center",
  alignItems: "center",
},

avatarTextSmall: {
  color: "#FFF",
  fontSize: 28,
  fontWeight: "700",
},


  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.text,
  },
  userSub: {
    fontSize: 13,
    color: colors.textMuted,
  },
  userRole: {
    fontSize: 13,
    color: colors.text,
    marginTop: 6,
  },

  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
    paddingHorizontal: spacing.lg,
  },

  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
  rowDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },

  arrow: {
    fontSize: 22,
    color: "#9CA3AF",
    marginLeft: 4,
  },

  logoutBtn: {
    marginTop: spacing.sm,
    paddingVertical: 14,
    marginHorizontal: spacing.lg,
  },
  logoutText: {
    textAlign: "center",
    color: colors.danger,
    fontSize: 15,
    fontWeight: "600",
  },
});
