"use client";

import { Loader, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormValues = {
  email: string;
};

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();

  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const onSubmit = async (data: FormValues) => {
    // console.log("Reset email sent to:", data.email);
    try {
      const res = await forgetPassword({ email: data?.email });

      if (res?.data?.success) {
        // ✅ Show success toast
        toast.success(res.data.message || "Reset OTP sent successfully!");

        // ✅ Redirect to OTP page (optionally pass email)
        router.push(`/otp-verify?email=${data.email}`);
      }
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-[#757575]">
          Enter your email and we’ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20"
        >
          {isLoading ? <Loader /> : "Send Reset Link"}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-sm text-center mt-6">
        <span className="text-[#0A0A0A]">Remember your password? </span>
        <Link
          href="/login"
          className="text-base font-semibold text-primary font-public-sans hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};
