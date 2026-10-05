import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  dashboardStats,
  quickActions,
  healthTools,
  recentReports,
  recentActivity,
  appointments,
  notifications,
} from "@/data/dashboardData";

const defaultDashboard = {
  healthScore: 92,
  reportsReviewed: 12,
  medicineScans: 28,
  careStreak: 8,
};

export async function getDashboardStats(uid: string) {
  const ref = doc(db, "users", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, defaultDashboard);

    return [
      {
        ...dashboardStats[0],
        value: defaultDashboard.healthScore,
      },
      {
        ...dashboardStats[1],
        value: defaultDashboard.reportsReviewed,
      },
      {
        ...dashboardStats[2],
        value: defaultDashboard.medicineScans,
      },
      {
        ...dashboardStats[3],
        value: defaultDashboard.careStreak,
      },
    ];
  }

  const data = snap.data();

  return [
    {
      ...dashboardStats[0],
      value: data.healthScore ?? 92,
    },
    {
      ...dashboardStats[1],
      value: data.reportsReviewed ?? 12,
    },
    {
      ...dashboardStats[2],
      value: data.medicineScans ?? 28,
    },
    {
      ...dashboardStats[3],
      value: data.careStreak ?? 8,
    },
  ];
}

export function getQuickActions() {
  return Promise.resolve(quickActions);
}

export function getHealthTools() {
  return Promise.resolve(healthTools);
}

export function getRecentReports() {
  return Promise.resolve(recentReports);
}

export function getRecentActivity() {
  return Promise.resolve(recentActivity);
}

export function getAppointments() {
  return Promise.resolve(appointments);
}

export function getNotifications() {
  return Promise.resolve(notifications);
}