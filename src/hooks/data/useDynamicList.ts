import { useState, useCallback } from "react";

export interface DynamicItem {
  id?: string | number;
  tempId?: number;
  [key: string]: any;
}

export const useDynamicList = <T extends DynamicItem>(
  initialItems: T[] = [],
  generateId: () => number = () => Date.now()
) => {
  const [items, setItems] = useState<T[]>(initialItems);

  const addItem = useCallback(
    (newItem: Partial<T> = {}) => {
      const itemToAdd = { ...newItem, tempId: generateId() } as T;
      setItems((prev) => [...prev, itemToAdd]);
    },
    [generateId]
  );

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.tempId !== id));
  }, []);

  const updateItem = useCallback((id: number, field: keyof T, value: any) => {
    setItems((prev) =>
      prev.map((item) =>
        item.tempId === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const resetItems = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    resetItems,
  };
};
