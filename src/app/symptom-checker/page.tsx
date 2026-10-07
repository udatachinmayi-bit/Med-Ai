"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SymptomChecker } from "@/components/symptom/SymptomChecker";

export default function SymptomCheckerPage() {
  return (
    <ProtectedRoute>
      <SymptomChecker />
    </ProtectedRoute>
  );
}