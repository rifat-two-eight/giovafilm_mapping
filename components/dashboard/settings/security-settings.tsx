"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function SecuritySettings() {
  const { t } = useLanguage();

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("settings_admin.security")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start">
          {t("settings_admin.change_password")}
        </Button>

        <Button variant="outline" className="w-full justify-start">
          {t("settings_admin.enable_2fa")}
        </Button>
      </CardContent>
    </Card>
  );
}
