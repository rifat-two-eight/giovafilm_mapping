"use client";

import {
  useResendOtpMutation,
  useVerifyAccountMutation,
} from "@/redux/features/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function OtpVerify() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";
  const authType = searchParams.get("authType") ?? "verifyAccount";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyAccount, { isLoading: isVerifying }] =
    useVerifyAccountMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const newOtp = [...otp];
    pasted
      .slice(0, 6 - index)
      .split("")
      .forEach((v, i) => (newOtp[index + i] = v));

    setOtp(newOtp);

    const nextIndex = Math.min(index + pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      value
        .slice(0, 6 - index)
        .split("")
        .forEach((v, i) => (newOtp[index + i] = v));

      setOtp(newOtp);
      inputRefs.current[Math.min(index + value.length, 5)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const oneTimeCode = otp.join("");
    try {
      await verifyAccount({ email, oneTimeCode }).unwrap();
      toast.success("Account verified successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Verification failed. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email, authType }).unwrap();
      toast.success("OTP resent! Please check your email.");
      setOtp(Array(6).fill(""));
      setCountdown(60);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to resend OTP. Try again.");
    }
  };

  const isComplete = otp.every(Boolean);
  const isLoading = isVerifying;

  return (
    <div className="flex flex-col justify-center">
      {/* Header (same as login style) */}
      <div className="mb-8 text-left">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Two-Step Verification
        </h2>
        <p className="text-sm text-[#757575]">
          We've sent a verification code to{" "}
          <span className="font-semibold text-[#1A1A1A] break-all">
            {email || "your email"}
          </span>
          .
          <br className="hidden md:block" /> Please enter it below.
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-between gap-3 mb-6">
        {otp.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            className="w-full h-14 text-center text-lg font-semibold bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all"
          />
        ))}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={!isComplete || isLoading}
        className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20 mb-4"
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      {/* Resend */}
      {countdown > 0 ? (
        <p className="text-sm text-[#757575] text-center">
          Resend code in {countdown}s
        </p>
      ) : (
        <div className="text-center">
          <p className="text-sm text-[#757575] mb-2">
            Didn’t receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      )}
    </div>
  );
}
