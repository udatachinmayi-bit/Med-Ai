export interface Report {
  id: number;
  name: string;
  status: "Reviewed" | "Pending";
}

export type HealthLevel = "Healthy" | "Needs Attention" | "Critical";
export interface ReportAnalysis {
  patient: { name: string; age: string; gender: string };
  report: { type: string; date: string; laboratory: string };
  healthScore: number;
  overallStatus: { level: HealthLevel; color: "green" | "yellow" | "red"; reason: string };
  tests: { name: string; value: string; unit: string; normalRange: string; status: "High" | "Low" | "Normal"; reason: string; clinicalSignificance: string }[];
  detectedProblems: string[]; possibleCauses: string[]; possibleConditions: string[]; symptoms: string[]; recommendations: string[];
  foods: { recommended: string[]; avoid: string[] }; exercise: string[]; lifestyle: string[];
  medicationInformation: { name: string; note: string }[]; doctorConsultationRequired: boolean; emergencyWarning: string; followUpTests: string[]; summary: string;
  confidence: { ocr: number; analysis: number }; medicalDisclaimer: string;
}
export interface SavedReport { id: string; reportType: string; patient: ReportAnalysis["patient"]; healthScore: number; overallStatus: ReportAnalysis["overallStatus"]; tests: ReportAnalysis["tests"]; summary: string; confidence: ReportAnalysis["confidence"]; ocrText: string; fileUrl: string; analysis: ReportAnalysis; createdAt: Date | null; }
