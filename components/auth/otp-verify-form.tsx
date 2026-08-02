"use client";

import {
  useResendOtpMutation,
  useVerifyAccountMutation,
} from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Lock } from "lucide-react";
import { decodeJwtPayload } from "@/lib/utils";

type AuthFlow = "createAccount" | "resetPassword" | "invite";

export default function OtpVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otpFromQuery = searchParams.get("otp") || "";

  const authFlow: AuthFlow = useMemo(() => {
    const raw = (searchParams.get("authType") || "").trim();
    if (raw === "resetPassword" || raw === "invite" || raw === "createAccount") {
      return raw;
    }
    return "createAccount";
  }, [searchParams]);

  const showPasswordFields = authFlow === "invite";
  const resendAuthType =
    authFlow === "resetPassword" ? "resetPassword" : "createAccount";

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

  // Prefill OTP from email deep-link when present
  useEffect(() => {
    if (!otpFromQuery) return;
    const digits = otpFromQuery.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 6) {
      setOtp([...digits, ...Array(6 - digits.length)].slice(0, 6));
    }
  }, [otpFromQuery]);

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

  const redirectAfterLogin = (accessToken: string, role?: string) => {
    let userRole = role;
    if (!userRole) {
      const decoded = decodeJwtPayload(accessToken);
      userRole = decoded?.role;
    }

    if (userRole === "user") {
      router.push("/profile/contributions-reviews");
    } else {
      router.push("/dashboard");
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (showPasswordFields) {
      if (!password || !confirmPassword) {
        toast.error("Please set your password to accept the invitation");
        return;
      }
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
      const requestData: {
        email: string;
        oneTimeCode: string;
        password?: string;
      } = {
        email,
        oneTimeCode: otpCode,
      };
      if (showPasswordFields) {
        requestData.password = password;
      }

      const response = await verifyAccount(requestData).unwrap();

      if (!response.success) {
        toast.error(
          response.message || "Verification failed. Please try again.",
          { id: toastId },
        );
        return;
      }

      const userData = response.data;

      // Password setup / reset step (invite without password, or forgot-password)
      if (userData?.token && !userData?.accessToken) {
        toast.success(
          authFlow === "resetPassword"
            ? "OTP verified! Please reset your password."
            : "OTP verified! Please set your password.",
          { id: toastId },
        );
        router.push(`/reset-password?token=${userData.token}`);
        return;
      }

      if (userData?.accessToken) {
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

        document.cookie = `accessToken=${userData.accessToken}; path=/; max-age=${60 * 60 * 24 * 10}; SameSite=Lax`;

        toast.success(
          authFlow === "resetPassword"
            ? "Verified successfully!"
            : "Account verified successfully!",
          {
            id: toastId,
            description:
              authFlow === "createAccount"
                ? "Your account is now active."
                : undefined,
          },
        );

        redirectAfterLogin(userData.accessToken, userData?.user?.role || userData?.role);
        return;
      }

      toast.error("Verification succeeded but no next step was returned.", {
        id: toastId,
      });
    } catch (err: any) {
      console.error("Verification error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        "Verification failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleResend = async () => {
    const toastId = toast.loading("Resending OTP...");

    try {
      const response = await resendOtp({
        email,
        authType: resendAuthType,
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

  const title =
    authFlow === "resetPassword"
      ? "Reset Password"
      : authFlow === "invite"
        ? "Accept Invitation"
        : "Verify Your Account";

  const subtitle =
    authFlow === "resetPassword"
      ? "Enter the code we sent you, then you'll set a new password."
      : authFlow === "invite"
        ? "Enter the invitation code and set your password to join."
        : "Enter the verification code we sent to complete registration.";

  const buttonLabel =
    authFlow === "invite"
      ? "Verify & Set Password"
      : authFlow === "resetPassword"
        ? "Verify Code"
        : "Verify Account";

  return (
    <div className="flex flex-col justify-center">
      <div className="mb-8 text-left">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">{title}</h2>
        <p className="text-sm text-[#757575]">
          We've sent a code to{" "}
          <span className="font-semibold text-[#1A1A1A] break-all">
            {email || "your email"}
          </span>
          .
          <br className="hidden md:block" /> {subtitle}
        </p>
      </div>

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

      {showPasswordFields && (
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
      )}

      <Button
        onClick={handleVerify}
        disabled={!isOtpComplete || isLoading}
        className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20 mb-4"
      >
        {isLoading ? "Verifying..." : buttonLabel}
      </Button>

      {countdown > 0 ? (
        <p className="text-sm text-[#757575] text-center">
          Resend code in {countdown}s
        </p>
      ) : (
        <div className="text-center">
          <p className="text-sm text-[#757575] mb-2">Didn't receive the code?</p>
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
