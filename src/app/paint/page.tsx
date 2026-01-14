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
  Cpu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";
import { LOCATIONS } from "@/lib/woocommerce";
import { ColorSwatches } from "@/components/paint/ColorSwatches";

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

const equipmentFeatures = [
  "Spectrophotometer color matching for 99% accuracy",
  "Digital formula retrieval from OEM databases",
  "Automatic tinting and mixing",
  "Real-time color verification",
  "Custom formula storage for repeat orders",
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
        <div className="container mx-auto px-4 py-16 md:py-20">
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
                  className="bg-white text-secondary-600 hover:bg-neutral-100 font-semibold"
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

      {/* Equipment Section - Challenger by Axalta */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Cpu className="h-6 w-6 text-secondary-400" />
                </div>
                <span className="text-secondary-400 font-medium uppercase tracking-wider text-sm">
                  Our Equipment
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Challenger by Axalta
              </h2>
              <p className="text-lg text-neutral-300 mb-6">
                We use the industry-leading Challenger paint mixing system by Axalta -
                the same technology trusted by dealerships and professional body shops
                worldwide. This advanced system ensures precise color matching and
                consistent results every time.
              </p>
              <ul className="space-y-3 mb-8">
                {equipmentFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-200">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <div className="h-12 px-4 bg-white/10 rounded-lg flex items-center">
                  <span className="text-lg font-bold tracking-tight">AXALTA</span>
                </div>
                <span className="text-neutral-400">Authorized Dealer</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full flex items-center justify-center">
                    <Palette className="h-16 w-16 text-secondary-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Precision Mixing</h3>
                  <p className="text-neutral-400">
                    State-of-the-art color matching technology
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-secondary px-4 py-2 rounded-lg">
                <span className="font-bold">99% Match Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Color Swatches */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Explore Our Paint Brands
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We carry premium paint lines to match any project. Click on colors
              to see details and find your perfect match.
            </p>
          </div>
          <ColorSwatches />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-neutral-50">
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
                  className="bg-white rounded-lg p-6 border border-neutral-200 hover:shadow-lg transition-shadow"
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

      {/* Features List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
              Why Choose Our Paint Services?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-neutral-50">
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
                className="bg-white rounded-lg p-6 border border-neutral-200"
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
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
            Bring your paint code or color sample to either location.
          </p>
          <Link href="/shop">
            <Button
              size="lg"
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
