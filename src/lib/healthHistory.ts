import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  HealthHistoryRecord,
  HealthHistoryType,
} from "@/types/healthHistory";

const COLLECTION_NAME = "healthHistory";

export async function saveHealthHistory(
  userId: string,
  data: {
    type: HealthHistoryType;
    title: string;
    summary: string;
    metadata?: HealthHistoryRecord["metadata"];
  }
) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const historyRef = collection(
    db,
    COLLECTION_NAME
  );

  const docRef = await addDoc(historyRef, {
    userId,
    type: data.type,
    title: data.title,
    summary: data.summary,
    metadata: data.metadata || {},
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getHealthHistory(
  userId: string
): Promise<HealthHistoryRecord[]> {
  if (!userId) {
    return [];
  }

  const historyRef = collection(
    db,
    COLLECTION_NAME
  );

  const historyQuery = query(
    historyRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(historyQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<
      HealthHistoryRecord,
      "id"
    >),
  }));
}

export async function deleteHealthHistory(
  historyId: string
) {
  await deleteDoc(
    doc(db, COLLECTION_NAME, historyId)
  );
}