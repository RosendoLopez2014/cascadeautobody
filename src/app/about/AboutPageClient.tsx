"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Building,
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

const stats = [
  { value: "30+", label: "Years in Business" },
  { value: "2", label: "Locations" },
  { value: "1000+", label: "Products" },
  { value: "99%", label: "Customer Satisfaction" },
];

export function AboutPageClient() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl">
            <FadeIn delay={0}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <Building className="h-4 w-4" />
                <span>Serving Yakima Valley Since 1990</span>
              </motion.div>
            </FadeIn>

            <TextReveal
              text="Your Local Auto Body Supply Experts"
              as="h1"
              className="text-display-sm md:text-display-md lg:text-display-lg font-bold mb-6"
              delay={0.1}
            />

            <FadeIn delay={0.4} direction="up">
              <p className="text-xl text-primary-100 mb-10 max-w-2xl">
                For over 30 years, Cascade Autobody & Paint Supply has been the
                trusted source for professional auto body supplies in the Yakima
                Valley. We&apos;re proud to serve collision repair shops, body shops, and
                DIY enthusiasts with quality products and expert advice.
              </p>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.5} direction="up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <motion.span
                      className="block text-3xl md:text-4xl font-bold mb-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        delay: 0.7 + index * 0.1,
                      }}
                    >
                      {stat.value}
                    </motion.span>
                    <span className="text-sm text-primary-200">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-display-xs md:text-display-sm font-bold text-neutral-900 mb-6">
                Our Story
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                What started as a small paint supply shop in Yakima has grown into
                the region&apos;s premier destination for auto body supplies. With two
                convenient locations in Yakima and Toppenish, we&apos;re committed to
                providing our community with the best products, expert knowledge,
                and outstanding customer service.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Whether you&apos;re a professional technician working on collision
                repairs or a car enthusiast restoring a classic, our experienced
                team is here to help you get the job done right.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-display-xs md:text-display-sm font-bold text-neutral-900 mb-4">
                Our Values
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                These principles guide everything we do at Cascade Autobody & Paint
                Supply.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <HoverLift lift={8}>
                    <motion.div
                      className="bg-white rounded-2xl p-6 border border-neutral-200 text-center h-full"
                      whileHover={{ borderColor: "rgb(24, 24, 27)" }}
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-neutral-600">{value.description}</p>
                    </motion.div>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-display-xs md:text-display-sm font-bold text-neutral-900 mb-4">
                Our Locations
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Visit us at either of our convenient Yakima Valley locations.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Object.values(LOCATIONS).map((location, index) => (
              <FadeIn key={location.id} delay={0.2 + index * 0.15} direction={index === 0 ? "left" : "right"}>
                <HoverLift lift={10}>
                  <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
                    {/* Map placeholder */}
                    <motion.div
                      className="h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center relative"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-center text-neutral-500">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <MapPin className="h-12 w-12 mx-auto mb-2" />
                        </motion.div>
                        <p className="text-sm font-medium">View on Map</p>
                      </div>
                    </motion.div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-neutral-900 mb-4">
                        {location.name} Store
                      </h3>

                      <div className="space-y-3 mb-6">
                        <motion.div
                          className="flex items-start gap-3"
                          whileHover={{ x: 4 }}
                        >
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-neutral-600">{location.address}</p>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-3"
                          whileHover={{ x: 4 }}
                        >
                          <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                          <a
                            href={`tel:${location.id === 1 ? "+15099728989" : "+15098658544"}`}
                            className="text-neutral-600 hover:text-primary transition-colors"
                          >
                            {location.id === 1 ? "(509) 972-8989" : "(509) 865-8544"}
                          </a>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-3"
                          whileHover={{ x: 4 }}
                        >
                          <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                          <a
                            href="mailto:info@cascadeautobody.com"
                            className="text-neutral-600 hover:text-primary transition-colors"
                          >
                            info@cascadeautobody.com
                          </a>
                        </motion.div>
                        <motion.div
                          className="flex items-start gap-3"
                          whileHover={{ x: 4 }}
                        >
                          <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="text-neutral-600 text-sm">
                            <p>Monday - Friday: 8:00 AM - 5:30 PM</p>
                            <p>Saturday: 9:00 AM - 2:00 PM</p>
                            <p>Sunday: Closed</p>
                          </div>
                        </motion.div>
                      </div>

                      <div className="flex gap-3">
                        <motion.a
                          href={`tel:${location.id === 1 ? "+15099728989" : "+15098658544"}`}
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button className="w-full">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </Button>
                        </motion.a>
                        <motion.a
                          href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button variant="outline" className="w-full">
                            Get Directions
                          </Button>
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </HoverLift>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-display-xs md:text-display-sm font-bold text-neutral-900 mb-4">
                Meet Our Team
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Our knowledgeable staff is here to help you find the right products
                for your project.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <FadeIn key={member.role} delay={0.2 + index * 0.1} direction="up">
                <HoverLift lift={6}>
                  <motion.div
                    className="bg-white rounded-2xl p-8 border border-neutral-200 text-center"
                    whileHover={{ borderColor: "rgb(220, 38, 38)" }}
                  >
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Users className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-neutral-900">
                      {member.name}
                    </h3>
                    <p className="text-secondary font-semibold mb-3">{member.role}</p>
                    <p className="text-neutral-600">{member.description}</p>
                  </motion.div>
                </HoverLift>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-secondary-700 to-secondary"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 100%" }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h2 className="text-display-xs md:text-display-sm font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-secondary-100 mb-8 max-w-2xl mx-auto">
              Browse our selection of professional auto body supplies or visit one
              of our locations today.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton strength={0.2}>
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
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <Link href="/paint">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white/10"
                  >
                    Paint Services
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
