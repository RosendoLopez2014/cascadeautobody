"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ChevronLeft,
  CreditCard,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  X,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

// Load Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

const cardBrandNames: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
};

// Card Form Component (uses Stripe hooks)
function AddCardForm({
  onSuccess,
  onCancel,
  userEmail,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  userEmail: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Get setup intent on mount
  useEffect(() => {
    async function getSetupIntent() {
      try {
        const response = await fetch("/api/payment-methods/setup-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) throw new Error("Failed to create setup intent");

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch {
        setError("Failed to initialize payment form. Please try again.");
      }
    }

    getSetupIntent();
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setIsProcessing(false);
      return;
    }

    try {
      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Failed to save card");
      } else if (setupIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-neutral-200 rounded-lg bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#171717",
                "::placeholder": {
                  color: "#a3a3a3",
                },
              },
              invalid: {
                color: "#dc2626",
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
        <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">
          Your card information is encrypted and securely processed by Stripe.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !clientSecret}
        >
          {isProcessing ? "Saving..." : "Save Card"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const fetchPaymentMethods = useCallback(async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(
        `/api/payment-methods?email=${encodeURIComponent(user.email)}`
      );

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
        setCustomerId(data.customerId);
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/account/payment-methods");
      return;
    }

    fetchPaymentMethods();
  }, [isAuthenticated, router, fetchPaymentMethods]);

  const handleDeleteCard = async (paymentMethodId: string) => {
    if (!confirm("Are you sure you want to remove this card?")) return;

    setDeletingId(paymentMethodId);

    try {
      const response = await fetch("/api/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      });

      if (response.ok) {
        setPaymentMethods((prev) =>
          prev.filter((pm) => pm.id !== paymentMethodId)
        );
      }
    } catch (error) {
      console.error("Failed to delete payment method:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    if (!customerId) return;

    setSettingDefaultId(paymentMethodId);

    try {
      const response = await fetch("/api/payment-methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, paymentMethodId }),
      });

      if (response.ok) {
        setPaymentMethods((prev) =>
          prev.map((pm) => ({
            ...pm,
            isDefault: pm.id === paymentMethodId,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to set default payment method:", error);
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleCardAdded = () => {
    setIsAddingCard(false);
    setIsLoading(true);
    fetchPaymentMethods();
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Payment Methods
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage your saved payment methods
            </p>
          </div>
          {!isAddingCard && paymentMethods.length > 0 && (
            <Button onClick={() => setIsAddingCard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Security Notice */}
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg mb-6">
          <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-800 font-medium">
              Your payment information is secure
            </p>
            <p className="text-sm text-green-700 mt-1">
              All payment methods are securely stored by Stripe. We never store
              your full card details on our servers.
            </p>
          </div>
        </div>

        {/* Add Card Form */}
        {isAddingCard && user?.email && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-neutral-900">Add New Card</h2>
              <button
                onClick={() => setIsAddingCard(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Elements stripe={stripePromise}>
              <AddCardForm
                onSuccess={handleCardAdded}
                onCancel={() => setIsAddingCard(false)}
                userEmail={user.email}
              />
            </Elements>
          </div>
        )}

        {/* Payment Methods List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-neutral-600">Loading payment methods...</p>
          </div>
        ) : paymentMethods.length === 0 && !isAddingCard ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
            <CreditCard className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              No saved payment methods
            </h2>
            <p className="text-neutral-600 mb-6">
              Add a card to make checkout faster and easier.
            </p>
            <Button onClick={() => setIsAddingCard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Card
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-lg border border-neutral-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-neutral-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900">
                          {cardBrandNames[method.brand] || method.brand} ending
                          in {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            <Check className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">
                        Expires {method.expMonth.toString().padStart(2, "0")}/
                        {method.expYear.toString().slice(-2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        disabled={settingDefaultId === method.id}
                        className="p-2 text-neutral-400 hover:text-primary transition-colors disabled:opacity-50"
                        title="Set as default"
                      >
                        {settingDefaultId === method.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                        ) : (
                          <Star className="h-5 w-5" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCard(method.id)}
                      disabled={deletingId === method.id}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Remove card"
                    >
                      {deletingId === method.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Card Button */}
            {!isAddingCard && (
              <button
                onClick={() => setIsAddingCard(true)}
                className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Another Card
              </button>
            )}
          </div>
        )}

        {/* Info Text */}
        <p className="text-sm text-neutral-500 mt-6">
          Cards you add here can be used for faster checkout. You can also save
          cards during the checkout process.
        </p>
      </div>
    </div>
  );
}
