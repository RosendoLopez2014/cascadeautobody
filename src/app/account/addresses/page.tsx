"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Home,
  Building,
  Check,
  Copy,
} from "lucide-react";
import { Button, Input, AddressAutocomplete } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

interface AddressData {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  phone?: string;
}

export default function AddressesPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState<"billing" | "shipping" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<"billing" | "shipping" | null>(null);

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "WA",
    postcode: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "WA",
    postcode: "",
  });

  // For autocomplete display
  const [billingAddressInput, setBillingAddressInput] = useState("");
  const [shippingAddressInput, setShippingAddressInput] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/account/addresses");
      return;
    }

    // Load user addresses
    if (user?.billing) {
      const billing = {
        firstName: user.billing.first_name || "",
        lastName: user.billing.last_name || "",
        company: user.billing.company || "",
        address1: user.billing.address_1 || "",
        address2: user.billing.address_2 || "",
        city: user.billing.city || "",
        state: user.billing.state || "WA",
        postcode: user.billing.postcode || "",
        phone: user.billing.phone || "",
      };
      setBillingAddress(billing);
      setBillingAddressInput(billing.address1);
    }

    if (user?.shipping) {
      const shipping = {
        firstName: user.shipping.first_name || "",
        lastName: user.shipping.last_name || "",
        company: user.shipping.company || "",
        address1: user.shipping.address_1 || "",
        address2: user.shipping.address_2 || "",
        city: user.shipping.city || "",
        state: user.shipping.state || "WA",
        postcode: user.shipping.postcode || "",
      };
      setShippingAddress(shipping);
      setShippingAddressInput(shipping.address1);
    }
  }, [isAuthenticated, user, router]);

  // Handle "Same as billing" toggle
  const handleSameAsBilling = useCallback((checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setShippingAddress({
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        company: billingAddress.company,
        address1: billingAddress.address1,
        address2: billingAddress.address2,
        city: billingAddress.city,
        state: billingAddress.state,
        postcode: billingAddress.postcode,
      });
      setShippingAddressInput(billingAddress.address1);
    }
  }, [billingAddress]);

  // Copy billing to shipping manually
  const copyBillingToShipping = () => {
    setShippingAddress({
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      company: billingAddress.company,
      address1: billingAddress.address1,
      address2: billingAddress.address2,
      city: billingAddress.city,
      state: billingAddress.state,
      postcode: billingAddress.postcode,
    });
    setShippingAddressInput(billingAddress.address1);
  };

  // Handle address autocomplete selection
  const handleBillingAddressSelect = useCallback((components: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
  }) => {
    setBillingAddress(prev => ({
      ...prev,
      address1: components.address1,
      address2: components.address2 || prev.address2,
      city: components.city,
      state: components.state,
      postcode: components.postcode,
    }));
  }, []);

  const handleShippingAddressSelect = useCallback((components: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
  }) => {
    setShippingAddress(prev => ({
      ...prev,
      address1: components.address1,
      address2: components.address2 || prev.address2,
      city: components.city,
      state: components.state,
      postcode: components.postcode,
    }));
    setSameAsBilling(false);
  }, []);

  const handleSave = async (type: "billing" | "shipping") => {
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const addressData = type === "billing" ? billingAddress : shippingAddress;

      const response = await fetch("/api/account/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          [type]: {
            first_name: addressData.firstName,
            last_name: addressData.lastName,
            company: addressData.company,
            address_1: addressData.address1,
            address_2: addressData.address2,
            city: addressData.city,
            state: addressData.state,
            postcode: addressData.postcode,
            country: "US",
            ...(type === "billing" ? { phone: billingAddress.phone } : {}),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        setIsEditing(null);
        setSaveSuccess(type);
        setTimeout(() => setSaveSuccess(null), 3000);
      }
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const renderBillingCard = () => {
    const isEditingBilling = isEditing === "billing";
    const hasAddress = billingAddress.address1;

    return (
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-neutral-900">Billing Address</h2>
          </div>
          <div className="flex items-center gap-2">
            {saveSuccess === "billing" && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            {!isEditingBilling && (
              <button
                onClick={() => setIsEditing("billing")}
                className="text-primary hover:text-primary-700 text-sm font-medium"
              >
                {hasAddress ? "Edit" : "Add"}
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {isEditingBilling ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={billingAddress.firstName}
                  onChange={(e) =>
                    setBillingAddress({ ...billingAddress, firstName: e.target.value })
                  }
                  required
                />
                <Input
                  label="Last Name"
                  value={billingAddress.lastName}
                  onChange={(e) =>
                    setBillingAddress({ ...billingAddress, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                label="Company (Optional)"
                value={billingAddress.company}
                onChange={(e) =>
                  setBillingAddress({ ...billingAddress, company: e.target.value })
                }
              />

              {/* Address Autocomplete */}
              <AddressAutocomplete
                label="Street Address"
                value={billingAddressInput}
                onChange={setBillingAddressInput}
                onAddressSelect={handleBillingAddressSelect}
                placeholder="Start typing your address..."
                required
              />

              <Input
                label="Apartment, suite, etc. (Optional)"
                value={billingAddress.address2}
                onChange={(e) =>
                  setBillingAddress({ ...billingAddress, address2: e.target.value })
                }
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={billingAddress.city}
                  onChange={(e) =>
                    setBillingAddress({ ...billingAddress, city: e.target.value })
                  }
                  required
                />
                <Input
                  label="State"
                  value={billingAddress.state}
                  onChange={(e) =>
                    setBillingAddress({ ...billingAddress, state: e.target.value })
                  }
                  required
                />
                <Input
                  label="ZIP Code"
                  value={billingAddress.postcode}
                  onChange={(e) =>
                    setBillingAddress({ ...billingAddress, postcode: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                label="Phone"
                type="tel"
                value={billingAddress.phone}
                onChange={(e) =>
                  setBillingAddress({ ...billingAddress, phone: e.target.value })
                }
              />
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => handleSave("billing")}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Address"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : hasAddress ? (
            <div className="text-neutral-600">
              <p className="font-medium text-neutral-900">
                {billingAddress.firstName} {billingAddress.lastName}
              </p>
              {billingAddress.company && <p>{billingAddress.company}</p>}
              <p>{billingAddress.address1}</p>
              {billingAddress.address2 && <p>{billingAddress.address2}</p>}
              <p>
                {billingAddress.city}, {billingAddress.state} {billingAddress.postcode}
              </p>
              {billingAddress.phone && <p className="mt-2">{billingAddress.phone}</p>}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm">No address saved</p>
          )}
        </div>
      </div>
    );
  };

  const renderShippingCard = () => {
    const isEditingShipping = isEditing === "shipping";
    const hasAddress = shippingAddress.address1;
    const hasBillingAddress = billingAddress.address1;

    return (
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-neutral-900">Shipping Address</h2>
          </div>
          <div className="flex items-center gap-2">
            {saveSuccess === "shipping" && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            {!isEditingShipping && (
              <button
                onClick={() => setIsEditing("shipping")}
                className="text-primary hover:text-primary-700 text-sm font-medium"
              >
                {hasAddress ? "Edit" : "Add"}
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {isEditingShipping ? (
            <div className="space-y-4">
              {/* Same as Billing Checkbox */}
              {hasBillingAddress && (
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => handleSameAsBilling(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-primary-900">
                      Same as billing address
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={copyBillingToShipping}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary-700"
                  >
                    <Copy className="h-4 w-4" />
                    Copy from billing
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={shippingAddress.firstName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                  }
                  disabled={sameAsBilling}
                  required
                />
                <Input
                  label="Last Name"
                  value={shippingAddress.lastName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                  }
                  disabled={sameAsBilling}
                  required
                />
              </div>
              <Input
                label="Company (Optional)"
                value={shippingAddress.company}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, company: e.target.value })
                }
                disabled={sameAsBilling}
              />

              {/* Address Autocomplete */}
              {sameAsBilling ? (
                <Input
                  label="Street Address"
                  value={shippingAddress.address1}
                  onChange={() => {}}
                  disabled
                  required
                />
              ) : (
                <AddressAutocomplete
                  label="Street Address"
                  value={shippingAddressInput}
                  onChange={setShippingAddressInput}
                  onAddressSelect={handleShippingAddressSelect}
                  placeholder="Start typing your address..."
                  required
                />
              )}

              <Input
                label="Apartment, suite, etc. (Optional)"
                value={shippingAddress.address2}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, address2: e.target.value })
                }
                disabled={sameAsBilling}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  disabled={sameAsBilling}
                  required
                />
                <Input
                  label="State"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  disabled={sameAsBilling}
                  required
                />
                <Input
                  label="ZIP Code"
                  value={shippingAddress.postcode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postcode: e.target.value })
                  }
                  disabled={sameAsBilling}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => handleSave("shipping")}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Address"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(null);
                    setSameAsBilling(false);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : hasAddress ? (
            <div className="text-neutral-600">
              <p className="font-medium text-neutral-900">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              {shippingAddress.company && <p>{shippingAddress.company}</p>}
              <p>{shippingAddress.address1}</p>
              {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postcode}
              </p>
            </div>
          ) : (
            <p className="text-neutral-500 text-sm">No address saved</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/account"
          className="flex items-center text-neutral-600 hover:text-primary mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Account
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900">Addresses</h1>
        <p className="text-neutral-600 mt-1">
          Manage your billing and shipping addresses
        </p>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {renderBillingCard()}
        {renderShippingCard()}
      </div>

      {/* Help Text */}
      <div className="mt-6 max-w-4xl">
        <p className="text-sm text-neutral-500">
          Start typing your address in the street address field to see suggestions
          from Google. Select an address to auto-fill the city, state, and ZIP code.
        </p>
      </div>
    </div>
  );
}
