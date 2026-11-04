/* Figma: "Card form row" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/Card form row.json
   แถวช่องกรอกใน Modal Type=Form (formModal() ใน core.js — ปิด Input 2 · แถวยาวสลับเป็น Text area ด้วย Input 1 swap)
   variant: Width = Full | 50% | 25% · property: Input 1 swap · Input 2 · Input 2 swap
   ค่า: แถวเดียว ช่องไฟ 12 · Full = ช่องกว้างเท่ากัน · 50% = ช่อง + ที่ว่าง · 25% = ช่องเล็ก + ที่ว่าง */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function CardFormRow({ Width = "Full", Input1, Input2, className }: { Width?: "Full" | "50%" | "25%"; Input1: ReactNode; Input2?: ReactNode; className?: string }) {
  if (Width === "Full") return <div className={cx("flex gap-3 [&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0", className)}>{Input1}{Input2}</div>;
  if (Width === "50%") return <div className={cx("grid grid-cols-2 gap-3", className)}>{Input1}<span aria-hidden="true" /></div>;
  return <div className={cx("grid grid-cols-4 gap-3", className)}>{Input1}<span aria-hidden="true" className="col-span-3" /></div>;
}
