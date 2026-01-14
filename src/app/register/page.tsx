"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, AlertCircle, UserPlus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/account");
    }
  }, [isAuthenticated, router]);

  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });

    if (success) {
      router.push("/account");
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Create an Account
          </h1>
          <p className="text-neutral-600">
            Join Cascade Autobody for easy ordering and order tracking
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {displayError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
              <Input
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="tel"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="pl-10"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary"
                required
              />
              <span className="text-sm text-neutral-600">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              Sign In Instead
            </Button>
          </Link>
        </div>

        {/* Business Account CTA */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg text-center">
          <p className="text-sm text-primary-900">
            <strong>Business Customer?</strong> Get wholesale pricing and credit
            terms.
          </p>
          <Link
            href="/account/business"
            className="text-sm text-primary font-medium hover:underline"
          >
            Apply for a Business Account &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
