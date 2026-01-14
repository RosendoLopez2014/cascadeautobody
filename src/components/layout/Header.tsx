"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Search, User, Phone } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { CartDrawer } from "@/components/cart";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
      {/* Top bar - minimal style */}
      <div className="bg-neutral-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:+15099728989"
              className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline text-neutral-400">Yakima</span> (509) 972-8989
            </a>
            <a
              href="tel:+15098658544"
              className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
            >
              <span className="hidden sm:inline text-neutral-400">Toppenish</span> (509) 865-8544
            </a>
          </div>
          <div className="hidden sm:block text-neutral-400">
            Mon-Fri 8am-5:30pm | Sat 9am-2pm
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Modern minimal */}
          <Link href="/" className="flex-shrink-0 group">
            <span className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors">
              CASCADE
            </span>
            <span className="hidden md:inline text-sm text-neutral-400 ml-2 font-normal">
              Autobody & Paint
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-600 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex p-2 text-neutral-600 hover:text-primary transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-neutral-600 hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar (expandable) */}
      {searchOpen && (
        <div className="border-t border-neutral-200 py-4">
          <div className="container mx-auto px-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Cart drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
