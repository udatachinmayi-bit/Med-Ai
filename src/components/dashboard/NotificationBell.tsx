"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, markAllNotificationsAsRead } = useDashboard();
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Notifications"
        onClick={() => setIsOpen((open) => !open)}
        className="relative grid size-10 place-items-center rounded-xl text-slate-600 hover:bg-sky-50"
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-sky-100 bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between px-1 pb-3">
            <p className="text-sm font-bold text-slate-950">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="space-y-1">
            {notifications.length ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-xl px-3 py-2.5 text-sm text-slate-700 ${
                    notification.unread ? "bg-sky-50" : "bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {notification.unread && <span className="size-1.5 rounded-full bg-cyan-500" />}
                    {notification.title}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-3 py-5 text-center text-sm text-slate-500">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
