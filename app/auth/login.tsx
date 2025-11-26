import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneOrEmail.trim() || !password.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đủ tài khoản và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      // TODO: gọi API đăng nhập, nhận token & lưu AsyncStorage
      // Demo:
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Đăng nhập thành công", "Chào mừng bạn quay lại Favi!", [
          {
            text: "Tiếp tục",
            onPress: () => {
              // Quay về trang trước hoặc sang tabs chính
              router.replace("/(tabs)/category");
            },
          },
        ]);
      }, 800);
    } catch (error) {
      setLoading(false);
      Alert.alert("Lỗi", "Không thể đăng nhập. Vui lòng thử lại sau.");
    }
  };

  const goRegister = () => {
  router.push("/auth/register");
};


  const goForgotPassword = () => {
    // Sau này điều hướng sang màn quên mật khẩu
    Alert.alert(
      "Quên mật khẩu",
      "Vui lòng liên hệ hỗ trợ để được cấp lại mật khẩu (bản demo)."
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo / Title */}
        <View style={styles.header}>
          <Text style={styles.appName}>Favi</Text>
          <Text style={styles.appSubtitle}>Ứng dụng chăn nuôi thông minh</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>
            Sử dụng số điện thoại hoặc email để đăng nhập.
          </Text>

          {/* Tài khoản */}
          <View style={styles.field}>
            <Text style={styles.label}>Số điện thoại hoặc Email</Text>
            <TextInput
              style={styles.input}
              value={phoneOrEmail}
              onChangeText={setPhoneOrEmail}
              placeholder="Nhập số điện thoại hoặc email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mật khẩu */}
          <View style={styles.field}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              secureTextEntry
            />
          </View>

          {/* Ghi nhớ & Quên mật khẩu */}
          <View style={styles.rowBetween}>
            <View style={styles.rememberRow}>
              <Switch
                value={remember}
                onValueChange={setRemember}
              />
              <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
            </View>

            <Pressable onPress={goForgotPassword}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </Pressable>
          </View>

                {/* Nút Đăng nhập */}
      <Pressable
        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Text>
      </Pressable>

      {/* ⚠️ Nút demo: vào thẳng app không cần đăng nhập */}
      <Pressable
        style={styles.demoBtn}
        onPress={() => router.replace("/(tabs)/category")}
      >
        <Text style={styles.demoText}>Vào demo không cần đăng nhập</Text>
      </Pressable>


          {/* Đăng ký */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Chưa có tài khoản?</Text>
            <Pressable onPress={goRegister}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </Pressable>
          </View>
        </View>

        {/* Ghi chú pháp lý nhẹ */}
        <Text style={styles.legal}>
          Bằng việc đăng nhập, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Favi.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: "flex-start",
  },
    demoBtn: {
    marginTop: 10,
    paddingVertical: 10,
  },
  demoText: {
    textAlign: "center",
    fontSize: 14,
    color: "#2563EB",
    textDecorationLine: "underline",
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2563EB",
  },
  appSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 15,
    backgroundColor: "#F9FAFB",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 13,
    color: "#4B5563",
    marginLeft: 6,
  },
  forgotText: {
    fontSize: 13,
    color: "#2563EB",
    textDecorationLine: "underline",
  },
  loginBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  registerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  registerLink: {
    fontSize: 13,
    color: "#2563EB",
    marginLeft: 4,
    fontWeight: "500",
  },
  legal: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
  },
});
