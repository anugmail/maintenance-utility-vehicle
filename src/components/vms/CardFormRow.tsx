import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function CardFormRow({ Width = "Full", Input1, Input2, className }: { Width?: "Full" | "50%" | "25%"; Input1: ReactNode; Input2?: ReactNode; className?: string }) {
  if (Width === "Full") return <div className={cx("flex gap-3 [&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0", className)}>{Input1}{Input2}</div>;
  if (Width === "50%") return <div className={cx("grid grid-cols-2 gap-3", className)}>{Input1}<span aria-hidden="true" /></div>;
  return <div className={cx("grid grid-cols-4 gap-3", className)}>{Input1}<span aria-hidden="true" className="col-span-3" /></div>;
}
