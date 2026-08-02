"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/auth";
import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import SocialLogin from "./SocialLogin";
import LoadingButton from "./LoadingButton";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setErrors({});
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6" noValidate>
      <InputField id="login-email" label="Email Address" placeholder="Enter your email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} disabled={loading} />
      <PasswordInput id="login-password" label="Password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} disabled={loading} />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} disabled={loading} className="h-4 w-4 rounded border-slate-300" />Remember me</label>
        <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot Password?</Link>
      </div>
      {errors.form && <p role="alert" aria-live="polite" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{errors.form}</p>}
      <LoadingButton text="Login" loading={loading} />
      <SocialLogin disabled={loading} />
      <p className="text-center text-sm text-slate-500">Don&apos;t have an account?<Link href="/signup" className="ml-2 font-semibold text-blue-600">Create Account</Link></p>
    </form>
  );
}
