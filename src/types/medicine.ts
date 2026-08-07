export type MedicineType = "Tablet" | "Capsule" | "Injection" | "Syrup" | "Cream";

export interface MedicineDetail {
  label: string;
  value: string;
}

export interface Medicine {
  name: string;
  brandName: string;
  genericName: string;
  prescriptionRequired: boolean;
  type: MedicineType;
  overview: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  storage: string;
  foodInteraction: string;
  alcoholInteraction: string;
  pregnancySafety: string;
  drivingSafety: string;
  alternatives: string[];
}

export interface MedicineAnalysis {
  medicineName: string;
  genericName: string;
  brand: string;
  category: string;
  prescriptionType: string;
  uses: string[];
  dosage: { adult: string; children: string; elderly: string; maximumDailyDose: string };
  ageRange: { recommended: string[]; notRecommended: string[] };
  sideEffects: { common: string[]; rare: string[] };
  warnings: { conditions: string[]; pregnancy: string; breastfeeding: string };
  drugInteractions: string[];
  foodInteractions: { avoid: string[]; recommended: string[] };
  storage: { temperature: string; keepAwayFrom: string[] };
  advantages: string[];
  disadvantages: string[];
  precautions: string[];
  missedDose: string;
  overdose: { symptoms: string[]; emergency: string };
  alternatives: string[];
  summary: string;
  safetyIndicator: { status: "Safe" | "Use Carefully" | "Consult Doctor"; color: "green" | "yellow" | "red"; reason: string };
  confidence: number;
  medicalDisclaimer: string;
}

export interface MedicineScan {
  id: string;
  imageUrl: string;
  medicineName: string;
  brand: string;
  safetyIndicator: MedicineAnalysis["safetyIndicator"];
  confidence: number;
  ocrText: string;
  analysis: MedicineAnalysis;
  createdAt: Date | null;
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  time: string;
  frequency: string;
  createdAt: Date | null;
}
