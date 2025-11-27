// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Mở app là nhảy thẳng vào tab Danh mục (category)
  return <Redirect href="/(tabs)/category" />;
}
