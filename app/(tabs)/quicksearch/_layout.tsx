import { Stack } from "expo-router";

export default function QuicksearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Tìm theo triệu chứng" }}
      />

      <Stack.Screen
        name="result"
        options={{ title: "Kết quả tìm kiếm" }}
      />

      <Stack.Screen
        name="detail"
        options={{ title: "Chi tiết bệnh" }}
      />
    </Stack>
  );
}
