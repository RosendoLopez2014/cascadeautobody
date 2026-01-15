"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; icon: typeof Clock; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  "on-hold": {
    label: "On Hold",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  refunded: {
    label: "Refunded",
    icon: XCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/account/orders/${orderId}`);
      return;
    }

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Order not found");
          } else {
            setError("Failed to load order");
          }
          return;
        }
        const data = await response.json();

        // Verify order belongs to this user
        if (data.order.customer_id !== user?.id && data.order.customer_id !== 0) {
          setError("Order not found");
          return;
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [isAuthenticated, orderId, user?.id, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-neutral-600">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          {error || "Order not found"}
        </h1>
        <p className="text-neutral-600 mb-6">
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link href="/account/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/account/orders"
          className="flex items-center text-neutral-600 hover:text-primary mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Order #{order.number || order.id}
            </h1>
            <p className="text-neutral-600 mt-1">
              Placed on {formatDate(order.date_created)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}
          >
            <StatusIcon className="h-5 w-5" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900">Order Items</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {order.line_items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image?.src ? (
                      <Image
                        src={item.image.src}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-neutral-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900">{item.name}</h3>
                    {item.sku && (
                      <p className="text-sm text-neutral-500">SKU: {item.sku}</p>
                    )}
                    <p className="text-sm text-neutral-600 mt-1">
                      Qty: {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-neutral-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="text-neutral-900">
                  {parseFloat(order.shipping_total) === 0
                    ? "Free"
                    : formatPrice(order.shipping_total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tax</span>
                <span className="text-neutral-900">{formatPrice(order.total_tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-neutral-400" />
              Payment
            </h3>
            <p className="text-sm text-neutral-600">
              {order.payment_method_title || "N/A"}
            </p>
          </div>

          {/* Shipping Address */}
          {order.shipping && (order.shipping.address_1 || order.shipping.city) && (
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-neutral-400" />
                Shipping Address
              </h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <p className="font-medium text-neutral-900">
                  {order.shipping.first_name} {order.shipping.last_name}
                </p>
                {order.shipping.address_1 && <p>{order.shipping.address_1}</p>}
                {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                <p>
                  {order.shipping.city}, {order.shipping.state}{" "}
                  {order.shipping.postcode}
                </p>
              </div>
            </div>
          )}

          {/* Billing Info */}
          {order.billing && (
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-neutral-400" />
                Billing Details
              </h3>
              <div className="text-sm text-neutral-600 space-y-2">
                <p className="font-medium text-neutral-900">
                  {order.billing.first_name} {order.billing.last_name}
                </p>
                {order.billing.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {order.billing.email}
                  </p>
                )}
                {order.billing.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {order.billing.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Need Help */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 mb-2">Need Help?</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Contact us if you have questions about your order.
            </p>
            <div className="text-sm space-y-1">
              <a
                href="tel:+15099728989"
                className="block text-primary hover:underline"
              >
                Yakima: (509) 972-8989
              </a>
              <a
                href="tel:+15098658544"
                className="block text-primary hover:underline"
              >
                Toppenish: (509) 865-8544
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
