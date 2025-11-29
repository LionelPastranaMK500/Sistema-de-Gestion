import { ReactNode } from "react";

// --- Common Components ---
export interface ErrorTextProps {
  children: ReactNode;
}

// --- Data Display (TabHelpers) ---
export interface TabColumn {
  label: string;
  className?: string;
}

export interface TabHeaderProps {
  columns: TabColumn[];
}

// --- Layout (Sidebar) ---
// Estas son específicas para el dropdown del sidebar
export interface SidebarOption {
  id: number | string;
  nombre: string;
}

// --- Modals (AddListModal) ---
export interface ListItem {
  id?: string | number;
  tempId?: string | number;
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
  onRemoveItem: (id: string | number) => void;
  width?: string;
}

// --- Modals (SelectionModal) ---
export interface SelectionModalProps<T> {
  visible: boolean;
  onHide: () => void;
  title: string;
  options?: T[];
  optionLabel?: keyof T;
  optionValue?: keyof T;
  onSelect: (option: T) => void;
}

// --- Modals (SimpleInputModal) ---
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
