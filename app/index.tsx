// app/index.tsx
import { Redirect } from "expo-router";

export default function RootIndex() {
  // Mở app là nhảy luôn vào tab Danh mục
  return <Redirect href="/(tabs)/category" />;
}
