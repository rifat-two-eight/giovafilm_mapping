"use client";

import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import SocialLogin from "../shared/social-login/social-login";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

// Decode a JWT payload (client-side only, no verification)
function decodeJwtPayload(token: string) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      }).unwrap();

      // Extract tokens from API response
      const { accessToken } = res.data;

      // Decode JWT to get user info
      const decoded = decodeJwtPayload(accessToken);

      // Dispatch to Redux → persists to localStorage + cookies
      dispatch(
        setUser({
          user: {
            id: decoded?.authId ?? "",
            name: decoded?.name ?? "",
            email: decoded?.email ?? "",
            role: decoded?.role ?? "user",
            image: "",
          },
          accessToken,
        }),
      );

      toast.success(res.message || "Logged in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {/* Welcome Text */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Welcome Back</h2>
        <p className="text-sm text-[#757575]">
          Sign in to access your road trip plans and community.
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
              {...register("email", { required: true })}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: true })}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 accent-[#FFC107] rounded"
            />
            <span className="text-sm text-[#757575]">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-semibold text-primary font-public-sans cursor-pointer hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20 disabled:opacity-70"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Divider */}
      <div className="w-full flex items-center my-8">
        <div className="flex-1 h-px bg-[#EEEEEE]"></div>
        <span className="px-4 text-[10px] font-medium text-[#9E9E9E] uppercase tracking-wider">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-[#EEEEEE]"></div>
      </div>

      {/* Social Login */}
      <SocialLogin />

      {/* Footer */}
      <div className="text-sm text-center mt-6">
        <span className="text-[#0A0A0A]">Don't have an account? </span>
        <Link
          href="/register"
          className="text-base font-semibold text-primary font-public-sans cursor-pointer hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};
