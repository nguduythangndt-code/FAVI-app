// src/services/deviceId.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "favi_device_id";

export async function getDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const newId =
      "favi_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 8);

    await AsyncStorage.setItem(STORAGE_KEY, newId);
    return newId;
  } catch (error) {
    console.log("getDeviceId error:", error);
    return "unknown";
  }
}
