import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  value: number;
  suffix?: string;
  trend: string;
  icon: LucideIcon;
}

export interface DashboardData {
  stats: DashboardStat[];
  actions: QuickAction[];
  tools: HealthTool[];
}

export interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface HealthTool {
  title: string;
  description: string;
  href: string;
  accent: string;
  icon: LucideIcon;
}
