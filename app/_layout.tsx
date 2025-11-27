// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Quan trọng: bật vuốt để back
        gestureEnabled: true,
        fullScreenGestureEnabled: true, // iOS dùng full screen, Android bỏ qua cũng không sao
      }}
    />
  );
}
