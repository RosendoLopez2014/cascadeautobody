import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Truck, Store, Clock } from "lucide-react";
import { woocommerce } from "@/lib/woocommerce";
import { formatPrice, stripHtml, sanitizeHtml } from "@/lib/utils";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCart, LocationStock } from "@/components/shop";
import { Badge } from "@/components/ui";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await woocommerce.getProduct(params.slug);
    return {
      title: product.name,
      description: stripHtml(product.short_description || product.description).slice(0, 160),
      openGraph: {
        title: product.name,
        description: stripHtml(product.short_description || ""),
        images: product.images[0] ? [product.images[0].src] : [],
      },
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;

  try {
    product = await woocommerce.getProduct(params.slug);
  } catch {
    notFound();
  }

  // Sanitize HTML content from WooCommerce
  const sanitizedShortDescription = product.short_description
    ? sanitizeHtml(product.short_description)
    : "";
  const sanitizedDescription = product.description
    ? sanitizeHtml(product.description)
    : "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        {product.categories[0] && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/shop?category=${product.categories[0].slug}`}
              className="hover:text-primary"
            >
              {product.categories[0].name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-neutral-900 truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & badges */}
          <div className="flex items-center gap-2">
            {product.categories[0] && (
              <Badge variant="default">{product.categories[0].name}</Badge>
            )}
            {product.on_sale && <Badge variant="warning">Sale</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>

          {/* SKU */}
          {product.sku && (
            <p className="text-sm text-neutral-500">SKU: {product.sku}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.on_sale && product.regular_price !== product.price && (
              <span className="text-xl text-neutral-500 line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
          </div>

          {/* Stock at selected location */}
          <LocationStock stockQuantity={product.stock_quantity} />

          {/* Add to cart */}
          <div className="pt-4 border-t border-neutral-200">
            <AddToCart product={product} />
          </div>

          {/* Fulfillment options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-start gap-3 text-sm">
              <Store className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-neutral-900">Local Pickup</p>
                <p className="text-neutral-500">Yakima or Toppenish</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-neutral-900">Local Delivery</p>
                <p className="text-neutral-500">Yakima Valley area</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-neutral-900">Store Hours</p>
                <p className="text-neutral-500">Mon-Fri 8-5:30</p>
              </div>
            </div>
          </div>

          {/* Short description */}
          {sanitizedShortDescription && (
            <div className="pt-4 border-t border-neutral-200">
              <div
                className="prose-product"
                dangerouslySetInnerHTML={{ __html: sanitizedShortDescription }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Full description */}
      {sanitizedDescription && (
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Product Description
          </h2>
          <div
            className="prose-product max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
      )}
    </div>
  );
}
