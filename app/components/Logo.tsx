import React from "react";
import { Image } from "react-native";

export default function Logo({ size = 110 }) {
  return (
    <Image
      source={require("../../assets/logo/favi.png")}
      style={{
        width: size,
        height: size,
        resizeMode: "contain",
        borderRadius: 24,
      }}
    />
  );
}
