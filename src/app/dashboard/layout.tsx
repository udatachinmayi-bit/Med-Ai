"use client";
import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardProvider } from "@/context/DashboardContext"; // ✅ imported
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute><DashboardProvider> {/* ✅ wrap everything */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/70 to-white lg:flex">
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
        />
        <div className="min-w-0 flex-1">
          <DashboardNavbar
            onMenu={() => setOpen(true)}
          />
          <main className="mx-auto max-w-7xl p-5 sm:p-7">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider></ProtectedRoute>
  );
}
