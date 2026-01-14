"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Palette,
  ShoppingBag,
  Wrench,
  Package,
  Car,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";
import { LOCATIONS } from "@/lib/woocommerce";
import {
  FadeIn,
  TextReveal,
  StaggerContainer,
  StaggerItem,
  HoverLift,
  MagneticButton,
} from "@/components/motion";

const services = [
  {
    icon: Car,
    title: "Auto Body Parts",
    description: "Bumpers, fenders, hoods & more",
  },
  {
    icon: Palette,
    title: "Paint & Coatings",
    description: "Custom mixing on-site",
  },
  {
    icon: Wrench,
    title: "Tools & Equipment",
    description: "Professional grade",
  },
  {
    icon: Package,
    title: "Shop Supplies",
    description: "Abrasives, tape, PPE",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="flex-1 relative bg-neutral-900 text-white">
        {/* Animated gradient background */}
        <div className="absolute inset-0 gradient-animated opacity-50" />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 right-[10%] w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-[5%] w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Noise texture overlay */}
        <div className="noise-overlay" />

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left - Company Info (7 cols for asymmetry) */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <FadeIn delay={0}>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>Yakima Valley&apos;s Premier Supplier</span>
                </motion.div>
              </FadeIn>

              {/* Main Headline */}
              <TextReveal
                text="Cascade Autobody"
                as="h1"
                className="text-display-md md:text-display-lg lg:text-display-xl font-bold mb-2"
                delay={0.1}
              />
              <FadeIn delay={0.4} direction="up">
                <span className="block text-display-xs md:text-display-sm text-neutral-400 mb-6">
                  & Paint Supply
                </span>
              </FadeIn>

              <FadeIn delay={0.5} direction="up">
                <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-xl leading-relaxed">
                  Professional-grade products for collision repair, refinishing,
                  and restoration. Same-day availability at two convenient locations.
                </p>
              </FadeIn>

              {/* CTA Buttons */}
              <FadeIn delay={0.6} direction="up">
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <MagneticButton strength={0.2}>
                    <Link href="/shop">
                      <Button
                        size="lg"
                        variant="ghost"
                        className="bg-white text-neutral-900 hover:bg-neutral-100 w-full sm:w-auto text-base px-8 btn-glow"
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Shop Products
                      </Button>
                    </Link>
                  </MagneticButton>
                  <MagneticButton strength={0.2}>
                    <Link href="/paint">
                      <Button
                        size="lg"
                        className="bg-secondary hover:bg-secondary-600 w-full sm:w-auto text-base px-8"
                      >
                        <Palette className="mr-2 h-5 w-5" />
                        Paint Services
                      </Button>
                    </Link>
                  </MagneticButton>
                </div>
              </FadeIn>

              {/* Services Grid */}
              <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.08}>
                {services.map((service) => (
                  <StaggerItem key={service.title}>
                    <motion.div
                      className="glass-card-dark rounded-xl p-5 cursor-default"
                      whileHover={{
                        scale: 1.02,
                        borderColor: "rgba(255,255,255,0.2)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/20 rounded-lg">
                          <service.icon className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-semibold mb-1">{service.title}</p>
                          <p className="text-neutral-400 text-sm">{service.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Right - Locations (5 cols for asymmetry) */}
            <div className="lg:col-span-5">
              <FadeIn delay={0.3} direction="right">
                <h2 className="text-sm font-semibold text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-secondary" />
                  Our Locations
                </h2>
              </FadeIn>

              <div className="space-y-4">
                {Object.values(LOCATIONS).map((location, index) => (
                  <FadeIn key={location.id} delay={0.4 + index * 0.15} direction="right">
                    <HoverLift lift={6}>
                      <div className="glass-card-dark rounded-2xl p-6 group">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1 group-hover:text-secondary transition-colors">
                              {location.name}
                            </h3>
                            <div className="flex items-center gap-2 text-neutral-400 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{location.address}</span>
                            </div>
                          </div>
                          <motion.div
                            className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            {index === 0 ? "Main Store" : "Branch"}
                          </motion.div>
                        </div>

                        <div className="flex items-center gap-2 text-neutral-400 text-sm mb-5">
                          <Clock className="h-4 w-4" />
                          <span>Mon-Fri 8am-5:30pm | Sat 9am-2pm</span>
                        </div>

                        <div className="flex gap-3">
                          <motion.a
                            href={`tel:${index === 0 ? "+15099728989" : "+15098658544"}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              {index === 0 ? "(509) 972-8989" : "(509) 865-8544"}
                            </Button>
                          </motion.a>
                          <motion.a
                            href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                              Directions
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </motion.a>
                        </div>
                      </div>
                    </HoverLift>
                  </FadeIn>
                ))}

                {/* Business Account CTA */}
                <FadeIn delay={0.7} direction="right">
                  <motion.div
                    className="relative overflow-hidden rounded-2xl p-6 border border-secondary/30"
                    whileHover={{ borderColor: "rgba(220, 38, 38, 0.5)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-secondary/10 to-secondary/20"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ backgroundSize: "200% 100%" }}
                    />
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-2">Business Account</h3>
                      <p className="text-sm text-neutral-300 mb-4">
                        Wholesale pricing, credit terms, and dedicated support for shops.
                      </p>
                      <MagneticButton strength={0.15}>
                        <Link href="/account/business">
                          <Button size="sm" className="bg-secondary hover:bg-secondary-600">
                            Apply Now
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </MagneticButton>
                    </div>
                  </motion.div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
