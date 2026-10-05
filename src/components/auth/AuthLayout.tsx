"use client";

import { ReactNode } from "react";
import BackgroundPattern from "./BackgroundPattern";

interface Props {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden">

      <BackgroundPattern />

      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">

        {/* LEFT */}

        <section className="hidden lg:flex flex-col justify-center px-16">

          <span className="mb-5 inline-flex w-fit rounded-full bg-blue-100 px-4 py-2 text-blue-700 font-semibold">
            🩺 AI Medical Assistant
          </span>

          <h1 className="text-6xl font-black leading-tight text-slate-900">
            Smarter
            <br />
            Healthcare
            <br />
            Powered by AI
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-slate-600">
            Scan medicines, analyze blood reports,
            understand symptoms,
            and get AI-powered healthcare guidance —
            all from one intelligent platform.
          </p>

          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-green-500" />

              <p>Medicine Scanner</p>

            </div>

            <div className="flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-blue-500" />

              <p>Medical Report Analysis</p>

            </div>

            <div className="flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-purple-500" />

              <p>Voice Assistant</p>

            </div>

            <div className="flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-pink-500" />

              <p>AI Symptom Checker</p>

            </div>

          </div>

        </section>

        {/* RIGHT */}

        <section className="flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-md">

            <h2 className="text-center text-4xl font-bold">
              {title}
            </h2>

            <p className="mt-3 text-center text-slate-500">
              {subtitle}
            </p>

            <div className="mt-10">

              {children}

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}