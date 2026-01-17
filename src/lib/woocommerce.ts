import {
  Product,
  ProductsResponse,
  Category,
  Order,
  CreateOrderRequest,
  User,
} from "@/types";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://rcktbuilds.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

// Location IDs for multi-location inventory (update with actual MicroBiz location IDs)
export const LOCATIONS = {
  YAKIMA: { id: 1, name: "Yakima", address: "916 North 28th Ave, Suite A, Yakima, WA 98902" },
  TOPPENISH: { id: 2, name: "Toppenish", address: "216 S Beech St, Toppenish, WA 98948" },
} as const;

interface ToppenishInventoryItem {
  sku: string;
  product_name: string;
  total_stock: number;
  open_stock: number;
  price: number;
}

class WooCommerceClient {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.baseUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3`;
    this.consumerKey = CONSUMER_KEY;
    this.consumerSecret = CONSUMER_SECRET;
  }

  // Add auth params to URL for WooCommerce REST API
  private addAuthParams(url: string): string {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.addAuthParams(`${this.baseUrl}${endpoint}`);

    try {
      const response = await fetch(url, {
        ...options,
        cache: 'no-store', // Disable Next.js fetch caching
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WooCommerce API error: ${response.status} - ${error}`);
      }

      return response.json();
    } catch (error) {
      console.error('[WooCommerce] Fetch error:', {
        endpoint,
        url: this.baseUrl + endpoint,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  // Products
  async getProducts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: number;
    orderby?: string;
    order?: "asc" | "desc";
    on_sale?: boolean;
    stock_status?: "instock" | "outofstock" | "onbackorder";
  } = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    // Default pagination
    if (!params.per_page) searchParams.set("per_page", "20");
    if (!params.page) searchParams.set("page", "1");

    const queryString = searchParams.toString();
    const url = this.addAuthParams(`${this.baseUrl}/products?${queryString}`);

    let response;
    try {
      response = await fetch(url, {
        cache: 'no-store',
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error('[WooCommerce] Failed to fetch products:', error);
      throw new Error(`Failed to connect to WooCommerce: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
    }

    const products: Product[] = await response.json();
    const total = parseInt(response.headers.get("X-WP-Total") || "0");
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");

    console.log('[WooCommerce] Fetched', products.length, 'products from WooCommerce');

    // Fetch Toppenish inventory from Supabase
    const toppenishInventory = await this.fetchToppenishInventory();

    // Transform products to include multi-location inventory
    const productsWithInventory = products.map((product) =>
      this.addLocationInventory(product, toppenishInventory)
    );

    return {
      products: productsWithInventory,
      total,
      totalPages,
    };
  }

  async getProduct(idOrSlug: number | string): Promise<Product> {
    const endpoint =
      typeof idOrSlug === "number"
        ? `/products/${idOrSlug}`
        : `/products?slug=${idOrSlug}`;

    // Fetch Toppenish inventory from Supabase
    const toppenishInventory = await this.fetchToppenishInventory();

    if (typeof idOrSlug === "string") {
      const products = await this.request<Product[]>(endpoint);
      if (products.length === 0) {
        throw new Error(`Product not found: ${idOrSlug}`);
      }
      return this.addLocationInventory(products[0], toppenishInventory);
    }

    const product = await this.request<Product>(endpoint);
    return this.addLocationInventory(product, toppenishInventory);
  }

  // Fetch Toppenish inventory directly from Supabase
  private async fetchToppenishInventory(): Promise<Record<string, ToppenishInventoryItem>> {
    try {
      console.log('[WooCommerce] Fetching Toppenish inventory at:', new Date().toISOString());

      // Lazy import supabase to avoid module initialization issues
      const { createClient } = await import("@supabase/supabase-js");

      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.warn('[WooCommerce] Supabase credentials not configured, skipping Toppenish inventory fetch');
        return {};
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from("inventory")
        .select("sku, product_name, total_stock, open_stock, price");

      if (error) {
        console.error("Error fetching Toppenish inventory from Supabase:", error);
        return {};
      }

      // Normalize SKUs to lowercase and trim whitespace for better matching
      const normalizedInventory: Record<string, ToppenishInventoryItem> = {};
      if (data) {
        for (const item of data) {
          const normalizedSku = item.sku.trim().toLowerCase();
          normalizedInventory[normalizedSku] = item;
        }
      }

      console.log('[WooCommerce] ✓ Fetched fresh Toppenish inventory:', Object.keys(normalizedInventory).length, 'items');
      console.log('[WooCommerce] Sample data:', data?.slice(0, 3).map(i => ({ sku: i.sku, open: i.open_stock, total: i.total_stock })));
      return normalizedInventory;
    } catch (error) {
      console.error("Error fetching Toppenish inventory:", error);
      return {};
    }
  }

  // Calculate location inventory using Supabase data for Toppenish
  // Logic: WooCommerce has combined inventory (Yakima + Toppenish)
  // Supabase has Toppenish inventory, so Yakima = WooCommerce - Toppenish
  private addLocationInventory(
    product: Product,
    toppenishInventory: Record<string, ToppenishInventoryItem>
  ): Product {
    const totalStock = product.stock_quantity || 0;
    const productSku = (product.sku || "").trim();

    let toppenishStock = 0;
    let yakimaStock = 0;

    // Normalize SKU for matching (lowercase, trim whitespace)
    const normalizedSku = productSku.toLowerCase();

    // Check if this product exists in Toppenish Supabase inventory
    const toppenishItem = normalizedSku ? toppenishInventory[normalizedSku] : undefined;

    if (toppenishItem) {
      // Product exists in Toppenish - use open_stock from Supabase
      toppenishStock = toppenishItem.open_stock || 0;
      // Calculate Yakima stock by subtracting Toppenish from total
      yakimaStock = Math.max(0, totalStock - toppenishStock);

      console.log(`[Inventory Split] ${product.name} (SKU: ${productSku}):`, {
        normalizedSku,
        wooCommerceTotal: totalStock,
        supabaseOpenStock: toppenishItem.open_stock,
        supabaseTotalStock: toppenishItem.total_stock,
        calculated_toppenish: toppenishStock,
        calculated_yakima: yakimaStock,
      });
    } else if (totalStock > 0 && productSku) {
      // SKU exists only in WooCommerce, not in Supabase
      // This means the product is only available in Yakima
      yakimaStock = totalStock;
      toppenishStock = 0;

      console.log(`[Inventory Split] ${product.name} (SKU: ${productSku}): Yakima-only`, {
        wooCommerceTotal: totalStock,
        yakima: yakimaStock,
      });
    } else {
      // No SKU or no stock - both locations show 0
      yakimaStock = 0;
      toppenishStock = 0;
    }

    product.inventory_by_location = [
      {
        location_id: LOCATIONS.YAKIMA.id,
        location_name: LOCATIONS.YAKIMA.name,
        stock_quantity: yakimaStock,
      },
      {
        location_id: LOCATIONS.TOPPENISH.id,
        location_name: LOCATIONS.TOPPENISH.name,
        stock_quantity: toppenishStock,
      },
    ];

    return product;
  }

  // Categories
  async getCategories(params: {
    page?: number;
    per_page?: number;
    parent?: number;
    hide_empty?: boolean;
  } = {}): Promise<Category[]> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    if (!params.per_page) searchParams.set("per_page", "100");
    if (params.hide_empty === undefined) searchParams.set("hide_empty", "true");

    return this.request<Category[]>(`/products/categories?${searchParams}`);
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/products/categories/${id}`);
  }

  // Orders
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async getOrders(customerId: number, params: {
    page?: number;
    per_page?: number;
    status?: string;
  } = {}): Promise<Order[]> {
    const searchParams = new URLSearchParams();
    searchParams.set("customer", String(customerId));

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    if (!params.per_page) searchParams.set("per_page", "10");

    return this.request<Order[]>(`/orders?${searchParams}`);
  }

  // Customers
  async getCustomer(id: number): Promise<User> {
    return this.request<User>(`/customers/${id}`);
  }

  async searchCustomers(params: {
    search?: string;
    email?: string;
    per_page?: number;
  } = {}): Promise<User[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    if (!params.per_page) searchParams.set("per_page", "10");
    return this.request<User[]>(`/customers?${searchParams}`);
  }

  async createCustomer(data: {
    email: string;
    first_name: string;
    last_name: string;
    username?: string;
    password?: string;
    billing?: User["billing"];
    shipping?: User["shipping"];
  }): Promise<User> {
    return this.request<User>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: number, data: Partial<User>): Promise<User> {
    return this.request<User>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Inventory check (atomic)
  async checkInventory(
    items: Array<{ productId: number; quantity: number; locationId?: number }>
  ): Promise<{
    available: boolean;
    issues: Array<{ productId: number; available: number; requested: number }>;
  }> {
    const issues: Array<{ productId: number; available: number; requested: number }> = [];

    for (const item of items) {
      const product = await this.getProduct(item.productId);

      if (item.locationId) {
        // Check specific location
        const locationStock = product.inventory_by_location?.find(
          (l) => l.location_id === item.locationId
        );
        if (!locationStock || locationStock.stock_quantity < item.quantity) {
          issues.push({
            productId: item.productId,
            available: locationStock?.stock_quantity || 0,
            requested: item.quantity,
          });
        }
      } else {
        // Check total stock
        const totalStock = product.stock_quantity || 0;
        if (totalStock < item.quantity) {
          issues.push({
            productId: item.productId,
            available: totalStock,
            requested: item.quantity,
          });
        }
      }
    }

    return {
      available: issues.length === 0,
      issues,
    };
  }

  // Search products
  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    const { products } = await this.getProducts({
      search: query,
      per_page: limit,
    });
    return products;
  }
}

// Export singleton instance
export const woocommerce = new WooCommerceClient();

// Export class for testing
export { WooCommerceClient };
