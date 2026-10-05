"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";

import {
  dashboardStats as initialStats,
  quickActions as initialActions,
  healthTools as initialTools,
  recentReports as initialReports,
  recentActivity as initialActivity,
  appointments as initialAppointments,
  notifications as initialNotifications,
} from "@/data/dashboardData";

import {
  getAppointments,
  getDashboardStats,
  getHealthTools,
  getNotifications,
  getQuickActions,
  getRecentActivity,
  getRecentReports,
} from "@/services/dashboardService";

import type { ActivityItem } from "@/types/activity";
import type { Appointment } from "@/types/appointment";
import type {
  DashboardStat,
  HealthTool,
  QuickAction,
} from "@/types/dashboard";
import type { Notification } from "@/types/notification";
import type { Report } from "@/types/report";

interface DashboardContextType {
  stats: DashboardStat[];
  actions: QuickAction[];
  tools: HealthTool[];
  reports: Report[];
  activity: ActivityItem[];
  appointments: Appointment[];
  notifications: Notification[];
  isLoading: boolean;
  setStats: (stats: DashboardStat[]) => void;
  markAllNotificationsAsRead: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();

  const [stats, setStats] = useState(initialStats);
  const [actions, setActions] = useState(initialActions);
  const [tools, setTools] = useState(initialTools);
  const [reports, setReports] = useState(initialReports);
  const [activity, setActivity] = useState(initialActivity);
  const [appointments, setAppointments] =
    useState(initialAppointments);
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        setIsLoading(true);

        const [
          nextStats,
          nextActions,
          nextTools,
          nextReports,
          nextActivity,
          nextAppointments,
          nextNotifications,
        ] = await Promise.all([
          getDashboardStats(user.uid),
          getQuickActions(),
          getHealthTools(),
          getRecentReports(),
          getRecentActivity(),
          getAppointments(),
          getNotifications(),
        ]);

        setStats(nextStats);
        setActions(nextActions);
        setTools(nextTools);
        setReports(nextReports);
        setActivity(nextActivity);
        setAppointments(nextAppointments);
        setNotifications(nextNotifications);
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [user, loading]);

  const value = useMemo(
    () => ({
      stats,
      actions,
      tools,
      reports,
      activity,
      appointments,
      notifications,
      isLoading,
      setStats,
      markAllNotificationsAsRead: () => {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            unread: false,
          }))
        );
      },
    }),
    [
      stats,
      actions,
      tools,
      reports,
      activity,
      appointments,
      notifications,
      isLoading,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
}