"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/auth";

interface SocialLoginProps { googleText?: string; githubText?: string; disabled?: boolean; }

export default function SocialLogin({ googleText = "Continue with Google", githubText = "Continue with GitHub", disabled = false }: SocialLoginProps) {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      // Navigates the browser to Google; on success the user is sent
      // back here and AuthContext's redirect handler takes over routing.
      await googleLogin();
    } catch (authError) {
      console.error("Google sign-in failed:", authError);
      setError(getAuthErrorMessage(authError));
      setLoading(false);
    }
  }

  return <div className="space-y-4"><div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-slate-500">OR</span></div></div><button type="button" disabled={disabled || loading} onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">{loading ? <LoaderCircle className="size-5 animate-spin text-sky-600" /> : <FcGoogle size={24} />}<span>{googleText}</span></button><button type="button" className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-lg"><FaGithub size={22} /><span>{githubText}</span></button>{error && <p role="alert" aria-live="polite" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}</div>;
}
