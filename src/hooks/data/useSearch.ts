import { useState, useMemo } from "react";

type SearchFunction<T> = (item: T, query: string) => boolean;
type SearchFields<T> = (keyof T)[] | SearchFunction<T>;

export const useSearch = <T extends Record<string, any>>(
  items: T[],
  searchFields: SearchFields<T>
) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    const query = searchQuery.toLowerCase().trim();

    return items.filter((item) => {
      if (typeof searchFields === "function") {
        return searchFields(item, query);
      }

      return (searchFields as (keyof T)[]).some((field) =>
        String(item[field] || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [items, searchQuery, searchFields]);

  const handleSearch = (e: any) => {
    const value = e.target?.value ?? e.value ?? e;
    setSearchQuery(String(value));
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    handleSearch,
  };
};
