"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface AddressComponents {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface AddressAutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressComponents) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initGoogleMaps: () => void;
  }
}

export function AddressAutocomplete({
  label,
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing an address...",
  required = false,
  disabled = false,
  className = "",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);
  const [isLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn("Google Maps API key not configured");
      return;
    }

    if (window.google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsGoogleLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || autocompleteRef.current) {
      return;
    }

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "us" },
          fields: ["address_components", "formatted_address"],
          types: ["address"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place?.address_components) {
          return;
        }

        const addressComponents = parseAddressComponents(place.address_components);
        onAddressSelect(addressComponents);
        onChange(place.formatted_address || "");
      });
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }
  }, [isGoogleLoaded, onAddressSelect, onChange]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseAddressComponents = (components: any[]): AddressComponents => {
    const result: AddressComponents = {
      address1: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "US",
    };

    let streetNumber = "";
    let route = "";

    for (const component of components) {
      const type = component.types[0];

      switch (type) {
        case "street_number":
          streetNumber = component.long_name;
          break;
        case "route":
          route = component.long_name;
          break;
        case "subpremise":
          result.address2 = component.long_name;
          break;
        case "locality":
          result.city = component.long_name;
          break;
        case "administrative_area_level_1":
          result.state = component.short_name;
          break;
        case "postal_code":
          result.postcode = component.long_name;
          break;
        case "country":
          result.country = component.short_name;
          break;
      }
    }

    result.address1 = `${streetNumber} ${route}`.trim();

    return result;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 animate-spin" />
        )}
      </div>
      {!isGoogleLoaded && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <p className="text-xs text-neutral-500 mt-1">
          Loading address suggestions...
        </p>
      )}
    </div>
  );
}
