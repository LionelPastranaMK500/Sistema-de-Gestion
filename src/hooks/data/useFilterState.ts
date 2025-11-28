import { useState } from "react";

export const useFilterState = <T extends Record<string, any>>(
  initialFilters: T
) => {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = (field: keyof T, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
  };
};
