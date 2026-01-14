"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=paint", label: "Paint" },
  { href: "/shop?category=body", label: "Body Supplies" },
  { href: "/shop?category=tools", label: "Tools" },
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
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "text-primary bg-primary-50"
                : "text-neutral-600 hover:text-primary hover:bg-neutral-50"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
