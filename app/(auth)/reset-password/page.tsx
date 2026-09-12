import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import loginImage from "@/public/auth/login.png";

export default function page() {
  return (
    <AuthLayout
      titleKey="auth.layout_reset_title"
      descriptionKey="auth.layout_reset_desc"
      image={loginImage}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
