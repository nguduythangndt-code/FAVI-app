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

// ====== 3. LOG HÀNH VI XEM MỤC CHĂM SÓC ======

type LogCareViewParams = {
  animal: string;          // "goat" | "pig" | "cattle" | "chicken"
  careId: string;          // goat_fattening, goat_doe, ...
  careName?: string;       // tên hiển thị, có thể null
  timeOnScreenMs?: number; // thời gian ở trên màn, ms
};

export async function logCareView(params: LogCareViewParams) {
  try {
    const deviceId = await getDeviceId();

    const { animal, careId, careName, timeOnScreenMs } = params;

    await addDoc(collection(db, "careViews"), {
      app: "favi",
      platform: Platform.OS,
      deviceId,
      animal,
      careId,
      careName: careName ?? null,
      timeOnScreenMs: timeOnScreenMs ?? null,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log("logCareView error:", error);
  }
}
