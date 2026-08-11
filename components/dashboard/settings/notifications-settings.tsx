"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function NotificationSettings() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleToggle = async (key: string, checked: boolean) => {
    try {
      const updatedSettings = {
        pushNotification: profile?.settings?.pushNotification ?? true,
        emailNotification: profile?.settings?.emailNotification ?? true,
        locationService: profile?.settings?.locationService ?? true,
        profileStatus: profile?.settings?.profileStatus ?? "public",
        weeklyReports: profile?.settings?.weeklyReports ?? true,
        [key]: checked,
      };

      await updateProfile({ settings: updatedSettings }).unwrap();
      toast.success("Notification settings updated successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to update settings"
      );
      console.error("Failed to update notification settings:", error);
    }
  };

  if (isProfileLoading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  const emailNotification = profile?.settings?.emailNotification ?? true;
  const pushNotification = profile?.settings?.pushNotification ?? true;
  const weeklyReports = profile?.settings?.weeklyReports ?? true;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive email updates about your maps and places
            </p>
          </div>
          <Switch
            checked={emailNotification}
            onCheckedChange={(checked) => handleToggle("emailNotification", checked)}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-muted-foreground">
              Get instant notifications in your browser
            </p>
          </div>
          <Switch
            checked={pushNotification}
            onCheckedChange={(checked) => handleToggle("pushNotification", checked)}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Weekly Reports</p>
            <p className="text-sm text-muted-foreground">
              Receive weekly summary of activity and stats
            </p>
          </div>
          <Switch
            checked={weeklyReports}
            onCheckedChange={(checked) => handleToggle("weeklyReports", checked)}
            disabled={isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  );
}
