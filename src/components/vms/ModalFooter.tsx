"use client";
/* Figma: "Modal footer" — ไฟล์ (Component) VMS Plus หน้า Modals (node 2:16) · สเปก figma-spec/Modal footer.json
   variant: Alignment = Horizontal fill | Horizontal right | Vertical fill
   property: Secondary action · Primary action · Tertiary action · Divider (ปิด R2/R13) · Padding top
   ค่า: Padding top 24 · Actions ขอบในข้าง 24 ล่าง 24 ช่องไฟ 12 · Horizontal fill ปุ่มแบ่งครึ่ง · Horizontal right ปุ่มชิดขวา (Tertiary ซ้าย) · Vertical fill เรียงลง (Primary บน) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface ModalFooterProps {
  Alignment?: "Horizontal fill" | "Horizontal right" | "Vertical fill";
  /** property Divider — เส้นคั่นเหนือปุ่ม (ค่าเริ่มปิดตาม R2/R13 · Modal Signature / SummaryRequestedParts เปิด) */
  Divider?: boolean;
  /** property Padding top (ค่าเริ่มเปิด 24 · SummaryRequestedParts ปิด) */
  PaddingTop?: boolean;
  /** ปุ่มรอง (ซ้าย) — SecondaryButton */
  SecondaryAction?: ReactNode;
  /** ปุ่มหลัก (ขวา) — PrimaryButton / PrimaryDangerButton */
  PrimaryAction?: ReactNode;
  TertiaryAction?: ReactNode;
}

export function ModalFooter({ Alignment = "Horizontal fill", SecondaryAction, PrimaryAction, TertiaryAction, Divider, PaddingTop = true }: ModalFooterProps) {
  return (
    <div className={cx("px-6 pb-6", PaddingTop && "pt-6")}>
      {/* property Divider: Content divider เต็มกว้าง + ห่างปุ่ม 20 (Padding top 24 คงเดิม) */}
      {Divider && <div className="-mx-6 pb-5"><div className="h-px bg-gray-300" /></div>}
      {Alignment === "Vertical fill" ? (
        <div className="flex flex-col gap-3 [&>*]:w-full">{PrimaryAction}{SecondaryAction}</div>
      ) : Alignment === "Horizontal right" ? (
        <div className="flex items-center gap-3">{TertiaryAction}<div className="ml-auto flex gap-3">{SecondaryAction}{PrimaryAction}</div></div>
      ) : (
        <div className={cx("flex gap-3 [&>*]:flex-1 [&>*]:basis-0")}>{SecondaryAction}{PrimaryAction}</div>
      )}
    </div>
  );
}
