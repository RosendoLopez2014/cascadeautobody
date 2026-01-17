import { useState, useEffect } from "react";
import { useLocationStore } from "@/stores/locationStore";

/**
 * Safely get the selected location ID without hydration issues.
 * Returns { locationId, mounted } where mounted indicates if we can trust the locationId value.
 */
export function useSafeLocationId() {
  const [mounted, setMounted] = useState(false);
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    locationId: selectedLocationId,
    mounted,
  };
}
