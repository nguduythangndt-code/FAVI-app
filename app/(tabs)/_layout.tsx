import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0f766e",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* 1. DANH MỤC */}
      <Tabs.Screen
        name="category"
        options={{
          title: "Danh mục",
          tabBarLabel: "Danh mục",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. THUỐC */}
      <Tabs.Screen
        name="drugs"
        options={{
          title: "Thuốc",
          tabBarLabel: "Thuốc",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. TÌM KIẾM */}
      <Tabs.Screen
        name="quicksearch"
        options={{
          title: "Tìm kiếm",
          tabBarLabel: "Tìm kiếm",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
