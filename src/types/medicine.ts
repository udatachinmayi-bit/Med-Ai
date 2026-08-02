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
