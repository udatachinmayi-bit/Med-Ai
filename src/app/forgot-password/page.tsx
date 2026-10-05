"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import AuthCard from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import InputField from "@/components/auth/InputField";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    setError("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
      toast.success("Password reset link sent successfully.");
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  }

  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f8fcff] px-5 py-12"><Toaster position="top-center" /><div aria-hidden="true" className="absolute -left-24 -top-24 size-96 rounded-full bg-sky-200/50 blur-3xl" /><div aria-hidden="true" className="absolute -bottom-32 -right-24 size-[30rem] rounded-full bg-cyan-200/40 blur-3xl" /><Link className="absolute left-5 top-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800" href="/login"><ArrowLeft className="size-4" /> Back to login</Link><motion.div initial={{ opacity: 0, scale: .96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-md"><AuthCard>{sent ? <div className="py-5 text-center"><motion.span initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid size-16 place-items-center rounded-3xl bg-emerald-50 text-emerald-500"><CheckCircle2 className="size-9" /></motion.span><h1 className="mt-6 text-3xl font-bold tracking-[-.05em] text-slate-950">Check your inbox</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">If an account exists for <strong className="text-slate-800">{email}</strong>, you will receive a secure reset link shortly.</p><Link className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(2,132,199,.24)]" href="/login">Return to sign in <ArrowLeft className="size-4" /></Link></div> : <><span className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-sky-600"><Mail className="size-6" /></span><div className="mt-6"><AuthHeader title="Reset your password" description="Enter your account email and we will send reset instructions." /></div><form className="mt-7 space-y-5" noValidate onSubmit={submit}><InputField error={error || undefined} id="reset-email" label="Email" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" value={email} disabled={loading} /><button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(2,132,199,.24)] transition hover:-translate-y-0.5 disabled:opacity-60" disabled={loading} type="submit">{loading ? <><LoaderCircle className="size-4 animate-spin" />Sending link…</> : "Send reset link"}</button></form></>}</AuthCard></motion.div></main>;
}
