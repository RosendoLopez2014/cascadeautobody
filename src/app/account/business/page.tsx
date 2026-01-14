"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Building,
  Percent,
  CreditCard,
  Users,
  CheckCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

const benefits = [
  {
    icon: Percent,
    title: "Wholesale Pricing",
    description: "Get discounted pricing on all products with volume-based tiers.",
  },
  {
    icon: CreditCard,
    title: "Net-30 Credit Terms",
    description:
      "Qualified businesses can access credit terms with no interest for 30 days.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Priority access to our team with a dedicated account manager.",
  },
  {
    icon: Building,
    title: "Tax Exemption",
    description:
      "Eligible businesses can shop tax-free with proper documentation.",
  },
];

export default function BusinessAccountPage() {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    taxId: "",
    yearsInBusiness: "",
    contactName: user ? `${user.first_name} ${user.last_name}` : "",
    contactEmail: user?.email || "",
    contactPhone: user?.billing?.phone || "",
    address: "",
    city: "",
    state: "WA",
    zipCode: "",
    estimatedMonthlySpend: "",
    references: "",
    additionalInfo: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would submit to an API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Application Submitted!
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Thank you for your interest in a business account. Our team will
            review your application and contact you within 1-2 business days.
          </p>
          <div className="bg-neutral-50 rounded-lg p-6 mb-8">
            <p className="text-neutral-700 mb-2">
              <strong>Questions?</strong> Contact us at:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15099728989"
                className="text-primary hover:underline font-medium"
              >
                (509) 972-8989
              </a>
              <a
                href="mailto:business@cascadeautobody.com"
                className="text-primary hover:underline font-medium"
              >
                business@cascadeautobody.com
              </a>
            </div>
          </div>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-neutral-900">
          Apply for a Business Account
        </h1>
        <p className="text-neutral-600 mt-1">
          Unlock wholesale pricing, credit terms, and dedicated support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Benefits */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-primary-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-primary-900 mb-4">
              Business Account Benefits
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex gap-3">
                    <div className="p-2 bg-white rounded-lg flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-900">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-primary-700">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-primary-200">
              <p className="text-sm text-primary-800 mb-3">
                <strong>Need help?</strong> Our team is here to assist.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="tel:+15099728989"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-900"
                >
                  <Phone className="h-4 w-4" />
                  (509) 972-8989
                </a>
                <a
                  href="mailto:business@cascadeautobody.com"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-900"
                >
                  <Mail className="h-4 w-4" />
                  business@cascadeautobody.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
          >
            {/* Business Information */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900">
                Business Information
              </h2>
            </div>
            <div className="p-6 space-y-4 border-b border-neutral-200">
              <Input
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleChange("businessType", e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select type...</option>
                    <option value="collision_repair">
                      Collision Repair Shop
                    </option>
                    <option value="body_shop">Body Shop</option>
                    <option value="auto_dealer">Auto Dealer</option>
                    <option value="paint_contractor">Paint Contractor</option>
                    <option value="restoration">Restoration Shop</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input
                  label="Years in Business"
                  type="number"
                  min="0"
                  value={formData.yearsInBusiness}
                  onChange={(e) =>
                    handleChange("yearsInBusiness", e.target.value)
                  }
                  required
                />
              </div>
              <Input
                label="Tax ID / EIN (Optional)"
                value={formData.taxId}
                onChange={(e) => handleChange("taxId", e.target.value)}
                placeholder="XX-XXXXXXX"
              />
            </div>

            {/* Contact Information */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900">
                Contact Information
              </h2>
            </div>
            <div className="p-6 space-y-4 border-b border-neutral-200">
              <Input
                label="Contact Name"
                value={formData.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  required
                />
              </div>
              <Input
                label="Business Address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  required
                />
                <Input
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900">
                Additional Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Estimated Monthly Spend
                </label>
                <select
                  value={formData.estimatedMonthlySpend}
                  onChange={(e) =>
                    handleChange("estimatedMonthlySpend", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select range...</option>
                  <option value="under_500">Under $500</option>
                  <option value="500_1000">$500 - $1,000</option>
                  <option value="1000_2500">$1,000 - $2,500</option>
                  <option value="2500_5000">$2,500 - $5,000</option>
                  <option value="5000_10000">$5,000 - $10,000</option>
                  <option value="over_10000">Over $10,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Trade References (Optional)
                </label>
                <textarea
                  value={formData.references}
                  onChange={(e) => handleChange("references", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="List any suppliers or vendors you currently work with"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    handleChange("additionalInfo", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Any additional information you'd like us to know"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
