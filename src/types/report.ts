export type Report = {
  id: number;
  name: string;
  status: "Reviewed" | "Pending";
};

export type ReportTestResult = {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low" | "critical" | "unknown";
  explanation: string;
};

export type ReportPatient = {
  name: string;
  age: string;
  gender: string;
  reportDate: string;
  labName: string;
};

export type ReportAnalysis = {
  reportType: string;

  patient: ReportPatient;

  summary: string;

  keyFindings: string[];

  normalResults: ReportTestResult[];

  abnormalResults: ReportTestResult[];

  allResults: ReportTestResult[];

  possibleInterpretations: string[];

  recommendations: string[];

  questionsForDoctor: string[];

  healthScore: number;

  urgency:
    | "routine"
    | "attention"
    | "urgent";

  urgencyReason: string;

  confidence: number;

  disclaimer: string;
};

export type ReportHistoryItem = {
  id: string;
  reportType?: string;
  fileName?: string;
  analysis: ReportAnalysis;
  createdAt?: unknown;
};

export type SavedReport = {
  id: string;
  reportType: string;
  patient: ReportPatient;
  healthScore: number;
  summary: string;
  confidence: number;
  ocrText: string;
  fileUrl: string;
  analysis: ReportAnalysis;
  createdAt?: Date | null;
};