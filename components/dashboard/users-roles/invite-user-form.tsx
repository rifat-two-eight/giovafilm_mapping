"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInviteUserMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FormData {
  email: string;
  role: string;
}

export function InviteUserForm(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    role: "user",
  });

  const [inviteUser, { isLoading }] = useInviteUserMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.role) {
      toast.error("Please provide both email and role.");
      return;
    }

    try {
      await inviteUser(formData).unwrap();
      toast.success("Invitation sent successfully!");
      setFormData({ email: "", role: "user" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send invitation");
    }
  };

  const handleCancel = () => {
    setFormData({ email: "", role: "user" });
  };

  return (
    <Card className="p-6 bg-white border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Invite New User</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        {/* Role Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            disabled={isLoading}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button 
          onClick={handleCancel} 
          variant="outline" 
          className="px-6" 
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-primary/80 hover:bg-primary text-black px-6 min-w-[140px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Invitation"
          )}
        </Button>
      </div>
    </Card>
  );
}
