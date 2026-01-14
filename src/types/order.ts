import { FulfillmentMethod, ShippingAddress } from "./cart";

export type OrderStatus =
  | "pending"
  | "processing"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed";

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
  billing: ShippingAddress;
  shipping: ShippingAddress;
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
  billing: ShippingAddress;
  shipping: ShippingAddress;
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}
