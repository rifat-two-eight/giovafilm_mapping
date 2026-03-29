import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/Login-form";
import loginImage from "@/public/auth/login.png";

export default function page() {
  return (
    <AuthLayout
      title="Your next adventure starts here."
      image={loginImage}
      description="Join thousands of travelers planning the road trip of their
dreams. Explore new routes, discover hidden gems, and
share your journey."
    >
      <LoginForm />
    </AuthLayout>
  );
}
