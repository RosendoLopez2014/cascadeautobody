"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/account/settings");
      return;
    }

    if (user) {
      setProfileData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.billing?.phone || "",
      });
    }
  }, [isAuthenticated, user, router]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);

    try {
      const response = await fetch("/api/account/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
          billing: {
            ...user?.billing,
            phone: profileData.phone,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setIsSavingPassword(true);

    try {
      // In a real app, you would call an API to change the password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Show success message (you could add a state for this)
      alert("Password updated successfully");
    } catch {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/account"
          className="flex items-center text-neutral-600 hover:text-primary mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Account
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900">Account Settings</h1>
        <p className="text-neutral-600 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-neutral-900">Profile Information</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
            {profileSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm text-green-700">Profile updated successfully</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstName: e.target.value })
                }
                required
              />
              <Input
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData({ ...profileData, lastName: e.target.value })
                }
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-9 h-5 w-5 text-neutral-400" />
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-9 h-5 w-5 text-neutral-400" />
              <Input
                label="Phone Number"
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                className="pl-10"
              />
            </div>

            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-neutral-900">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {passwordError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              required
              minLength={8}
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />

            <Button type="submit" disabled={isSavingPassword}>
              {isSavingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-neutral-900">
              Notification Preferences
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Order Updates</p>
                <p className="text-sm text-neutral-500">
                  Receive notifications about your orders
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    orderUpdates: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">
                  Promotions & Deals
                </p>
                <p className="text-sm text-neutral-500">
                  Get notified about sales and special offers
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    promotions: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Newsletter</p>
                <p className="text-sm text-neutral-500">
                  Industry news and product updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.newsletter}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    newsletter: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-200">
            <h2 className="font-semibold text-red-900">Danger Zone</h2>
          </div>
          <div className="p-6">
            <p className="text-neutral-600 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
