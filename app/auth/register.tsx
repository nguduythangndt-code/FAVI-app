import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Demo: coi OTP đúng là 123456
  const DEMO_OTP = "123456";

  const handleSendOtp = () => {
    if (!phone.trim()) {
      Alert.alert("Thiếu số điện thoại", "Vui lòng nhập số điện thoại.");
      return;
    }

    // Có thể check sơ bộ độ dài số ĐT VN (10 số)
    if (phone.replace(/\D/g, "").length < 9) {
      Alert.alert("Số điện thoại không hợp lệ", "Vui lòng kiểm tra lại.");
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("otp");
      Alert.alert(
        "Đã gửi OTP (demo)",
        `Mã OTP DEMO là ${DEMO_OTP}. Sau này sẽ gửi thật qua SMS.`
      );
    }, 800);
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      Alert.alert("Thiếu OTP", "Vui lòng nhập mã OTP.");
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);

      if (otp !== DEMO_OTP) {
        Alert.alert("Sai OTP", "Mã OTP không đúng. Vui lòng kiểm tra lại.");
        return;
      }

      // Sau khi OTP đúng → coi như đã tạo tài khoản thành công
      Alert.alert("Thành công", "Tài khoản đã được tạo. Bạn có thể sử dụng Favi.", [
        {
          text: "Tiếp tục",
          onPress: () => {
            // Sau này: lưu token / trạng thái đăng nhập
            router.replace("/(tabs)/category");
          },
        },
      ]);
    }, 800);
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
      setOtp("");
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appName}>Favi</Text>
          <Text style={styles.appSubtitle}>Đăng ký tài khoản mới</Text>
        </View>

        <View style={styles.card}>
          {step === "phone" ? (
            <>
              <Text style={styles.title}>Nhập số điện thoại</Text>
              <Text style={styles.subtitle}>
                Chúng tôi sẽ gửi mã OTP về số này để xác minh tài khoản.
              </Text>

              <View style={styles.field}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              </View>

              <Pressable
                style={[styles.primaryBtn, sending && { opacity: 0.7 }]}
                onPress={handleSendOtp}
                disabled={sending}
              >
                <Text style={styles.primaryText}>
                  {sending ? "Đang gửi..." : "Gửi mã OTP"}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.title}>Nhập mã OTP</Text>
              <Text style={styles.subtitle}>
                Mã OTP đã được gửi tới số{" "}
                <Text style={{ fontWeight: "600" }}>{phone}</Text> (demo).
              </Text>

              <View style={styles.field}>
                <Text style={styles.label}>Mã OTP</Text>
                <TextInput
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Nhập mã OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <Pressable
                style={[styles.primaryBtn, verifying && { opacity: 0.7 }]}
                onPress={handleVerifyOtp}
                disabled={verifying}
              >
                <Text style={styles.primaryText}>
                  {verifying ? "Đang xác minh..." : "Xác nhận & tạo tài khoản"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryBtn}
                onPress={handleSendOtp}
                disabled={sending}
              >
                <Text style={styles.secondaryText}>
                  Gửi lại OTP {sending ? "(Đang gửi...)" : ""}
                </Text>
              </Pressable>
            </>
          )}

          <Pressable style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backText}>
              {step === "otp" ? "Quay lại bước nhập số" : "Quay lại"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          Khi đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Favi.
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
  primaryBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryBtn: {
    paddingVertical: 10,
    marginTop: 8,
  },
  secondaryText: {
    color: "#2563EB",
    fontSize: 14,
    textAlign: "center",
  },
  backBtn: {
    paddingVertical: 10,
    marginTop: 8,
  },
  backText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },
  note: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
  },
});
