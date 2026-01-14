"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle, Phone, ArrowRight } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

type LoginMethod = "email" | "phone";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const { login, isLoading, error, isAuthenticated, clearError, setUser } = useAuthStore();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Clear errors on method change and unmount
  useEffect(() => {
    clearError();
    setPhoneError("");
    return () => clearError();
  }, [loginMethod, clearError]);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push(redirectTo);
    }
  };

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setSendingCode(true);

    try {
      const response = await fetch("/api/auth/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPhoneError(data.error || "Failed to send code");
        return;
      }

      setCodeSent(true);
    } catch {
      setPhoneError("Failed to send verification code");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setVerifying(true);

    try {
      const response = await fetch("/api/auth/phone/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPhoneError(data.error || "Verification failed");
        return;
      }

      // Set user in auth store
      setUser(data.user);
      router.push(redirectTo);
    } catch {
      setPhoneError("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-neutral-600">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Method Tabs */}
      <div className="flex mb-6 bg-neutral-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setLoginMethod("phone")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            loginMethod === "phone"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Phone className="h-4 w-4" />
          Phone
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("email")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            loginMethod === "email"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
        {loginMethod === "phone" ? (
          // Phone Login
          <div className="space-y-4">
            {/* Error Message */}
            {phoneError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{phoneError}</p>
              </div>
            )}

            {!codeSent ? (
              // Step 1: Enter phone number
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      type="tel"
                      placeholder="(509) 555-0123"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                      className="pl-10"
                      required
                      disabled={sendingCode}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1.5">
                    We&apos;ll send you a verification code via SMS
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={sendingCode || phone.replace(/\D/g, "").length < 10}
                >
                  {sendingCode ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              // Step 2: Enter verification code
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-neutral-600">
                    Code sent to <strong>{phone}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeSent(false);
                      setVerificationCode("");
                    }}
                    className="text-sm text-primary hover:underline mt-1"
                  >
                    Change number
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                    disabled={verifying}
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={verifying || verificationCode.length !== 6}
                >
                  {verifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Verify & Sign In
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => handleSendCode({ preventDefault: () => {} } as FormEvent)}
                  className="w-full text-sm text-neutral-600 hover:text-primary"
                  disabled={sendingCode}
                >
                  {sendingCode ? "Sending..." : "Resend code"}
                </button>
              </form>
            )}
          </div>
        ) : (
          // Email Login
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">
              New to Cascade Autobody?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Link href="/register" className="block">
          <Button variant="outline" className="w-full">
            Create an Account
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="w-full max-w-md animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-48 mx-auto mb-8" />
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="space-y-4">
              <div className="h-10 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
