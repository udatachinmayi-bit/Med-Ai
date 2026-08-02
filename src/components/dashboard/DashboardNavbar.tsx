"use client";

import { useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { useAuth } from "@/context/AuthContext";

export function DashboardNavbar({
  onMenu,
}: {
  onMenu: () => void;
}) {
  const [dark, setDark] = useState(false);
  const { user } = useAuth();

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Member";

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-sky-100 bg-white/75 px-5 backdrop-blur-xl sm:px-7">
      <button
        onClick={onMenu}
        className="grid size-10 place-items-center rounded-xl text-slate-600 hover:bg-sky-50 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <DashboardSearch />

      <div className="ml-auto flex items-center gap-2">
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDark(!dark)}
          className="grid size-10 place-items-center rounded-xl text-slate-600 hover:bg-sky-50"
        >
          {dark ? (
            <Sun className="size-4.5" />
          ) : (
            <Moon className="size-4.5" />
          )}
        </button>

        <NotificationBell />

        <button className="flex items-center gap-3 rounded-xl p-1.5 pl-2 hover:bg-sky-50">
          <span className="hidden text-right text-xs sm:block">
            <span className="block font-bold text-slate-800">
              {displayName}
            </span>
            <span className="text-slate-500">Member</span>
          </span>

          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover border border-sky-100"
            />
          ) : (
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-bold text-white">
              {initials}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}