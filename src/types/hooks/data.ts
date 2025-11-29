// --- useApi ---
export interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

// --- useDynamicList ---
export interface DynamicItem {
  id?: string | number;
  tempId?: number;
  [key: string]: any;
}

// --- useListSelection ---
export interface SelectionOptions<T> {
  onDuplicate?: (item: T) => void;
  onEmptySelection?: () => void;
}

// --- useSearch ---
export type SearchFunction<T> = (item: T, query: string) => boolean;
export type SearchFields<T> = (keyof T)[] | SearchFunction<T>;
