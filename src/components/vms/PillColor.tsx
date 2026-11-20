import { cx } from "@/lib/cx";
import type { PillColor as PillOutlineColor } from "./PillOutline";

export type PillColorName = Exclude<PillOutlineColor, "Purple">;

const COLOR: Record<PillColorName, string> = {
  Brand: "bg-brand-900 text-white",
  Gray: "bg-gray-200 text-gray-600",
  Info: "bg-info-600 text-white",
  Success: "bg-success-600 text-white",
  Warning: "bg-warning-600 text-white",
  Error: "bg-error-500 text-white",
  Disabled: "bg-gray-100 text-gray-400",
};

export function PillColor({ Text, Color = "Brand", className }: { Text: string; Color?: PillColorName; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-pill px-2 py-1 text-xs leading-[18px] font-semibold whitespace-nowrap", COLOR[Color], className)}>
      {Text}
    </span>
  );
}
