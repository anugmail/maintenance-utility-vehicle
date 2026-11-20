import { cx } from "@/lib/cx";

const SIZE = { sm: ["p-px", "size-1.5"], md: ["p-0.5", "size-2"], lg: ["p-[3px]", "size-2.5"] } as const;

export function Indicator({ Size = "sm", dot = "bg-success-500", className }: { Size?: keyof typeof SIZE; dot?: string; className?: string }) {
  return <span aria-hidden="true" className={cx("inline-flex shrink-0", SIZE[Size][0], className)}><span className={cx("rounded-pill", SIZE[Size][1], dot)} /></span>;
}
