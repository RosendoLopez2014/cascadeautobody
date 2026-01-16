import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  fulfillment?: {
    method: FulfillmentMethod;
    pickupLocation?: "yakima" | "toppenish";
  };
  shippingCost?: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type FulfillmentMethod = "pickup" | "delivery" | "shipping";

export interface FulfillmentDetails {
  method: FulfillmentMethod;
  pickupLocation?: "yakima" | "toppenish";
  deliveryAddress?: ShippingAddress;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
}
