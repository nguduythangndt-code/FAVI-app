// app/(tabs)/category/index.tsx
import { Link } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../src/theme";


// ================== DATA LOÀI VẬT ==================
const ANIMALS = [
  { key: "goat", label: "Dê", emoji: "🐐" },
  { key: "pig", label: "Heo", emoji: "🐖" },
  { key: "cattle", label: "Bò", emoji: "🐄" },
  { key: "chicken", label: "Gà", emoji: "🐓" },
];

// ================== CÂU QUOTE SỨ MỆNH ==================
const MISSION_QUOTES = [
  "Sứ mệnh của chúng tôi là tiếp sức cho bà con chăn nuôi, giúp mỗi quyết định đều dẫn tới bước tiến mới.",
  "Kiến thức đúng giúp đàn vật nuôi khỏe hơn, túi tiền của bà con vững hơn.",
  "Mỗi lần bà con hiểu đúng một căn bệnh, rủi ro lại ít đi một chút.",
  "Chăn nuôi thông minh bắt đầu từ những quyết định nhỏ nhưng chính xác.",
  "Sức khỏe đàn là thành quả của sự để tâm từng ngày.",
  "Phòng bệnh sớm không chỉ cứu đàn, mà còn bảo vệ công sức cả mùa vụ.",
  "Hiểu đàn - hiểu bệnh - hiểu cách xử lý. Ba điều đó giúp bà con tự tin hơn mỗi ngày.",
  "Khi bà con mạnh dạn thay đổi cách làm, đàn vật nuôi cũng thay đổi theo.",
  "Chăn nuôi thông minh không phải chuyện lớn lao, mà là những lựa chọn nhỏ được làm đúng.",
];

export default function CategoryHomeScreen() {
  // random 1 câu mỗi lần vào màn
  const missionText = useMemo(() => {
    const index = Math.floor(Math.random() * MISSION_QUOTES.length);
    return MISSION_QUOTES[index];
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bạn đang nuôi gì?</Text>
          <Text style={styles.subtitle}>Chọn loài để xem nhóm bệnh.</Text>
        </View>

        {/* DANH SÁCH LOÀI VẬT */}
        {ANIMALS.map((item) => (
          <Link
            key={item.key}
            href={{
              pathname: "/(tabs)/category/[animal]",
              params: { animal: item.key },
            }}
            asChild
          >
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.cardText}>{item.label}</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </TouchableOpacity>
          </Link>
        ))}

        {/* ====== KHỐI THƯƠNG HIỆU FAVI ====== */}
<View style={styles.brandWrapper}>
  <View style={styles.brandContainer}>
    {/* LOGO FAVI */}
    <Image
      source={require("../../../assets/logo/favi.png")}
      style={styles.brandLogo}
    />

    {/* Tagline */}
    <Text style={styles.brandTagline}>Nông Trại Việt</Text>

    {/* Slogan */}
    <Text style={styles.brandSlogan}>
      Ứng dụng chăn nuôi thông minh cho bà con Việt Nam.
    </Text>

    {/* Quote random mỗi lần vào */}
    <Text style={styles.brandQuote}>{missionText}</Text>
  </View>
</View>

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

  // ===== HEADER =====
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
  },

  // ===== CARD LOÀI VẬT =====
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadow.card,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardEmoji: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  cardArrow: {
    fontSize: 20,
    color: colors.textMuted,
  },

  // ===== STYLE KHỐI THƯƠNG HIỆU =====
  brandWrapper: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  brandLogo: {
    width: 96,
    height: 96,
    borderRadius: 20,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  brandTagline: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  brandSlogan: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xs,
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
  brandQuote: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: spacing.md,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
