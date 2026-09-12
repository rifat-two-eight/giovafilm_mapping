import { AuthLayout } from "@/components/auth/auth-layout";
import OtpVerify from "@/components/auth/otp-verify-form";
import otpVerifyImage from "@/public/auth/otp-verify.png";

export default function page() {
  return (
    <AuthLayout
      titleKey="auth.layout_otp_title"
      descriptionKey="auth.layout_otp_desc"
      image={otpVerifyImage}
    >
      <OtpVerify />
    </AuthLayout>
  );
}
