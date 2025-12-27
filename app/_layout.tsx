// app/_layout.tsx
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert } from "react-native";

import { getActiveBundle as loadBundle } from "../src/services/data/bundleLoader";
import { setActiveBundle } from "../src/services/data/activeBundle";

import { fetchKillSwitch } from "../src/services/remote/killSwitch";
import { setKillSwitch } from "../src/services/remote/killSwitchState";

// Giữ splash cho đến khi ta chủ động hide
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    async function initApp() {
      try {
        // 1️⃣ Load bundle (có fallback)
        const { bundle, source } = await loadBundle();

        // 2️⃣ Set active bundle cho toàn app
        setActiveBundle(bundle, source);

        console.log("[INIT] Active bundle:", bundle.dataVersion, "source:", source);

        // 3️⃣ Fetch kill-switch
        const ks = await fetchKillSwitch();
        setKillSwitch(ks);

        if (ks.enabled) {
          console.log("[KILL] enabled", ks.mode, ks.disabledFeatures);

          // hard-block: chặn app luôn
          if (ks.mode === "hard") {
            Alert.alert(
              "Tạm khóa",
              ks.message || "Ứng dụng đang tạm khóa.",
              [{ text: "OK" }]
            );
          }
        }
      } catch (e) {
        console.error("[INIT] Failed to init app", e);
      } finally {
        // 4️⃣ Chỉ hide splash khi xong hết
        await SplashScreen.hideAsync();
      }
    }

    initApp();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    />
  );
}
