import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import registerImg from "@/public/auth/register.png";

export default function page() {
  return (
    <AuthLayout
      title="Start Your Journey
With Us Today."
      image={registerImg}
      description="Join over 50,000 travelers exploring the world's
most scenic routes and hidden gems."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
