import type { DashboardStat } from "@/types/dashboard";
import { dashboardStats } from "@/data/dashboardData";

export async function getDashboardStats(): Promise<DashboardStat[]> {
  return dashboardStats;
}