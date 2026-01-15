"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Package, LogIn } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/paint", label: "Paint Services" },
  { href: "/about", label: "About" },
];

const accountItems = [
  { href: "/account", label: "My Account", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/login", label: "Sign In", icon: LogIn },
];

const menuVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
      when: "afterChildren" as const,
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  closed: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lg:hidden border-t border-neutral-200 bg-white overflow-hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
        >
          <nav className="container mx-auto px-4 py-4">
            {/* Main navigation */}
            <motion.div className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href.split("?")[0]));

                return (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "block px-4 py-3 text-base font-medium rounded-xl transition-all",
                        isActive
                          ? "text-primary bg-primary-50"
                          : "text-neutral-600 hover:text-primary hover:bg-neutral-50"
                      )}
                    >
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="inline-block"
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Divider */}
            <motion.div
              className="my-4 border-t border-neutral-200"
              variants={itemVariants}
            />

            {/* Account section */}
            <motion.div className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-neutral-600 hover:text-primary hover:bg-neutral-50 rounded-xl transition-all"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="inline-block"
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
