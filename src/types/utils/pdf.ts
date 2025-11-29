export type PdfFormat = "A4" | "t80mm";

export interface PageSize {
  width: number;
  height: number;
}

export interface LayoutConfig {
  margin: number;
  fs: { xs: number; sm: number; md: number; lg: number; xl: number };
  line: number;
  bottomSafe: number;
  cols: (w: number, m: number) => Record<string, number>;
}
