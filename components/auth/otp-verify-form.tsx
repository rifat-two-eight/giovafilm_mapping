"use client";

import {
  useResendOtpMutation,
  useVerifyAccountMutation,
} from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Lock } from "lucide-react";
import { decodeJwtPayload } from "@/lib/utils";

export default function OtpVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const authType = searchParams.get("authType") || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyAccount, { isLoading: isVerifying }] =
    useVerifyAccountMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!email) {
      toast.error("No email provided");
      router.push("/login");
    }
  }, [email, router]);

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
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // Check if we have password fields (single-step flow)
    const includePassword = password.length > 0;
    if (includePassword) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
    }

    const toastId = toast.loading("Verifying OTP...");

    try {
      const requestData: any = {
        email: email,
        oneTimeCode: otpCode,
      };
      if (includePassword) {
        requestData.password = password;
      }

      const response = await verifyAccount(requestData).unwrap();

      if (response.success) {
        const userData = response.data;

        // Check if we need to set password (multi-step flow)
        if (userData?.needPassword && userData?.token) {
          toast.success("OTP verified successfully! Please set your password.", {
            id: toastId,
          });
          setTimeout(() => {
            router.push(`/reset-password?token=${userData.token}`);
          }, 1000);
          return;
        }

        // Single-step flow - logged in directly
        if (userData?.accessToken) {
          // Robustly get user data
          let currentUser = userData.user;

          if (!currentUser) {
            const decoded = decodeJwtPayload(userData.accessToken);
            currentUser = {
              id: decoded?.authId ?? "",
              name: decoded?.name ?? "",
              email: decoded?.email ?? "",
              role: decoded?.role ?? "user",
              image: "",
            };
          }

          dispatch(
            setUser({
              user: currentUser,
              accessToken: userData.accessToken,
            }),
          );

          // Set accessToken in cookies
          document.cookie = `accessToken=${userData.accessToken}; path=/; max-age=${60 * 60 * 24 * 10}; SameSite=Lax`;

          toast.success("Account verified successfully!", {
            id: toastId,
            description: "Your account is now active.",
          });

          // Robustly get user role
          let userRole = userData?.user?.role;
          if (!userRole && userData?.accessToken) {
            const decoded = decodeJwtPayload(userData.accessToken);
            userRole = decoded?.role;
          }

          if (userRole === "user") {
            router.push("/profile/contributions-reviews");
          } else {
            router.push("/dashboard");
          }
        }
      } else {
        const errorMessage =
          response.message || "Verification failed. Please try again.";
        toast.error(errorMessage, { id: toastId });
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      const errorMessage =
        err?.data?.message || err?.data?.error || "Verification failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleResend = async () => {
    const toastId = toast.loading("Resending OTP...");

    try {
      const response = await resendOtp({
        email: email,
        authType: "createAccount",
      }).unwrap();

      if (response.success) {
        toast.success("OTP resent successfully!", {
          id: toastId,
          description: "Please check your email.",
        });

        setOtp(Array(6).fill(""));
        setPassword("");
        setConfirmPassword("");
        setCountdown(60);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.message || "Failed to resend OTP", {
          id: toastId,
        });
      }
    } catch (err: any) {
      console.error("Resend failed:", err);

      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to resend OTP. Please try again.";

      toast.error(errorMessage, { id: toastId });
    }
  };

  const isOtpComplete = otp.every(Boolean);
  const isLoading = isVerifying;

  return (
    <div className="flex flex-col justify-center">
      {/* Header */}
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
          <br className="hidden md:block" /> Please enter it below and set your password.
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

      {/* Password Fields (Single-step flow option) */}
      <div className="space-y-5 mb-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            Set Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={!isOtpComplete || isLoading}
        className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20 mb-4"
      >
        {isLoading ? "Verifying..." : "Verify & Set Password"}
      </Button>

      {/* Resend */}
      {countdown > 0 ? (
        <p className="text-sm text-[#757575] text-center">
          Resend code in {countdown}s
        </p>
      ) : (
        <div className="text-center">
          <p className="text-sm text-[#757575] mb-2">
            Didn't receive the code?
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
