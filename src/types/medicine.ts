export type Medicine = {
  name: string;
  brandName: string;
  genericName: string;
  prescriptionRequired: boolean;
  type: string;
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
};

export type MedicineAnalysis = {
  medicineName: string;
  genericName: string;
  strength: string;

  usedFor: string[];

  ageGuidance: {
    adults: string;
    children: string;
    elderly: string;
  };

  howToTake: {
    timing: string;
    food: string;
    frequency: string;
  };

  expiryDate: string;

  sideEffects: string[];

  warnings: string[];

  benefits: string[];

  safetyIndicator: {
    status:
      | "Safe when used as directed"
      | "Use Carefully"
      | "Consult Doctor";

    color:
      | "green"
      | "yellow"
      | "red";

    reason: string;
  };

  confidence: number;

  medicalDisclaimer: string;
};

export type MedicineReminder = {
  id: string;
  medicineName: string;
  time: string;
  frequency: string;
};

export type MedicineScan = {
  id: string;
  medicineName?: string;
  brand?: string;
  ocrText: string;
  analysis: MedicineAnalysis;
  safetyIndicator: MedicineAnalysis["safetyIndicator"];
  confidence: number;
  createdAt?: Date | null;
  imageUrl?: string;
};