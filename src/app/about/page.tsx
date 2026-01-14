import { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  Truck,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { LOCATIONS } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Cascade Autobody & Paint Supply - your trusted source for professional auto body supplies in Yakima and Toppenish, Washington.",
};

const values = [
  {
    icon: Users,
    title: "Customer First",
    description:
      "We build lasting relationships with our customers through exceptional service and expert advice.",
  },
  {
    icon: Award,
    title: "Quality Products",
    description:
      "We stock only professional-grade products from trusted brands that meet the highest standards.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Same-day local delivery and quick shipping to keep your projects moving forward.",
  },
  {
    icon: Heart,
    title: "Community Focused",
    description:
      "Proudly serving the Yakima Valley community for over 30 years.",
  },
];

const team = [
  {
    name: "Store Team",
    role: "Yakima Location",
    description:
      "Our Yakima team brings decades of combined experience in automotive refinishing.",
  },
  {
    name: "Store Team",
    role: "Toppenish Location",
    description:
      "Our Toppenish team specializes in serving both retail customers and professional shops.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Local Auto Body Supply Experts
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              For over 30 years, Cascade Autobody & Paint Supply has been the
              trusted source for professional auto body supplies in the Yakima
              Valley. We&apos;re proud to serve collision repair shops, body shops, and
              DIY enthusiasts with quality products and expert advice.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              What started as a small paint supply shop in Yakima has grown into
              the region&apos;s premier destination for auto body supplies. With two
              convenient locations in Yakima and Toppenish, we&apos;re committed to
              providing our community with the best products, expert knowledge,
              and outstanding customer service.
            </p>
            <p className="text-lg text-neutral-600">
              Whether you&apos;re a professional technician working on collision
              repairs or a car enthusiast restoring a classic, our experienced
              team is here to help you get the job done right.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              These principles guide everything we do at Cascade Autobody & Paint
              Supply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-lg p-6 border border-neutral-200 text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Our Locations
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Visit us at either of our convenient Yakima Valley locations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Object.values(LOCATIONS).map((location) => (
              <div
                key={location.id}
                className="bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200"
              >
                {/* Map placeholder */}
                <div className="h-48 bg-neutral-200 flex items-center justify-center">
                  <div className="text-center text-neutral-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Map View</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {location.name} Store
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-neutral-600">{location.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <a
                        href={`tel:${
                          location.id === 1 ? "+15099728989" : "+15098658544"
                        }`}
                        className="text-neutral-600 hover:text-primary"
                      >
                        {location.id === 1
                          ? "(509) 972-8989"
                          : "(509) 865-8544"}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <a
                        href="mailto:info@cascadeautobody.com"
                        className="text-neutral-600 hover:text-primary"
                      >
                        info@cascadeautobody.com
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-neutral-600">
                        <p>Monday - Friday: 8:00 AM - 5:30 PM</p>
                        <p>Saturday: 9:00 AM - 2:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={`tel:${
                        location.id === 1 ? "+15099728989" : "+15098658544"
                      }`}
                      className="flex-1"
                    >
                      <Button className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        location.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        Get Directions
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our knowledgeable staff is here to help you find the right products
              for your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div
                key={member.role}
                className="bg-white rounded-lg p-6 border border-neutral-200 text-center"
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-neutral-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-secondary-100 mb-8 max-w-2xl mx-auto">
            Browse our selection of professional auto body supplies or visit one
            of our locations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-secondary hover:bg-neutral-100"
              >
                Shop Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/paint">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
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
