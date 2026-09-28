import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password" description="Enter your email address and we will send you a reset link.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
