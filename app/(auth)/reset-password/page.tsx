import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import loginImage from "@/public/auth/login.png";

export default function page() {
  return (
    <AuthLayout
      title="Reset your password"
      image={loginImage}
      description="Enter your new password below to regain access to your account."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
