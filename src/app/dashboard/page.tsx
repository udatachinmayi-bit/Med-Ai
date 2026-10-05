"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardWidgets />
    </div>
  );
}
