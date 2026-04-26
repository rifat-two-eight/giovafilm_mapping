"use client";

import { Lock, Mail, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SocialLogin from "../shared/social-login/social-login";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export interface RegisterSuccessResponse {
  data: {
    email: string;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface RegisterErrorResponse {
  data: {
    message: string;
    success: boolean;
    errorMessages?: any[];
  };
  status: number;
}

export const RegisterForm = () => {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<FormValues>();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: FormValues) => {
    console.log("Form Data:", data);
    try {
      const res = await registerUser({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });

      if ("data" in res && res.data) {
        const successData = res.data as RegisterSuccessResponse;
        if (successData?.data?.email) {
          toast.success(successData.message || "User created successfully!");
          router.push(`/otp-verify?email=${successData.data.email}`);
        }
      } else if ("error" in res && res.error) {
        const errorData = res.error as RegisterErrorResponse;
        toast.error(errorData?.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {/* Header Text (same style as login) */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Create an account
        </h2>
        <p className="text-sm text-[#757575]">
          Welcome to the community! Join us and start your adventure.
        </p>
      </div>

      {/* Social Login */}
      <SocialLogin />

      {/* Divider */}
      <div className="w-full flex items-center my-8">
        <div className="flex-1 h-px bg-[#EEEEEE]"></div>
        <span className="px-4 text-[10px] font-medium text-[#9E9E9E] uppercase tracking-wider">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-[#EEEEEE]"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              placeholder="John Doe"
              {...register("fullName")}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
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
              {...register("password")}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-center gap-3 py-2">
          <Checkbox
            onCheckedChange={(checked) => setValue("terms", Boolean(checked))}
            className="w-5 h-5 border-[#E0E0E0] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <p className="text-sm text-[#757575]">
            I agree to the{" "}
            <Link
              href={"/terms-of-service"}
              className="font-semibold text-[#1A1A1A] cursor-pointer hover:underline"
            >
              Terms & Service
            </Link>{" "}
            and{" "}
            <Link
              href={"/privacy-policy"}
              className="font-semibold text-[#1A1A1A] cursor-pointer hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-sm text-center mt-6">
        <span className="text-[#0A0A0A]">Already have an account? </span>
        <Link
          href="/login"
          className="text-base font-semibold text-primary font-public-sans hover:underline"
        >
          LogIn
        </Link>
      </div>
    </div>
  );
};
