import Link from "next/link";
import {
  Truck,
  Store,
  Palette,
  ShieldCheck,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { woocommerce, LOCATIONS } from "@/lib/woocommerce";
import { ProductCard } from "@/components/shop";
import { Product } from "@/types";

// Disable caching to always show fresh products
export const dynamic = "force-dynamic";

const features = [
  {
    icon: Store,
    title: "Two Locations",
    description:
      "Visit us in Yakima or Toppenish. Check real-time inventory for each location.",
  },
  {
    icon: Truck,
    title: "Multiple Fulfillment Options",
    description:
      "Local pickup, same-day delivery in the Yakima Valley, or shipping.",
  },
  {
    icon: Palette,
    title: "Paint Mixing Services",
    description:
      "Custom color matching and professional paint mixing at both locations.",
  },
  {
    icon: ShieldCheck,
    title: "Business Accounts",
    description:
      "Wholesale pricing, credit terms, and dedicated support for shops.",
  },
];

export default async function HomePage() {
  // Fetch featured products (on sale or latest)
  let featuredProducts: Product[] = [];
  try {
    const result = await woocommerce.getProducts({
      per_page: 4,
      on_sale: true,
    });
    featuredProducts = result.products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }

  return (
    <div>
      {/* Hero Section - Modern Minimal */}
      <section className="bg-neutral-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-neutral-400 mb-4">
              Yakima Valley&apos;s Premier Supplier
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Professional Auto Body & Paint Supplies
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl">
              Everything you need for collision repair, refinishing, and restoration.
              Two locations, real-time inventory, same-day pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/account/business">
                <Button size="lg" variant="outline" className="text-white border-neutral-600 hover:bg-white/5 hover:border-neutral-500">
                  Business Accounts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimal grid */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-4 group-hover:bg-secondary transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                  Featured Products
                </h2>
                <p className="text-neutral-500 mt-1">Popular items from our catalog</p>
              </div>
              <Link
                href="/shop"
                className="text-neutral-900 hover:text-secondary font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Locations Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Two Locations
            </h2>
            <p className="text-neutral-500">Serving the Yakima Valley</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Object.values(LOCATIONS).map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-lg p-6 border border-neutral-100 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      {location.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-3">{location.address}</p>
                    <p className="text-xs text-neutral-400 mb-4">
                      Mon-Fri 8am-5:30pm | Sat 9am-2pm
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        location.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-neutral-900 hover:text-secondary font-medium transition-colors"
                    >
                      Get Directions
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-20 bg-neutral-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
            Browse our catalog or apply for a business account to unlock wholesale pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                Browse Products
              </Button>
            </Link>
            <Link href="/paint">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-neutral-600 hover:bg-white/5 hover:border-neutral-500"
              >
                Paint Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
