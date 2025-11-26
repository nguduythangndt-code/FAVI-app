// app/(tabs)/drugs/_layout.tsx
import { Stack } from "expo-router";

export default function DrugsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      {/* 1. Màn chọn nhóm thuốc: /drugs */}
      <Stack.Screen
        name="index"
        options={{
          title: "Nhóm thuốc thú y",
        }}
      />

      {/* 2. Màn danh sách thuốc theo nhóm: /drugs/[group] */}
      <Stack.Screen
        name="[group]/index"
        options={{
          title: "Danh sách thuốc",
        }}
      />

      {/* 3. Màn chi tiết thuốc: /drugs/[group]/[id] */}
      <Stack.Screen
        name="[group]/[id]"
        options={{
          title: "Chi tiết thuốc",
        }}
      />
    </Stack>
  );
}
