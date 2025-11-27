// app/(tabs)/quicksearch/_layout.tsx
import { Stack } from "expo-router";

export default function QuicksearchLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      {/* Màn list triệu chứng */}
      <Stack.Screen
        name="index"
        options={{
          title: "Tìm theo triệu chứng",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />

      {/* Nếu sau này dùng result riêng */}
      <Stack.Screen
        name="result"
        options={{
          title: "Kết quả tìm kiếm",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />

      {/* Màn chi tiết bệnh – cũng có header + nút back */}
      <Stack.Screen
        name="detail"
        options={{
          title: "Chi tiết bệnh",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
