export type SymptomSeverity =
  | "mild"
  | "moderate"
  | "severe";

export type SymptomUrgency =
  | "routine"
  | "soon"
  | "urgent"
  | "emergency";

export type PossibleCause = {
  name: string;
  likelihood: "possible" | "common" | "less-likely";
  explanation: string;
};

export type SymptomAnalysis = {
  summary: string;

  possibleCauses: PossibleCause[];

  urgency: SymptomUrgency;

  urgencyReason: string;

  recommendedActions: string[];

  emergencySigns: string[];

  questionsForDoctor: string[];

  selfCare: string[];

  thingsToMonitor: string[];

  confidence: number;

  disclaimer: string;
};

export type SymptomInput = {
  symptoms: string[];
  description: string;
  duration: string;
  severity: SymptomSeverity;
  age: string;
  gender: string;
  existingConditions: string;
  currentMedicines: string;
};