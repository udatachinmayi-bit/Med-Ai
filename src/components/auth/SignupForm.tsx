"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/auth";
import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import LoadingButton from "./LoadingButton";
import SocialLogin from "./SocialLogin";

export default function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string; form?: string }>({});

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Your name is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    if (!terms) nextErrors.terms = "Please accept the terms to continue.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setErrors({});
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      router.replace("/dashboard");
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-7 space-y-4" noValidate onSubmit={handleSignup}>
      <InputField id="signup-name" label="Full name" onChange={(event) => setName(event.target.value)} placeholder="Your name" value={name} error={errors.name} disabled={loading} />
      <InputField id="signup-email" label="Email" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" value={email} error={errors.email} disabled={loading} />
      <PasswordInput id="signup-password" label="Password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} disabled={loading} />
      <PasswordInput id="signup-confirm-password" label="Confirm password" placeholder="Confirm your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} error={errors.confirmPassword} disabled={loading} />
      <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-slate-600"><input checked={terms} className="mt-0.5 size-4 rounded border-sky-200 text-sky-600 focus:ring-sky-500" disabled={loading} onChange={(event) => setTerms(event.target.checked)} type="checkbox" />I agree to the Terms of Service and Privacy Policy.</label>
      {errors.terms && <p role="alert" className="text-xs font-medium text-rose-600">{errors.terms}</p>}
      {errors.form && <p role="alert" aria-live="polite" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{errors.form}</p>}
      <LoadingButton text="Create account" loading={loading} />
      <SocialLogin disabled={loading} />
    </form>
  );
}
