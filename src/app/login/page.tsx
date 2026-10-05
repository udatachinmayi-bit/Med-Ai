import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to your AI Medical Dashboard."
    >
      <AuthCard>
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}