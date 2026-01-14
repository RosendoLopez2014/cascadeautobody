"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/paint", label: "Paint Services" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname?.startsWith(item.href.split("?")[0]));

        return (
          <Link key={item.href} href={item.href} className="relative">
            <motion.div
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-neutral-600 hover:text-primary"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-primary-50 rounded-lg -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
