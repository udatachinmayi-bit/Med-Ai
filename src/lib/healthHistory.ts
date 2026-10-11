
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

export type NewHealthHistoryRecord = {
  type: HealthHistoryType;
  title: string;
  summary: string;
  metadata?: HealthHistoryRecord["metadata"];
};

export async function saveHealthHistory(
  userId: string,
  data: NewHealthHistoryRecord
): Promise<string> {
  if (!userId) {
    throw new Error("Please sign in to save health history.");
  }

  if (!data.title.trim()) {
    throw new Error("A record title is required.");
  }

  const recordRef = await addDoc(
    collection(db, COLLECTION_NAME),
    {
      userId,
      type: data.type,
      title: data.title.trim(),
      summary: data.summary.trim(),
      metadata: data.metadata ?? {},
      createdAt: serverTimestamp(),
    }
  );

  return recordRef.id;
}

export async function getHealthHistory(
  userId: string
): Promise<HealthHistoryRecord[]> {
  if (!userId) {
    throw new Error("Please sign in to view health history.");
  }

  const recordsQuery = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(recordsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      userId: data.userId,
      type: data.type as HealthHistoryType,
      title: data.title ?? "Health record",
      summary: data.summary ?? "",
      createdAt: data.createdAt ?? null,
      metadata: data.metadata ?? {},
    };
  });
}

export async function deleteHealthHistory(
  userId: string,
  historyId: string
): Promise<void> {
  if (!userId || !historyId) {
    throw new Error("User and record IDs are required.");
  }

  // Verify ownership before deleting.
  const records = await getHealthHistory(userId);
  const ownsRecord = records.some(
    (record) => record.id === historyId
  );

  if (!ownsRecord) {
    throw new Error("Record not found or access denied.");
  }

  await deleteDoc(doc(db, COLLECTION_NAME, historyId));
}
