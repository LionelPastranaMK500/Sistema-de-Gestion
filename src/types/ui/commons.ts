import { ReactNode } from "react";

// --- Text & Feedback ---
export interface ErrorTextProps {
  children: ReactNode;
}

// --- Data Display (Tablas y Tabs) ---
export interface TabColumn {
  label: string;
  className?: string;
}

export interface TabHeaderProps {
  columns: TabColumn[];
}

// --- Generic Lists & Modals (AddListModal) ---
export interface ListItem {
  id?: number | string;
  tempId?: number;
  [key: string]: any;
}

export interface AddListModalProps<T extends ListItem> {
  visible: boolean;
  onHide: () => void;
  onSave: (items: T[]) => void;
  title: string;
  addButtonLabel: string;
  items: T[];
  setItems: (items: T[]) => void;
  renderFormFields: () => ReactNode;
  renderItemDisplay: (item: T) => ReactNode;
  validateForm?: () => boolean;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  width?: string;
}

// --- Selection & Input Modals ---
export interface SelectionModalProps<T> {
  visible: boolean;
  onHide: () => void;
  title: string;
  options?: T[];
  optionLabel?: keyof T;
  optionValue?: keyof T;
  onSelect: (option: T) => void;
}

export interface SimpleInputModalProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  placeholder?: string;
  value: string;
  onSave: (value: string) => void;
  type?: "text" | "textarea";
  rows?: number;
}
