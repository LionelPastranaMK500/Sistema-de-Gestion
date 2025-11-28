import { useState, useCallback } from "react";

interface SelectionOptions<T> {
  onDuplicate?: (item: T) => void;
  onEmptySelection?: () => void;
}

export const useListSelection = <T>(
  initialItems: T[] = [],
  options: SelectionOptions<T> = {}
) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const { onDuplicate, onEmptySelection } = options;

  const addItem = useCallback(
    (item: T | null = selectedItem) => {
      if (!item) {
        onEmptySelection?.();
        return false;
      }

      if (selectedItems.includes(item)) {
        onDuplicate?.(item);
        return false;
      }

      setSelectedItems((prev) => [...prev, item]);
      setSelectedItem(null);
      return true;
    },
    [selectedItem, selectedItems, onDuplicate, onEmptySelection]
  );

  const removeItem = useCallback((item: T) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const resetItems = useCallback(() => {
    setSelectedItems(initialItems);
    setSelectedItem(null);
  }, [initialItems]);

  return {
    selectedItems,
    selectedItem,
    addItem,
    removeItem,
    setSelectedItem,
    setSelectedItems,
    clearSelection,
    resetItems,
  };
};
