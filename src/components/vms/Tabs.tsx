import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Tabs({ children, className }: { children: ReactNode; className?: string }) {
  return <div role="tablist" className={cx("flex overflow-x-auto border-b border-gray-300 bg-white", className)}>{children}</div>;
}
