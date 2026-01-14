export type UserRole = "customer" | "wholesale" | "administrator";
export type AccountStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: UserRole;
  avatar_url?: string;
  billing?: BillingInfo;
  shipping?: ShippingInfo;
  is_paying_customer?: boolean;
  // Business account fields
  is_business: boolean;
  business_name?: string;
  business_status?: AccountStatus;
  credit_limit?: number;
  credit_used?: number;
  net_terms?: number; // e.g., 30 for Net 30
  pricing_tier?: "retail" | "wholesale" | "preferred";
}

export interface BillingInfo {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface BusinessApplication {
  business_name: string;
  tax_id: string;
  years_in_business: number;
  annual_revenue?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  business_address: string;
  business_type: string;
  references?: string;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
