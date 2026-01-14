"use client";

import { Grid3X3, LayoutGrid, List, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductViewType } from "./ProductCardVariants";

interface ViewToggleProps {
  currentView: ProductViewType;
  onViewChange: (view: ProductViewType) => void;
}

const views: { type: ProductViewType; icon: typeof Grid3X3; label: string }[] = [
  { type: "compact", icon: Grid3X3, label: "Compact Grid" },
  { type: "detailed", icon: LayoutGrid, label: "Detailed" },
  { type: "list", icon: List, label: "List" },
  { type: "hero", icon: Square, label: "Large" },
];

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
      {views.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onViewChange(type)}
          className={cn(
            "p-2 rounded transition-all",
            currentView === type
              ? "bg-white text-primary shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          )}
          title={label}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
