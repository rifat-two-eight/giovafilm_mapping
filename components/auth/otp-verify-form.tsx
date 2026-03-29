"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function OtpVerify() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Verifying OTP:", otp.join(""));
    setIsLoading(false);
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setCountdown(60);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every(Boolean);

  return (
    <div className="flex flex-col justify-center">
      {/* Header (same as login style) */}
      <div className="mb-8 text-left">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Two-Step Verification
        </h2>
        <p className="text-sm text-[#757575]">
          We've sent a verification code to your{" "}
          <br className="hidden md:block" /> email/phone. Please enter it below.
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
            className="font-semibold text-primary hover:underline"
          >
            Resend Code
          </button>
        </div>
      )}
    </div>
  );
}
