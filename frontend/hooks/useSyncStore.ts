"use client";

import { useEffect } from "react";
import { seedIfEmpty } from "@/lib/mockData";
import { useAppStore } from "@/store/useAppStore";

export function useSyncStore() {
  const syncFromStorage = useAppStore((state) => state.syncFromStorage);

  useEffect(() => {
    seedIfEmpty();
    syncFromStorage();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "claims" || event.key === "notifications") {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [syncFromStorage]);
}
