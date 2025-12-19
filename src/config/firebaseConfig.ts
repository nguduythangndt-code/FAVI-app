// src/config/firebaseConfig.ts
// Firebase config + init (project favi-d6100)

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "favi-d6100",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// tránh init nhiều lần khi hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
