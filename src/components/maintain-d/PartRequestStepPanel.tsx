"use client";
/* Figma: "PartRequestStepPanel" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/PartRequestStepPanel.json (CLAUDE.md ข้อ 12)
   แผงเลือกอะไหล่ 2 ฝั่ง (S21 desktop): PartsInventoryPanel (กว้าง 421) | RequestedPartsPanel (เติมที่เหลือ) ช่องไฟ 16
   มือถือ: ไฟล์ไม่มีแบบมือถือ → เรียงลง (คลังอะไหล่บน · อะไหล่ที่เลือกล่าง) ช่องไฟ 16 (COMPOSED.md ก.) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export function PartRequestStepPanel({ Inventory, Requested, Breakpoint: bp, className }: { Inventory: ReactNode; Requested: ReactNode; Breakpoint?: Breakpoint; className?: string }) {
  const mob = useBreakpoint(bp) === "Mobile";
  return (
    <div className={cx("flex gap-4", mob ? "flex-col" : "items-start", className)}>
      <div className={mob ? undefined : "w-[421px] shrink-0"}>{Inventory}</div>
      <div className="min-w-0 flex-1">{Requested}</div>
    </div>
  );
}
