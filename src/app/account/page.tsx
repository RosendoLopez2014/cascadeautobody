"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

const accountLinks = [
  {
    href: "/account/orders",
    icon: Package,
    title: "Order History",
    description: "View and track your orders",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    title: "Addresses",
    description: "Manage shipping and billing addresses",
  },
  {
    href: "/account/payment-methods",
    icon: CreditCard,
    title: "Payment Methods",
    description: "Manage saved payment methods",
  },
  {
    href: "/account/settings",
    icon: Settings,
    title: "Account Settings",
    description: "Update email, password, and preferences",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Account</h1>
          <p className="text-neutral-600 mt-1">
            Welcome back, {user.first_name}!
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-sm text-neutral-500">{user.email}</p>
              </div>
            </div>

            {user.billing && (
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-medium text-neutral-500 mb-2">
                  Default Address
                </h3>
                <p className="text-sm text-neutral-700">
                  {user.billing.address_1 || "No address on file"}
                  {user.billing.city && (
                    <>
                      <br />
                      {user.billing.city}, {user.billing.state}{" "}
                      {user.billing.postcode}
                    </>
                  )}
                </p>
              </div>
            )}

            {user.is_paying_customer && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  Verified Customer
                </p>
              </div>
            )}
          </div>

          {/* Business Account Promo */}
          <div className="mt-6 bg-primary-50 rounded-lg p-6">
            <h3 className="font-semibold text-primary-900 mb-2">
              Upgrade to Business
            </h3>
            <p className="text-sm text-primary-700 mb-4">
              Get wholesale pricing, credit terms, and dedicated support.
            </p>
            <Link href="/account/business">
              <Button variant="primary" size="sm">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Account Links */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            {accountLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors ${
                  index !== accountLinks.length - 1
                    ? "border-b border-neutral-200"
                    : ""
                }`}
              >
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <link.icon className="h-5 w-5 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">{link.title}</h3>
                  <p className="text-sm text-neutral-500">{link.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400" />
              </Link>
            ))}
          </div>

          {/* Recent Orders Preview */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                Recent Orders
              </h2>
              <Link
                href="/account/orders"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-medium text-neutral-900 mb-2">
                No orders yet
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                When you place an order, it will appear here.
              </p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
