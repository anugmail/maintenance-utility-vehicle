import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function DropdownList({ children, className, emptyText }: { children?: ReactNode; className?: string; emptyText?: string }) {
  return (
    <div role="listbox" className={cx("flex max-h-64 flex-col gap-2 overflow-y-auto rounded-md border border-gray-300 bg-white px-2 py-3 shadow-lg-lib", className)}>
      {children}
      {emptyText && <p className="px-2 py-2 text-sm text-gray-600">{emptyText}</p>}
    </div>
  );
}
