import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import registerImg from "@/public/auth/register.png";

export default function page() {
  return (
    <AuthLayout
      titleKey="auth.layout_register_title"
      descriptionKey="auth.layout_register_desc"
      image={registerImg}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
