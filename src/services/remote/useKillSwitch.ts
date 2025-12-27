import { useSyncExternalStore } from "react";
import { subscribeKillSwitch, getKillSwitch } from "./killSwitchState";

export function useKillSwitch() {
  return useSyncExternalStore(
    subscribeKillSwitch,
    getKillSwitch,
    getKillSwitch
  );
}
