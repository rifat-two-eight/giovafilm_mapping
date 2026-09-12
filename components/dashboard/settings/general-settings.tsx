"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = {
  workspaceName: string;
  companyName: string;
  email: string;
  timezone: string;
  language: string;
};

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function GeneralSettings() {
  const { t } = useLanguage();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      workspaceName: "My Travel Maps",
      companyName: "Travel Co.",
      email: "admin@example.com",
      timezone: "",
      language: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("settings_admin.general_title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("settings_admin.workspace_name")}</Label>
            <Input className="text-base! py-5" {...register("workspaceName")} />
          </div>

          <div className="space-y-2">
            <Label>{t("settings_admin.company_name")}</Label>
            <Input className="text-base! py-5" {...register("companyName")} />
          </div>

          <div className="space-y-2">
            <Label>{t("settings_admin.email_address")}</Label>
            <Input
              className="text-base! py-5"
              type="email"
              {...register("email")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("settings_admin.timezone")}</Label>
              <Input
                className="text-base! py-5"
                placeholder={t("settings_admin.select_timezone")}
                {...register("timezone")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("settings_admin.language")}</Label>
              <Input
                className="text-base! py-5"
                placeholder={t("settings_admin.select_language")}
                {...register("language")}
              />
            </div>
          </div>

          <Button type="submit" className="mt-2">
            {t("settings_admin.save_settings")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
