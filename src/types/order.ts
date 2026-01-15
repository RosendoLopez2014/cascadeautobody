import { FulfillmentMethod } from "./cart";

export type OrderStatus =
  | "pending"
  | "processing"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed";

// WooCommerce address format (snake_case from API)
export interface WooCommerceAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface OrderLineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  price: number;
  sku: string;
  image?: {
    src: string;
  };
}

export interface Order {
  id: number;
  number: string;
  status: OrderStatus;
  currency: string;
  date_created: string;
  date_modified: string;
  total: string;
  subtotal: string;
  total_tax: string;
  shipping_total: string;
  customer_id: number;
  billing: WooCommerceAddress;
  shipping: WooCommerceAddress;
  payment_method: string;
  payment_method_title: string;
  line_items: OrderLineItem[];
  fulfillment_method?: FulfillmentMethod;
  pickup_location?: string;
}

export interface CreateOrderRequest {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: WooCommerceAddress;
  shipping: WooCommerceAddress;
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}
