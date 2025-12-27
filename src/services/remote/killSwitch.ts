import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/config/firebaseConfig";

export type KillSwitchMode = "soft" | "hard";

export type KillSwitchConfig = {
  enabled: boolean;
  mode: KillSwitchMode;
  message?: string;
  disabledFeatures?: string[];
};

const DEFAULT: KillSwitchConfig = {
  enabled: false,
  mode: "soft",
  message: "",
  disabledFeatures: [],
};

export async function fetchKillSwitch(): Promise<KillSwitchConfig> {
  try {
    const ref = doc(db, "app_config", "kill_switch");
    const snap = await getDoc(ref);

    if (!snap.exists()) return DEFAULT;

    const data = snap.data() as any;

    return {
      enabled: Boolean(data.enabled),
      mode: (data.mode === "hard" ? "hard" : "soft") as KillSwitchMode,
      message: typeof data.message === "string" ? data.message : DEFAULT.message,
      disabledFeatures: Array.isArray(data.disabledFeatures)
        ? data.disabledFeatures.filter((x: any) => typeof x === "string")
        : [],
    };
  } catch (e) {
    console.warn("[KILL] fetchKillSwitch failed", e);
    return DEFAULT; // fail-open
  }
}
