"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface ColorSwatch {
  name: string;
  hex: string;
  code?: string;
  finish?: string;
}

interface PaintBrand {
  name: string;
  description: string;
  colors: ColorSwatch[];
}

const paintBrands: PaintBrand[] = [
  {
    name: "Perfect Coat",
    description: "Premium basecoat system with exceptional coverage and durability",
    colors: [
      { name: "Arctic White", hex: "#F5F5F5", code: "PC-001", finish: "Solid" },
      { name: "Jet Black", hex: "#1A1A1A", code: "PC-002", finish: "Solid" },
      { name: "Candy Apple Red", hex: "#FF0800", code: "PC-101", finish: "Metallic" },
      { name: "Electric Blue", hex: "#0066FF", code: "PC-201", finish: "Metallic" },
      { name: "Sunset Orange", hex: "#FF6B35", code: "PC-102", finish: "Pearl" },
      { name: "Forest Green", hex: "#228B22", code: "PC-301", finish: "Metallic" },
      { name: "Champagne Gold", hex: "#D4AF37", code: "PC-401", finish: "Pearl" },
      { name: "Midnight Purple", hex: "#2E0854", code: "PC-501", finish: "Metallic" },
      { name: "Silver Mist", hex: "#C0C0C0", code: "PC-601", finish: "Metallic" },
      { name: "Burgundy Wine", hex: "#722F37", code: "PC-103", finish: "Pearl" },
    ],
  },
  {
    name: "XPrime",
    description: "High-performance primers and undercoats for professional results",
    colors: [
      { name: "Gray Primer", hex: "#808080", code: "XP-G01", finish: "Matte" },
      { name: "White Primer", hex: "#EFEFEF", code: "XP-W01", finish: "Matte" },
      { name: "Black Primer", hex: "#2D2D2D", code: "XP-B01", finish: "Matte" },
      { name: "Red Oxide", hex: "#6D3F3F", code: "XP-R01", finish: "Matte" },
      { name: "Epoxy Gray", hex: "#5A5A5A", code: "XP-E01", finish: "Satin" },
      { name: "High-Build White", hex: "#FAFAFA", code: "XP-HW1", finish: "Matte" },
      { name: "Sealer Dark", hex: "#3D3D3D", code: "XP-SD1", finish: "Satin" },
      { name: "Sealer Light", hex: "#A0A0A0", code: "XP-SL1", finish: "Satin" },
    ],
  },
  {
    name: "Onwings",
    description: "Specialty finishes including pearls, flakes, and custom effects",
    colors: [
      { name: "Galaxy Pearl", hex: "#1B0F3B", code: "OW-GP1", finish: "Pearl" },
      { name: "Chameleon Teal", hex: "#008B8B", code: "OW-CT1", finish: "Flip" },
      { name: "Diamond Flake", hex: "#E8E8E8", code: "OW-DF1", finish: "Flake" },
      { name: "Rose Gold", hex: "#B76E79", code: "OW-RG1", finish: "Pearl" },
      { name: "Neon Green", hex: "#39FF14", code: "OW-NG1", finish: "Candy" },
      { name: "Ice Blue", hex: "#99FFFF", code: "OW-IB1", finish: "Pearl" },
      { name: "Copper Penny", hex: "#AD6F69", code: "OW-CP1", finish: "Metallic" },
      { name: "Holographic", hex: "#E6E6FA", code: "OW-HO1", finish: "Special" },
      { name: "Burnt Orange", hex: "#CC5500", code: "OW-BO1", finish: "Candy" },
      { name: "Chrome Effect", hex: "#C9C0BB", code: "OW-CE1", finish: "Chrome" },
    ],
  },
  {
    name: "Globastar Industrial",
    description: "Commercial-grade coatings for fleet and industrial applications",
    colors: [
      { name: "Safety Yellow", hex: "#FFD100", code: "GI-SY1", finish: "High-Vis" },
      { name: "Fire Engine Red", hex: "#CE2029", code: "GI-FR1", finish: "Gloss" },
      { name: "Fleet White", hex: "#FFFFFF", code: "GI-FW1", finish: "Gloss" },
      { name: "Construction Orange", hex: "#FF6600", code: "GI-CO1", finish: "High-Vis" },
      { name: "School Bus Yellow", hex: "#FFD800", code: "GI-SB1", finish: "Gloss" },
      { name: "Postal Blue", hex: "#00539B", code: "GI-PB1", finish: "Gloss" },
      { name: "Ambulance White", hex: "#FCFCFC", code: "GI-AW1", finish: "Gloss" },
      { name: "UPS Brown", hex: "#644117", code: "GI-UB1", finish: "Gloss" },
      { name: "Military OD", hex: "#544F3D", code: "GI-MO1", finish: "Matte" },
      { name: "Taxi Yellow", hex: "#F7C600", code: "GI-TY1", finish: "Gloss" },
    ],
  },
];

export function ColorSwatches() {
  const [selectedBrand, setSelectedBrand] = useState<string>(paintBrands[0].name);
  const [selectedColor, setSelectedColor] = useState<ColorSwatch | null>(null);

  const activeBrand = paintBrands.find((b) => b.name === selectedBrand);

  return (
    <div>
      {/* Brand Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {paintBrands.map((brand) => (
          <button
            key={brand.name}
            onClick={() => {
              setSelectedBrand(brand.name);
              setSelectedColor(null);
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedBrand === brand.name
                ? "bg-primary text-white shadow-md"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            {brand.name}
          </button>
        ))}
      </div>

      {/* Brand Description */}
      {activeBrand && (
        <p className="text-center text-neutral-600 mb-8 max-w-xl mx-auto">
          {activeBrand.description}
        </p>
      )}

      {/* Color Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 mb-8">
        {activeBrand?.colors.map((color) => (
          <button
            key={color.code}
            onClick={() => setSelectedColor(selectedColor?.code === color.code ? null : color)}
            className={cn(
              "group relative aspect-square rounded-lg transition-all duration-200 ring-offset-2",
              selectedColor?.code === color.code
                ? "ring-2 ring-primary scale-110 z-10 shadow-lg"
                : "hover:scale-105 hover:shadow-md"
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {selectedColor?.code === color.code && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check
                  className={cn(
                    "h-5 w-5",
                    isLightColor(color.hex) ? "text-neutral-800" : "text-white"
                  )}
                />
              </div>
            )}
            {/* Shine effect for metallic/pearl */}
            {(color.finish === "Metallic" || color.finish === "Pearl" || color.finish === "Chrome") && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-lg pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* Selected Color Details */}
      {selectedColor ? (
        <div className="bg-neutral-50 rounded-xl p-6 max-w-md mx-auto border border-neutral-200">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-lg shadow-md flex-shrink-0"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {selectedColor.name}
                </h3>
                <button
                  onClick={() => setSelectedColor(null)}
                  className="p-1 hover:bg-neutral-200 rounded"
                >
                  <X className="h-4 w-4 text-neutral-500" />
                </button>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-neutral-600">
                  <span className="font-medium">Code:</span> {selectedColor.code}
                </p>
                <p className="text-neutral-600">
                  <span className="font-medium">Finish:</span> {selectedColor.finish}
                </p>
                <p className="text-neutral-600">
                  <span className="font-medium">Hex:</span> {selectedColor.hex}
                </p>
                <p className="text-neutral-600">
                  <span className="font-medium">Brand:</span> {selectedBrand}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Bring this code to our store for an exact match. We can mix any quantity
            from touch-up bottles to full gallons.
          </p>
        </div>
      ) : (
        <p className="text-center text-neutral-500 text-sm">
          Click on a color swatch to see details
        </p>
      )}
    </div>
  );
}

// Helper to determine if a color is light (for contrast)
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
