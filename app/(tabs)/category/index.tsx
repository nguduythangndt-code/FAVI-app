// app/(tabs)/category/index.tsx
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
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
  "Quyết định đúng lúc có thể giúp bà con tránh được cả một đợt thiệt hại.",
  "Một chút hiểu biết hôm nay giúp bà con bớt vất vả vào ngày mai.",
  "Không phải chăm nhiều hơn, mà là chăm đúng cách.",
  "Đàn khỏe giúp bà con yên tâm hơn mỗi lần ra chuồng.",
  "Làm chăn nuôi giỏi bắt đầu từ việc hiểu rõ từng biểu hiện nhỏ.",
  "Mỗi lần xử lý đúng bệnh là thêm một lần giữ được công sức đã bỏ ra.",
  "Nuôi hiệu quả không cần phức tạp, chỉ cần đúng và kịp thời.",
  "Khi bà con nắm rõ tình trạng đàn, mọi quyết định trở nên nhẹ đầu hơn.",
  "Chốt sớm, làm đúng giúp bà con ngủ ngon hơn sau mỗi ngày làm việc.",
  "Chăn nuôi bền vững đến từ những thói quen đúng được duy trì lâu dài."

];

export default function CategoryHomeScreen() {
  // câu hiện tại
  const [missionText, setMissionText] = useState(MISSION_QUOTES[0]);

  // mỗi lần màn Category được focus (quay lại) thì random câu mới
  useFocusEffect(
  useCallback(() => {
    setMissionText((prev) => {
      let i = Math.floor(Math.random() * MISSION_QUOTES.length);
      while (MISSION_QUOTES[i] === prev && MISSION_QUOTES.length > 1) {
        i = Math.floor(Math.random() * MISSION_QUOTES.length);
      }
      return MISSION_QUOTES[i];
    });
  }, [])
);


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
      Ứng dụng thông minh
       cho bà con Việt Nam.
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
    marginBottom: spacing.xs,
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
    width: 70,
    height: 70,
    borderRadius: 20,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  brandTagline: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  brandSlogan: {
    fontSize: 13,
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
