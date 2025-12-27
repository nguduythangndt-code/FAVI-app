import type { KillSwitchConfig } from "./killSwitch";

let _cfg: KillSwitchConfig = {
  enabled: false,
  mode: "soft",
  message: "",
  disabledFeatures: [],
};

// ✅ listeners để UI re-render khi cfg đổi
const listeners = new Set<() => void>();

export function setKillSwitch(cfg: KillSwitchConfig) {
  _cfg = cfg;
  listeners.forEach((fn) => fn());
}

export function getKillSwitch() {
  return _cfg;
}

export function subscribeKillSwitch(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isFeatureDisabled(feature: string) {
  if (!_cfg.enabled) return false;
  return _cfg.disabledFeatures?.includes(feature) ?? false;
}

export function isHardBlocked() {
  return _cfg.enabled && _cfg.mode === "hard";
}
