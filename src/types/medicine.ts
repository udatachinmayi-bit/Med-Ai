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
  ocrText: string;
  analysis: MedicineAnalysis;
  createdAt?: unknown;
  imageUrl?: string;
};