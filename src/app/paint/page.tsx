import { Metadata } from "next";
import Link from "next/link";
import {
  Palette,
  Droplets,
  Car,
  Paintbrush,
  CheckCircle,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { LOCATIONS } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Paint Mixing Services",
  description:
    "Professional paint mixing and color matching services at Cascade Autobody & Paint Supply. Custom colors, OEM matching, and expert support.",
};

const services = [
  {
    icon: Palette,
    title: "Color Matching",
    description:
      "Precise OEM color matching using advanced spectrophotometer technology. Bring in your paint code or a sample and we'll match it perfectly.",
  },
  {
    icon: Droplets,
    title: "Custom Paint Mixing",
    description:
      "On-site mixing for basecoats, clearcoats, primers, and specialty finishes. Available in quarts, gallons, and bulk quantities.",
  },
  {
    icon: Car,
    title: "Automotive Refinishing",
    description:
      "Complete paint systems for collision repair, restoration, and custom projects. We carry all major brands including PPG, Axalta, and Sherwin-Williams.",
  },
  {
    icon: Paintbrush,
    title: "Touch-Up Solutions",
    description:
      "Small quantity mixing for touch-ups and spot repairs. Perfect color match in convenient sizes.",
  },
];

const brands = [
  "PPG",
  "Axalta",
  "Sherwin-Williams",
  "BASF",
  "3M",
  "Norton",
  "Evercoat",
  "U-POL",
];

const features = [
  "Expert color matching with 99% accuracy",
  "Same-day mixing service available",
  "All major automotive paint brands",
  "Custom tinting and specialty finishes",
  "Technical support and training",
  "Bulk pricing for shops",
];

export default function PaintServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-secondary-700 to-secondary-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-8 w-8" />
              <span className="text-secondary-200 font-medium">
                Professional Paint Services
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Expert Paint Mixing & Color Matching
            </h1>
            <p className="text-xl text-secondary-100 mb-8">
              Get perfect color matches and custom paint mixing at both of our
              locations. Our trained technicians use state-of-the-art equipment to
              ensure your project looks factory-fresh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+15099728989">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-white text-secondary hover:bg-neutral-100"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call for Quote
                </Button>
              </a>
              <Link href="/shop?category=paint">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  Browse Paint Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Our Paint Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From simple touch-ups to complete refinishing systems, we have the
              products and expertise to get the job done right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-neutral-600">{service.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features & Brands */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Why Choose Our Paint Services?
              </h2>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Brands We Carry
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand}
                    className="bg-white rounded-lg p-4 border border-neutral-200 text-center font-medium text-neutral-700"
                  >
                    {brand}
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-500 mt-4">
                And many more automotive paint and refinishing brands. Ask us
                about specific products!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Visit Us for Paint Services
            </h2>
            <p className="text-lg text-neutral-600">
              Both locations offer full paint mixing and color matching services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.values(LOCATIONS).map((location) => (
              <div
                key={location.id}
                className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {location.name}
                    </h3>
                    <p className="text-neutral-600 mb-3">{location.address}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>Mon-Fri 8am-5:30pm | Sat 9am-2pm</span>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={`tel:${
                          location.id === 1 ? "+15099728989" : "+15098658544"
                        }`}
                      >
                        <Button size="sm" variant="primary">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          location.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Bring your paint code or color sample to either location. Our experts
            will match it perfectly.
          </p>
          <Link href="/shop?category=paint">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-neutral-100"
            >
              Shop Paint Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
