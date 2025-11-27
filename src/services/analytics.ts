// src/services/analytics.ts

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Platform } from "react-native";
import { db } from "../lib/firebase";
import { getDeviceId } from "./deviceId";

// ================== KIỂU DỮ LIỆU ==================

export type DiseaseViewSource = "category" | "quicksearch";

// ====== 1. LOG HÀNH VI TÌM KIẾM QUICKSEARCH ======

type QuicksearchLogParams = {
  animal: string;       // "goat" | "pig" | "cattle" | "chicken"
  query: string;
  resultCount: number;
};

export async function logQuicksearchQuery({
  animal,
  query,
  resultCount,
}: QuicksearchLogParams) {
  try {
    const trimmed = query.trim();
    if (!trimmed) return;

    const deviceId = await getDeviceId();

    await addDoc(collection(db, "quicksearchQueries"), {
      app: "favi",
      platform: Platform.OS,
      deviceId,
      animal,
      query: trimmed,
      resultCount,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log("logQuicksearchQuery error:", error);
  }
}

// ====== 2. LOG HÀNH VI XEM CHI TIẾT BỆNH ======

type LogDiseaseViewParams = {
  animal: string;
  group: string;
  diseaseId: string;
  diseaseName?: string;        // có thể undefined
  fromScreen: DiseaseViewSource;
  searchQuery?: string | null; // có thể undefined/null
  timeOnScreenMs?: number;
};

export async function logDiseaseView(params: LogDiseaseViewParams) {
  try {
    const deviceId = await getDeviceId();

    const {
      animal,
      group,
      diseaseId,
      diseaseName,
      fromScreen,
      searchQuery,
      timeOnScreenMs,
    } = params;

    await addDoc(collection(db, "diseaseViews"), {
      app: "favi",
      platform: Platform.OS,
      deviceId,
      animal,
      group,
      diseaseId,
      // QUAN TRỌNG: luôn convert undefined -> null để Firestore khỏi chửi
      diseaseName: diseaseName ?? null,
      fromScreen,
      searchQuery: searchQuery ?? null,
      timeOnScreenMs: timeOnScreenMs ?? null,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log("logDiseaseView error:", error);
  }
}
