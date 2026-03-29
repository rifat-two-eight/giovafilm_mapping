import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import forgotPasswordImage from "@/public/auth/login.png";

export default function page() {
  return (
    <div>
      <AuthLayout
        title="Get Back on Track to Your Next Adventure."
        description="Reset your password and continue exploring scenic routes, hidden gems, and unforgettable journeys waiting ahead."
        image={forgotPasswordImage}
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </div>
  );
}
