import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/Login-form";
import loginImage from "@/public/auth/login.png";

export default function page() {
  return (
    <AuthLayout
      titleKey="auth.layout_login_title"
      descriptionKey="auth.layout_login_desc"
      image={loginImage}
    >
      <LoginForm />
    </AuthLayout>
  );
}
