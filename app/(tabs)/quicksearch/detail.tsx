// app/(tabs)/quicksearch/detail.tsx
import React from "react";
// import lại màn chi tiết bệnh của Category
import CategoryDiseaseDetailScreen from "../category/[animal]/[group]/[id]";

export default function QuicksearchDetailScreen() {
  // Dùng luôn component chi tiết bệnh của Category
  return <CategoryDiseaseDetailScreen />;
}
