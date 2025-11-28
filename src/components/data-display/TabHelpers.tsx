export const EmptyTabContent = () => (
  <div className="py-10 text-gray-500 text-center">
    No se encontraron resultados
  </div>
);

interface Column {
  label: string;
  className?: string;
}

interface TabHeaderProps {
  columns: Column[];
}

export const TabHeader = ({ columns }: TabHeaderProps) => (
  <div className="top-0 sticky bg-gray-50 border-gray-200 border-b">
    <div className="grid grid-cols-12 px-4 py-2 font-semibold text-gray-500 text-xs uppercase">
      {columns.map((col) => (
        <div key={col.label} className={col.className}>
          {col.label}
        </div>
      ))}
    </div>
  </div>
);
