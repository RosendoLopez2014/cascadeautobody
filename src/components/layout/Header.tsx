"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, User, Phone } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { StoreSelector } from "./StoreSelector";
import { CartDrawer } from "@/components/cart";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white border-b border-neutral-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Top bar */}
      <div className="bg-neutral-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            {/* Store Selector */}
            <StoreSelector />

            {/* Phone Numbers */}
            <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-4">
              <motion.a
                href="tel:+15099728989"
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
                whileHover={{ x: 2 }}
              >
                <Phone className="h-3 w-3" />
                <span className="text-neutral-400">Yakima</span> (509) 972-8989
              </motion.a>
              <motion.a
                href="tel:+15098658544"
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
                whileHover={{ x: 2 }}
              >
                <span className="text-neutral-400">Toppenish</span> (509) 865-8544
              </motion.a>
            </div>
          </div>
          <div className="hidden sm:block text-neutral-400">
            Mon-Fri 8am-5:30pm | Sat 9am-2pm
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/logo.png"
                alt="Cascade Autobody & Paint Supply"
                width={180}
                height={50}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search toggle */}
            <motion.button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-600 hover:text-primary transition-colors rounded-full hover:bg-neutral-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Account */}
            <Link href="/account" className="hidden sm:flex">
              <motion.div
                className="p-2 text-neutral-600 hover:text-primary transition-colors rounded-full hover:bg-neutral-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5" />
              </motion.div>
            </Link>

            {/* Cart */}
            <motion.button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-neutral-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-neutral-600 hover:text-primary transition-colors" />
              <AnimatePresence mode="wait">
                {mounted && itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                    className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 rounded-full hover:bg-neutral-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search bar (expandable) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="border-t border-neutral-200 overflow-hidden"
          >
            <div className="py-4">
              <div className="container mx-auto px-4">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Cart drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </motion.header>
  );
}
