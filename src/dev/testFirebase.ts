// src/dev/testFirebase.ts
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function testFirebaseWrite() {
  try {
    await addDoc(collection(db, "testCollection"), {
      message: "Hello from FAVI",
      createdAt: serverTimestamp(),
    });
    console.log("🔥 Firestore test: OK");
  } catch (error) {
    console.log("🔥 Firestore test ERROR:", error);
  }
}
