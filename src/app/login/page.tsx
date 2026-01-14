"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      router.push(redirectTo);
    }
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

      {/* Login Form */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
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
