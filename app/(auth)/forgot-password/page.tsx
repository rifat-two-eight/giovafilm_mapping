import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import forgotPasswordImage from "@/public/auth/login.png";

export default function page() {
  return (
    <AuthLayout
      titleKey="auth.layout_forgot_title"
      descriptionKey="auth.layout_forgot_desc"
      image={forgotPasswordImage}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
