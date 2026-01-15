"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import { useLocationStore, LocationId } from "@/stores/locationStore";
import { LOCATIONS } from "@/lib/woocommerce";

export function StoreSelector() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLocationId, setLocation } = useLocationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLocation = selectedLocationId === 1 ? LOCATIONS.YAKIMA : LOCATIONS.TOPPENISH;

  const handleSelect = (id: LocationId) => {
    setLocation(id);
    setIsOpen(false);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-sm">
        <MapPin className="h-3.5 w-3.5" />
        <span>Select Store</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MapPin className="h-3.5 w-3.5 text-secondary" />
        <span className="font-medium">{currentLocation.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="text-xs text-neutral-500 px-3 py-2 font-medium uppercase tracking-wide">
                Select Your Store
              </p>

              {/* Yakima */}
              <button
                onClick={() => handleSelect(1)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                  selectedLocationId === 1
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-neutral-100 text-neutral-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      selectedLocationId === 1 ? "text-primary" : "text-neutral-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{LOCATIONS.YAKIMA.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {LOCATIONS.YAKIMA.address}
                    </p>
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Full inventory available
                    </p>
                  </div>
                </div>
              </button>

              {/* Toppenish */}
              <button
                onClick={() => handleSelect(2)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                  selectedLocationId === 2
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-neutral-100 text-neutral-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      selectedLocationId === 2 ? "text-primary" : "text-neutral-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{LOCATIONS.TOPPENISH.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {LOCATIONS.TOPPENISH.address}
                    </p>
                    <p className="text-xs text-amber-600 mt-1 font-medium">
                      Call for availability
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
