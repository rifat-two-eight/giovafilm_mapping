import { AuthLayout } from "@/components/auth/auth-layout";
import OtpVerify from "@/components/auth/otp-verify-form";
import otpVerifyImage from "@/public/auth/otp-verify.png";

export default function page() {
  return (
    <div>
      <AuthLayout
        title="Your next adventure starts with a single step."
        description="Secure your account and get back to planning the ultimate road trip across the most beautiful landscapes."
        image={otpVerifyImage}
      >
        <OtpVerify />
      </AuthLayout>
    </div>
  );
}
