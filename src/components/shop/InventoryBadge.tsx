import { MapPin } from "lucide-react";
import { LocationInventory } from "@/types";
import { cn } from "@/lib/utils";

interface InventoryBadgeProps {
  inventory: LocationInventory[];
  compact?: boolean;
}

export function InventoryBadge({ inventory, compact = false }: InventoryBadgeProps) {
  const getStockColor = (quantity: number) => {
    if (quantity === 0) return "text-red-600";
    if (quantity <= 5) return "text-amber-600";
    return "text-green-600";
  };

  if (compact) {
    const totalStock = inventory.reduce((sum, loc) => sum + loc.stock_quantity, 0);
    return (
      <span
        className={cn(
          "text-sm font-medium",
          getStockColor(totalStock)
        )}
      >
        {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
      </span>
    );
  }

  return (
    <div className="space-y-1">
      {inventory.map((location) => (
        <div
          key={location.location_id}
          className="flex items-center gap-2 text-sm"
        >
          <MapPin className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
          <span className="text-neutral-600">{location.location_name}:</span>
          <span className={cn("font-medium", getStockColor(location.stock_quantity))}>
            {location.stock_quantity > 0
              ? location.stock_quantity
              : "Out"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StockIndicator({ quantity }: { quantity: number | null }) {
  if (quantity === null || quantity === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
        Out of Stock
      </span>
    );
  }

  if (quantity <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
        Only {quantity} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
      In Stock
    </span>
  );
}
