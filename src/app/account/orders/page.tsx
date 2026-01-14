"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronLeft,
  Search,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-50",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "text-blue-600 bg-blue-50",
  },
  "on-hold": {
    label: "On Hold",
    icon: Clock,
    color: "text-orange-600 bg-orange-50",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600 bg-purple-50",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 bg-red-50",
  },
  refunded: {
    label: "Refunded",
    icon: XCircle,
    color: "text-gray-600 bg-gray-50",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-600 bg-red-50",
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/account/orders");
      return;
    }

    // Fetch orders
    async function fetchOrders() {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/orders?customerId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isAuthenticated, user, router]);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchQuery) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-neutral-900">Order History</h1>
        <p className="text-neutral-600 mt-1">
          View and track all your orders
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-neutral-600">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
          <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            {searchQuery ? "No orders found" : "No orders yet"}
          </h2>
          <p className="text-neutral-600 mb-6">
            {searchQuery
              ? "Try a different search term"
              : "When you place an order, it will appear here."}
          </p>
          {!searchQuery && (
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {formatDate(order.date_created)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {status.label}
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="flex flex-wrap gap-4">
                    {order.line_items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-neutral-400" />
                        </div>
                        <div>
                          <p className="text-neutral-900 truncate max-w-[150px]">
                            {item.name}
                          </p>
                          <p className="text-neutral-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.line_items.length > 3 && (
                      <div className="flex items-center text-sm text-neutral-500">
                        +{order.line_items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-neutral-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-neutral-600">
                    {order.shipping?.city && (
                      <span>
                        Shipped to: {order.shipping.city}, {order.shipping.state}
                      </span>
                    )}
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
