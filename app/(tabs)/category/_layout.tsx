import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      {/* 1. Màn chọn loài: /category */}
      <Stack.Screen
        name="index"
        options={{
          title: "Danh mục bệnh theo loài",
        }}
      />

      {/* 2. Màn nhóm bệnh: /category/[animal] */}
      <Stack.Screen
        name="[animal]/index"
        options={{
          title: "Nhóm bệnh",
        }}
      />

      {/* 3. Màn danh sách bệnh: /category/[animal]/[group] */}
      <Stack.Screen
        name="[animal]/[group]/index"
        options={{
          title: "Danh sách bệnh",
        }}
      />

      {/* 4. Màn chi tiết bệnh: /category/[animal]/[group]/[id] */}
      <Stack.Screen
        name="[animal]/[group]/[id]"
        options={{
          title: "Chi tiết bệnh",
        }}
      />
    </Stack>
  );
}
