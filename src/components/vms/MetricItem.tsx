import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { FeaturedIcon, type FeaturedIconColor } from "./FeaturedIcon";

export interface MetricItemProps {
  Breakpoint?: Breakpoint;
  Number: string | number;
  Text: string;
  FeaturedIconColor?: FeaturedIconColor;
  IconSwap?: string;
  className?: string;
}

export function MetricItem({ Breakpoint: bp, Number: num, Text, FeaturedIconColor = "Info", IconSwap, className }: MetricItemProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  if (mob) {
    return (
      <div className={cx("flex min-h-[104px] min-w-0 flex-col justify-between gap-3 rounded-lg border border-gray-300 bg-white p-3", className)}>
        <div className="flex items-start gap-2">
          <span className="min-w-0 flex-1 text-sm font-semibold text-black">{Text}</span>
          <FeaturedIcon Color={FeaturedIconColor} Size="sm" IconSwap={IconSwap} />
        </div>
        <span className="text-lg font-semibold text-black">{num}</span>
      </div>
    );
  }
  return (
    <div className={cx("flex min-h-[156px] min-w-0 flex-col justify-between gap-5 rounded-lg border border-gray-300 bg-white px-4 py-5", className)}>
      <div className="flex items-center gap-3">
        <FeaturedIcon Color={FeaturedIconColor} Size="md" IconSwap={IconSwap} />
        <span className="min-w-0 flex-1 text-md font-semibold text-black">{Text}</span>
      </div>
      <span className="text-title font-semibold text-black">{num}</span>
    </div>
  );
}
