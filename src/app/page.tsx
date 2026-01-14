import Link from "next/link";
import {
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Palette,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui";
import { LOCATIONS } from "@/lib/woocommerce";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Main Content - Compact Overview */}
      <section className="flex-1 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Company Info */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Cascade Autobody<br />
                <span className="text-neutral-400">&amp; Paint Supply</span>
              </h1>
              <p className="text-lg text-neutral-300 mb-8 max-w-lg">
                Yakima Valley&apos;s premier supplier for collision repair, refinishing,
                and restoration. Professional-grade products with same-day availability.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 w-full sm:w-auto">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Products
                  </Button>
                </Link>
                <Link href="/paint">
                  <Button size="lg" className="bg-secondary hover:bg-secondary-600 w-full sm:w-auto">
                    <Palette className="mr-2 h-5 w-5" />
                    Paint Services
                  </Button>
                </Link>
              </div>

              {/* Key Services */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-semibold mb-1">Auto Body Parts</p>
                  <p className="text-neutral-400">Bumpers, fenders, hoods & more</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-semibold mb-1">Paint & Coatings</p>
                  <p className="text-neutral-400">Custom mixing on-site</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-semibold mb-1">Tools & Equipment</p>
                  <p className="text-neutral-400">Professional grade</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-semibold mb-1">Shop Supplies</p>
                  <p className="text-neutral-400">Abrasives, tape, PPE</p>
                </div>
              </div>
            </div>

            {/* Right - Locations */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-400 uppercase tracking-wider mb-6">
                Our Locations
              </h2>

              {Object.values(LOCATIONS).map((location, index) => (
                <div
                  key={location.id}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{location.address}</span>
                      </div>
                    </div>
                    <div className="bg-secondary/20 text-secondary-400 px-3 py-1 rounded-full text-xs font-medium">
                      {index === 0 ? "Main Store" : "Branch"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
                    <Clock className="h-4 w-4" />
                    <span>Mon-Fri 8am-5:30pm | Sat 9am-2pm</span>
                  </div>

                  <div className="flex gap-3">
                    <a href={`tel:${index === 0 ? "+15099728989" : "+15098658544"}`}>
                      <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                        <Phone className="h-4 w-4 mr-1" />
                        {index === 0 ? "(509) 972-8989" : "(509) 865-8544"}
                      </Button>
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                        Directions
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}

              {/* Business Account CTA */}
              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-xl p-6 border border-secondary/30">
                <h3 className="font-semibold mb-2">Business Account</h3>
                <p className="text-sm text-neutral-400 mb-4">
                  Wholesale pricing, credit terms, and dedicated support for shops.
                </p>
                <Link href="/account/business">
                  <Button size="sm" className="bg-secondary hover:bg-secondary-600">
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
