"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Package, LogIn } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=paint", label: "Paint" },
  { href: "/shop?category=body", label: "Body Supplies" },
  { href: "/shop?category=tools", label: "Tools" },
  { href: "/paint", label: "Paint Services" },
  { href: "/about", label: "About Us" },
];

const accountItems = [
  { href: "/account", label: "My Account", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/login", label: "Sign In", icon: LogIn },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-neutral-200 bg-white">
      <nav className="container mx-auto px-4 py-4">
        {/* Main navigation */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href.split("?")[0]));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                  isActive
                    ? "text-primary bg-primary-50"
                    : "text-neutral-600 hover:text-primary hover:bg-neutral-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-200" />

        {/* Account section */}
        <div className="space-y-1">
          {accountItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary hover:bg-neutral-50 rounded-md transition-colors"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
