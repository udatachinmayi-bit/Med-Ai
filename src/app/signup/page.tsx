import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return <AuthLayout title="Create your account" subtitle="Start your clearer healthcare journey today."><AuthCard><AuthHeader title="Create your account" description="Start your clearer healthcare journey today." /><SignupForm /><AuthFooter action="Sign in" href="/login" prompt="Already have an account?" /></AuthCard></AuthLayout>;
}
