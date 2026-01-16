import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface ToppenishInventoryItem {
  sku: string;
  product_name: string;
  total_stock: number;
  open_stock: number;
  price: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skus = searchParams.get("skus");

    let query = supabase
      .from("inventory")
      .select("sku, product_name, total_stock, open_stock, price");

    // If specific SKUs are requested, filter by them
    if (skus) {
      const skuList = skus.split(",").map((s) => s.trim());
      query = query.in("sku", skuList);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch Toppenish inventory" },
        { status: 500 }
      );
    }

    // Create a map of SKU to inventory for easy lookup
    const inventoryMap: Record<string, ToppenishInventoryItem> = {};
    if (data) {
      for (const item of data) {
        inventoryMap[item.sku] = item;
      }
    }

    return NextResponse.json({
      inventory: inventoryMap,
      count: Object.keys(inventoryMap).length,
    });
  } catch (error) {
    console.error("Error fetching Toppenish inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
