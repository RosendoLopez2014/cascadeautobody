"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StripePaymentFormProps {
  total: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function StripePaymentForm({
  total,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Handle PaymentElement ready state
  const handleReady = () => {
    setIsReady(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        onError(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        // 3D Secure or other action required - Stripe will handle redirect
        setErrorMessage("Additional authentication required");
        setIsProcessing(false);
      } else {
        setErrorMessage("Unexpected payment status");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred");
      onError("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-neutral-200 rounded-lg p-4">
        <PaymentElement
          onReady={handleReady}
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
        <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">
          Your payment information is encrypted and secure. We never store your
          card details.
        </p>
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !isReady}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Processing...
          </>
        ) : (
          <>Pay {formatPrice(total)}</>
        )}
      </Button>
    </form>
  );
}
