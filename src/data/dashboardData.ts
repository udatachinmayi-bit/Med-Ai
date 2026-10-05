import {
  Activity,
  CalendarDays,
  FileText,
  HeartPulse,
  Mic,
  Pill,
  ScanLine,
  Stethoscope,
  UserRound,
} from "lucide-react";

import {
  DashboardStat,
  QuickAction,
  HealthTool,
} from "@/types/dashboard";
import { Report } from "@/types/report";
import { ActivityItem } from "@/types/activity";
import { Appointment } from "@/types/appointment";
import { Notification } from "@/types/notification";

/* ===========================
   Dashboard Statistics
=========================== */

export const dashboardStats: DashboardStat[] = [
  {
    label: "Health Score",
    value: 92,
    suffix: "/100",
    trend: "+4 this month",
    icon: HeartPulse,
  },
  {
    label: "Reports Reviewed",
    value: 12,
    trend: "+3 this month",
    icon: FileText,
  },
  {
    label: "Medicine Scans",
    value: 28,
    trend: "+6 this month",
    icon: ScanLine,
  },
  {
    label: "Care Streak",
    value: 8,
    suffix: " Days",
    trend: "Keep Going",
    icon: Activity,
  },
];

/* ===========================
   Quick Actions
=========================== */

export const quickActions: QuickAction[] = [
  {
    label: "Scan Medicine",
    description: "Analyze any medicine instantly",
    href: "/dashboard/medicine-scanner",
    icon: Pill,
  },
  {
    label: "Upload Report",
    description: "Understand your reports",
    href: "/dashboard/report-analyzer",
    icon: FileText,
  },
  {
    label: "Check Symptoms",
    description: "Describe your symptoms",
    href: "/dashboard/symptom-checker",
    icon: Stethoscope,
  },
  {
    label: "Voice Assistant",
    description: "Talk with MedAI",
    href: "/dashboard/voice-assistant",
    icon: Mic,
  },
];

/* ===========================
   Health Tools
=========================== */

export const healthTools: HealthTool[] = [
  {
    title: "Medicine Scanner",
    description: "Understand medicines and prescriptions.",
    href: "/dashboard/medicine-scanner",
    icon: Pill,
    accent: "from-sky-500 to-cyan-500",
  },
  {
    title: "Report Analyzer",
    description: "AI powered medical report explanation.",
    href: "/dashboard/report-analyzer",
    icon: FileText,
    accent: "from-violet-500 to-indigo-500",
  },
  {
    title: "Symptom Checker",
    description: "Know possible conditions from symptoms.",
    href: "/dashboard/symptom-checker",
    icon: Stethoscope,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Voice Assistant",
    description: "Speak naturally with AI.",
    href: "/dashboard/voice-assistant",
    icon: Mic,
    accent: "from-pink-500 to-rose-500",
  },
  {
    title: "Health History",
    description: "Access previous reports and scans.",
    href: "/dashboard/history",
    icon: Activity,
    accent: "from-blue-500 to-indigo-500",
  },
  {
    title: "Profile",
    description: "Manage your medical profile.",
    href: "/dashboard/profile",
    icon: UserRound,
    accent: "from-orange-500 to-amber-500",
  },
];

/* ===========================
   Recent Reports
=========================== */

export const recentReports: Report[] = [
  {
    id: 1,
    name: "Complete Blood Count",
    status: "Reviewed",
  },
  {
    id: 2,
    name: "Thyroid Profile",
    status: "Reviewed",
  },
  {
    id: 3,
    name: "Vitamin D Test",
    status: "Pending",
  },
];

/* ===========================
   Recent Activity
=========================== */

export const recentActivity: ActivityItem[] = [
  {
    id: 1,
    title: "Medicine Scan Completed",
    time: "10 minutes ago",
  },
  {
    id: 2,
    title: "Blood Report Uploaded",
    time: "Yesterday",
  },
  {
    id: 3,
    title: "Voice Assistant Used",
    time: "2 days ago",
  },
];

/* ===========================
   Upcoming Appointments
=========================== */

export const appointments: Appointment[] = [
  {
    id: 1,
    doctor: "Dr. Sharma",
    date: "12 Aug 2026",
    time: "10:30 AM",
  },
];

/* ===========================
   Notifications
=========================== */

export const notifications: Notification[] = [
  {
    id: 1,
    title: "Blood Report Ready",
    unread: true,
  },
  {
    id: 2,
    title: "Medicine Scan Completed",
    unread: false,
  },
];