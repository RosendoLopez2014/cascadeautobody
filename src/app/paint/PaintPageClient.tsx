"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

export function PaintPageClient() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary-700 to-secondary-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.9, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <FadeIn delay={0}>
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Palette className="h-8 w-8" />
                </motion.div>
                <span className="text-secondary-200 font-medium">
                  Professional Paint Services
                </span>
              </div>
            </FadeIn>

            <TextReveal
              text="Expert Paint Mixing & Color Matching"
              as="h1"
              className="text-display-sm md:text-display-md lg:text-display-lg font-bold mb-6"
              delay={0.1}
            />

            <FadeIn delay={0.4} direction="up">
              <p className="text-xl text-secondary-100 mb-8 max-w-2xl">
                Get perfect color matches and custom paint mixing at both of our
                locations. Our trained technicians use state-of-the-art equipment to
                ensure your project looks factory-fresh.
              </p>
            </FadeIn>

            <FadeIn delay={0.5} direction="up">
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton strength={0.2}>
                  <a href="tel:+15099728989">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="bg-white text-secondary-600 hover:bg-neutral-100 font-semibold"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call for Quote
                    </Button>
                  </a>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <Link href="/shop?category=paint">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="text-white border-2 border-white hover:bg-white/10"
                    >
                      Browse Paint Products
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Equipment Section - Challenger by Axalta */}
      <section className="py-20 bg-neutral-900 text-white relative overflow-hidden">
        <div className="noise-overlay" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn direction="left">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="p-2 bg-secondary/20 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Cpu className="h-6 w-6 text-secondary-400" />
                  </motion.div>
                  <span className="text-secondary-400 font-medium uppercase tracking-wider text-sm">
                    Our Equipment
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.1} direction="left">
                <h2 className="text-display-xs md:text-display-sm font-bold mb-4">
                  Challenger by Axalta
                </h2>
              </FadeIn>

              <FadeIn delay={0.2} direction="left">
                <p className="text-lg text-neutral-300 mb-8">
                  We use the industry-leading Challenger paint mixing system by Axalta -
                  the same technology trusted by dealerships and professional body shops
                  worldwide. This advanced system ensures precise color matching and
                  consistent results every time.
                </p>
              </FadeIn>

              <StaggerContainer className="space-y-3 mb-8" staggerDelay={0.08}>
                {equipmentFeatures.map((feature) => (
                  <StaggerItem key={feature}>
                    <motion.div
                      className="flex items-start gap-3 group"
                      whileHover={{ x: 4 }}
                    >
                      <Sparkles className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-neutral-200">{feature}</span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.5} direction="left">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="h-12 px-4 bg-white/10 rounded-lg flex items-center"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <span className="text-lg font-bold tracking-tight">AXALTA</span>
                  </motion.div>
                  <span className="text-neutral-400">Authorized Dealer</span>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.3} direction="right">
              <div className="relative">
                <motion.div
                  className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl border border-neutral-700 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center p-8">
                    <motion.div
                      className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                      <Palette className="h-16 w-16 text-secondary-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Precision Mixing</h3>
                    <p className="text-neutral-400">
                      State-of-the-art color matching technology
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 bg-secondary px-6 py-3 rounded-xl shadow-lg"
                  initial={{ scale: 0, rotate: -12 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="font-bold text-lg">99% Match Rate</span>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Interactive Color Swatches */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-display-xs md:text-display-sm font-bold text-neutral-900 mb-4">
                Explore Our Paint Brands
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We carry premium paint lines to match any project. Click on colors
                to see details and find your perfect match.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <ColorSwatches />
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-display-xs md:text-display-sm font-bold text-neutral-900 mb-4">
                Our Paint Services
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                From simple touch-ups to complete refinishing systems, we have the
                products and expertise to get the job done right.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <StaggerItem key={service.title}>
                  <HoverLift lift={6}>
                    <motion.div
                      className="bg-white rounded-2xl p-6 border border-neutral-200 h-full"
                      whileHover={{ borderColor: "rgb(220, 38, 38)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="p-3 bg-secondary-100 rounded-xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="h-6 w-6 text-secondary" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                            {service.title}
                          </h3>
                          <p className="text-neutral-600">{service.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="text-display-xs font-bold text-neutral-900 mb-10 text-center">
                Why Choose Our Paint Services?
              </h2>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4" staggerDelay={0.08}>
              {features.map((feature) => (
                <StaggerItem key={feature}>
                  <motion.div
                    className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl"
                    whileHover={{ scale: 1.02, backgroundColor: "rgb(254, 242, 242)" }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <span className="text-neutral-700">{feature}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-display-xs md:text-display-sm font-bold text-neutral-900 mb-4">
                Visit Us for Paint Services
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-neutral-600">
                Both locations offer full paint mixing and color matching services.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.values(LOCATIONS).map((location, index) => (
              <FadeIn key={location.id} delay={0.2 + index * 0.1} direction={index === 0 ? "left" : "right"}>
                <HoverLift lift={8}>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200 h-full">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="p-3 bg-primary-100 rounded-xl"
                        whileHover={{ scale: 1.1 }}
                      >
                        <MapPin className="h-6 w-6 text-primary" />
                      </motion.div>
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
                          <motion.a
                            href={`tel:${location.id === 1 ? "+15099728989" : "+15098658544"}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="sm" variant="primary">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </motion.a>
                          <motion.a
                            href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="sm" variant="outline">
                              Directions
                            </Button>
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverLift>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 100%" }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h2 className="text-display-xs font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Bring your paint code or color sample to either location.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <MagneticButton strength={0.2}>
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="ghost"
                  className="bg-white text-primary hover:bg-neutral-100"
                >
                  Shop Paint Products
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </MagneticButton>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
