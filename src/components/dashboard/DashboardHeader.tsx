"use client";

import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function DashboardHeader() {
  const { user } = useAuth();

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 17
        ? "Good Afternoon"
        : "Good Evening";
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  // Fall back gracefully while auth is still resolving or if a name
  // isn't set (e.g. email/password signup without a display name).
  const displayName = user?.displayName?.trim().split(" ")[0] || "there";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 p-6 text-white shadow-[0_20px_55px_rgba(2,132,199,.2)] sm:p-8">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-12 size-52 rounded-full bg-white/15 blur-3xl"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          {user?.photoURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName ?? "Profile photo"}
              className="mt-1 size-12 shrink-0 rounded-full border-2 border-white/40 object-cover shadow-lg sm:size-14"
            />
          )}
          <div>
            <p className="text-sm font-medium text-sky-100">{today}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-.05em] sm:text-4xl">
              {greeting}, {displayName}.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-sky-100">
              Your health space is up to date. What would you like to understand today?
            </p>
          </div>
        </div>
        <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-sky-700 shadow-lg">
          <Plus className="size-4" /> Add health record
        </button>
      </div>
    </section>
  );
}
