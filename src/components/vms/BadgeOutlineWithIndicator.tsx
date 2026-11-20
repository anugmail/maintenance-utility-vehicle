import { cx } from "@/lib/cx";
import { Indicator } from "./Indicator";

export type BadgeIndicatorColor = "Gray" | "Brand" | "Info" | "Success" | "Warning" | "Error";
const DOT: Record<BadgeIndicatorColor, string> = {
  Gray: "bg-gray-500", Brand: "bg-brand-500", Info: "bg-info-600", Success: "bg-success-600", Warning: "bg-warning-600", Error: "bg-error-500",
};

export function BadgeOutlineWithIndicator({ Text, Color = "Gray", className }: { Text: string; Color?: BadgeIndicatorColor; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-xs border border-gray-300 bg-white px-2 text-xs leading-[18px] font-semibold whitespace-nowrap text-gray-600", className)}>
      <Indicator Size="sm" dot={DOT[Color]} />{Text}
    </span>
  );
}
