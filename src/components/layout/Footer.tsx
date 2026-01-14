import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const locations = [
  {
    name: "Yakima",
    address: "916 North 28th Ave, Suite A",
    city: "Yakima, WA 98902",
    phone: "(509) 972-8989",
    mapUrl: "https://maps.google.com/?q=916+North+28th+Ave+Suite+A+Yakima+WA",
  },
  {
    name: "Toppenish",
    address: "216 S Beech St",
    city: "Toppenish, WA 98948",
    phone: "(509) 865-8544",
    mapUrl: "https://maps.google.com/?q=216+S+Beech+St+Toppenish+WA",
  },
];

const quickLinks = [
  { href: "/shop", label: "Shop All Products" },
  { href: "/paint", label: "Paint Services" },
  { href: "/account/business", label: "Business Accounts" },
  { href: "/about", label: "About Us" },
];

const customerService = [
  { href: "/account", label: "My Account" },
  { href: "/account/orders", label: "Order History" },
  { href: "/cart", label: "Shopping Cart" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Locations */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4">
              Our Locations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {locations.map((location) => (
                <div key={location.name}>
                  <h4 className="text-white font-medium mb-2">{location.name}</h4>
                  <div className="space-y-2 text-sm">
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 hover:text-white transition-colors"
                    >
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {location.address}
                        <br />
                        {location.city}
                      </span>
                    </a>
                    <a
                      href={`tel:${location.phone.replace(/[^0-9]/g, "")}`}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {location.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-2 text-sm">
              <Clock className="h-4 w-4 mt-0.5" />
              <div>
                <span className="text-white font-medium">Hours: </span>
                Mon-Fri 8am-5:30pm | Sat 9am-2pm | Sun Closed
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <a
                href="mailto:info@cascadeautobodyandpaint.com"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} Cascade Autobody & Paint Supply. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
