export type HealthHistoryType =
  | "medicine"
  | "symptom"
  | "report"
  | "voice";

export type HealthHistoryRecord = {
  id: string;
  userId: string;
  type: HealthHistoryType;
  title: string;
  summary: string;
  createdAt: unknown;

  metadata?: {
    medicineName?: string;
    genericName?: string;
    symptoms?: string[];
    reportName?: string;
    question?: string;
    urgency?: string;
    confidence?: number;
  };
};