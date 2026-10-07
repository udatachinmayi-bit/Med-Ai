"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { HealthHistory } from "@/components/history/HealthHistory";

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HealthHistory />
    </ProtectedRoute>
  );
}