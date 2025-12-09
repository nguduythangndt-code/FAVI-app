// app/drug-detail/_layout.tsx
import { Stack } from "expo-router";

export default function DrugDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        // Có thể set thêm mấy cái cơ bản nếu muốn:
        // title: "Chi tiết thuốc",
      }}
    />
  );
}
