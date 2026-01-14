import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numPrice);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// Basic HTML sanitization for WooCommerce content
// In production, consider using DOMPurify for more robust sanitization
export function sanitizeHtml(html: string): string {
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function getStockStatus(quantity: number | null): {
  status: "in-stock" | "low-stock" | "out-of-stock";
  label: string;
  color: string;
} {
  if (quantity === null || quantity === 0) {
    return {
      status: "out-of-stock",
      label: "Out of Stock",
      color: "text-red-600 bg-red-50",
    };
  }
  if (quantity <= 5) {
    return {
      status: "low-stock",
      label: `Only ${quantity} left`,
      color: "text-amber-600 bg-amber-50",
    };
  }
  return {
    status: "in-stock",
    label: "In Stock",
    color: "text-green-600 bg-green-50",
  };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

export const STORE_HOURS = {
  monday: { open: "8:00 AM", close: "5:30 PM" },
  tuesday: { open: "8:00 AM", close: "5:30 PM" },
  wednesday: { open: "8:00 AM", close: "5:30 PM" },
  thursday: { open: "8:00 AM", close: "5:30 PM" },
  friday: { open: "8:00 AM", close: "5:30 PM" },
  saturday: { open: "9:00 AM", close: "2:00 PM" },
  sunday: null, // Closed
} as const;

export function isStoreOpen(): boolean {
  const now = new Date();
  const day = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof STORE_HOURS;
  const hours = STORE_HOURS[day];

  if (!hours) return false;

  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Simple comparison (works for AM/PM format)
  return currentTime >= hours.open && currentTime <= hours.close;
}
