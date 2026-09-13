"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isInvite = searchParams.get("flow") === "invite";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast.error(t("auth.invalid_reset_token"));
      return;
    }

    const toastId = toast.loading(
      isInvite ? "Setting your password..." : "Resetting password...",
    );

    try {
      const response = await resetPassword({
        token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      if (response.success) {
        toast.success(
          response.message ||
            (isInvite
              ? "Password set successfully! You can log in now."
              : "Password reset successfully!"),
          { id: toastId },
        );
        router.push("/login");
      } else {
        toast.error(
          response.message ||
            (isInvite
              ? "Failed to set password."
              : "Failed to reset password."),
          { id: toastId },
        );
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err), { id: toastId });
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          {isInvite ? t("auth.set_password_heading") : t("auth.reset_password_heading")}
        </h2>
        <p className="text-sm text-[#757575]">
          {isInvite
            ? t("auth.set_password_subtitle")
            : t("auth.reset_password_subtitle")}
        </p>
      </div>

      {isInvite && (
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-[#757575]">
            1
          </span>
          <span className="text-[#9E9E9E]">{t("auth.verify_code_step")}</span>
          <span className="text-[#BDBDBD] mx-1">—</span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFC107] text-black">
            2
          </span>
          <span className="text-[#1A1A1A]">{t("auth.set_password_step")}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            {isInvite ? t("auth.password") : t("auth.new_password")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
          <p className="text-xs text-[#9E9E9E] ml-1">{t("auth.at_least_8_chars")}</p>
          {errors.password && (
            <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#424242] ml-1">
            {t("auth.confirm_password")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="w-full pl-12 pr-4 py-6 bg-gray-100/80 border border-[#E0E0E0] rounded-lg focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:border-transparent transition-all shadow-none"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 ml-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isInvite ? t("auth.setting_password_btn") : t("auth.resetting_password_btn")}
            </>
          ) : isInvite ? (
            t("auth.set_password_btn")
          ) : (
            t("auth.reset_password_btn")
          )}
        </Button>
      </form>

      <div className="text-sm text-center mt-6">
        <Link
          href="/login"
          className="text-base font-semibold text-primary font-public-sans cursor-pointer hover:underline"
        >
          {t("auth.back_to_login_btn")}
        </Link>
      </div>
    </div>
  );
};
