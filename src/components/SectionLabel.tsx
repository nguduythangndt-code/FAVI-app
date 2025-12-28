import { Text } from "react-native";

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={{
      textTransform: "uppercase",
      fontWeight: "500",
      fontSize: 13,
      color: "#111827",
      letterSpacing: 0.6,
      marginLeft: 14,
      marginTop: 12,
      marginBottom: 6,
    }}>
      {children}
    </Text>
  );
}
