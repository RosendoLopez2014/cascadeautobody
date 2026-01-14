export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface LocationInventory {
  location_id: number;
  location_name: string;
  stock_quantity: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number | null;
  manage_stock: boolean;
  images: ProductImage[];
  categories: ProductCategory[];
  average_rating: string;
  rating_count: number;
  // Multi-location inventory
  inventory_by_location?: LocationInventory[];
  // Wholesale pricing
  wholesale_price?: string;
  // Meta data
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  count: number;
  image: ProductImage | null;
}
