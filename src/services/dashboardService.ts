import {
  appointments,
  dashboardStats,
  healthTools,
  notifications,
  quickActions,
  recentActivity,
  recentReports,
} from "@/data/dashboardData";

export function getDashboardStats() {
  return Promise.resolve(dashboardStats);
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
