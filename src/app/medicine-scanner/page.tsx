"use client";
import { MedicineScanner } from "@/components/medicine/MedicineScanner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
export default function MedicineScannerPage() { return <ProtectedRoute><main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/70 to-white p-5 sm:p-8"><div className="mx-auto max-w-7xl"><header className="mb-7"><p className="text-sm font-semibold text-sky-700">Medicine tools</p><h1 className="mt-1 text-3xl font-bold tracking-[-.05em] text-slate-950 sm:text-4xl">Medicine Scanner</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Scan a medicine label for a clear, structured summary. Always confirm use and dosage with a qualified clinician.</p></header><MedicineScanner /></div></main></ProtectedRoute>; }
