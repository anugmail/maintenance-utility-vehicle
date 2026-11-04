/* Figma: "Empty state/Data empty" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Empty state_Data empty.json
   ใช้แทนตารางเมื่อไม่มีข้อมูล (noCarsInQ / noParts ใน screens.js — ซ่อน Actions)
   ค่า: ขอบในบน/ล่าง 40 · ช่องไฟ 24 · พื้น white · Content กว้าง 360 ช่องไฟ 12 · หัวข้อ 24 SemiBold black · ข้อความ 16 Regular gray-600 ห่าง 8 · Actions ช่องไฟ 16
   ภาพ Graphic 200×200 ของไลบรารีเป็นรูปที่ดัมป์ไม่ได้เก็บไว้ → ยังไม่แสดง (ดู COMPOSED.md) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function EmptyStateDataEmpty({ Text, SupportingText, Actions, className }: { Text: string; SupportingText?: string; Actions?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-6 bg-white py-10", className)}>
      <div className="flex w-full max-w-[360px] flex-col items-center gap-2 text-center">
        <p className="text-xl font-semibold text-black">{Text}</p>
        {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
      </div>
      {Actions && <div className="flex gap-4">{Actions}</div>}
    </div>
  );
}
