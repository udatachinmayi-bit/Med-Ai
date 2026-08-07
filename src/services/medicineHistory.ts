import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, type Unsubscribe } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { MedicineAnalysis, MedicineReminder, MedicineScan } from "@/types/medicine";

const scansCollection = (uid: string) => collection(db, "users", uid, "medicineHistory");
const remindersCollection = (uid: string) => collection(db, "users", uid, "medicineReminders");

export async function saveMedicineScan(uid: string, file: File, extractedText: string, analysis: MedicineAnalysis) {
  const path = `medicine-scans/${uid}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file, { contentType: file.type });
  const imageURL = await getDownloadURL(imageRef);
  await addDoc(scansCollection(uid), { userId: uid, imageUrl: imageURL, ocrText: extractedText, ...analysis, createdAt: serverTimestamp() });
}

export function subscribeToMedicineScans(uid: string, callback: (scans: MedicineScan[]) => void): Unsubscribe {
  return onSnapshot(query(scansCollection(uid), orderBy("createdAt", "desc")), (snapshot) => callback(snapshot.docs.map((entry) => {
    const data = entry.data();
    const analysis = data.analysis ?? data;
    return { id: entry.id, imageUrl: data.imageUrl ?? data.imageURL ?? "", medicineName: data.medicineName, brand: data.brand ?? "", safetyIndicator: data.safetyIndicator ?? { status: "Consult Doctor", color: "red", reason: "" }, confidence: typeof data.confidence === "number" ? data.confidence : 0, ocrText: data.ocrText ?? data.extractedText ?? "", analysis, createdAt: data.createdAt?.toDate?.() ?? null };
  })));
}

export const deleteMedicineScan = (uid: string, id: string) => deleteDoc(doc(db, "users", uid, "medicineHistory", id));

export function subscribeToReminders(uid: string, callback: (reminders: MedicineReminder[]) => void): Unsubscribe {
  return onSnapshot(query(remindersCollection(uid), orderBy("createdAt", "desc")), (snapshot) => callback(snapshot.docs.map((entry) => {
    const data = entry.data();
    return { id: entry.id, medicineName: data.medicineName, time: data.time, frequency: data.frequency, createdAt: data.createdAt?.toDate?.() ?? null };
  })));
}

export const saveMedicineReminder = (uid: string, values: Omit<MedicineReminder, "id" | "createdAt">) => addDoc(remindersCollection(uid), { ...values, createdAt: serverTimestamp() });
export const deleteMedicineReminder = (uid: string, id: string) => deleteDoc(doc(db, "users", uid, "medicineReminders", id));
