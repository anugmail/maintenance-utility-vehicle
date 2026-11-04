/* Figma: "Empty state/Data empty" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Empty state_Data empty.json
   ใช้แทนตารางเมื่อไม่มีข้อมูล (noCarsInQ / noParts ใน screens.js — ซ่อน Actions)
   ค่า: ขอบในบน/ล่าง 40 · ช่องไฟ 24 · พื้น white · Content กว้าง 360 ช่องไฟ 12 · หัวข้อ 24 SemiBold black · ข้อความ 16 Regular gray-600 ห่าง 8 · Actions ช่องไฟ 16
   ภาพ Graphic 200×200 (พื้นภาพ paint image) — ส่งออกจากดัมป์ UI Release#2 4 พ.ย. 2569 ตามบริบทที่หน้าจอจริงใช้:
     "data" = แฟ้ม EMPTY ของ "ไม่พบข้อมูล / ไม่มีงานที่กำลังดำเนินการ" (MA Success · 58-42887)
     "vehicle" = รถกับแว่นขยาย ของ "ไม่มียานพาหนะ" (Contract vehicle list - Empty · 1-54) — ใช้กับรายการรถที่ว่าง */
import type { ReactNode } from "react";
import { asset } from "@/lib/basePath";
import { cx } from "@/lib/cx";

export type EmptyGraphic = "data" | "vehicle";

export function EmptyStateDataEmpty({ Text, SupportingText, Actions, Graphic = "data", className }: { Text: string; SupportingText?: string; Actions?: ReactNode; Graphic?: EmptyGraphic; className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-6 bg-white py-10", className)}>
      <div className="flex w-full max-w-[360px] flex-col items-center gap-3 text-center">
        <img src={asset("/figma-img/empty-" + Graphic + ".png")} alt="" aria-hidden="true" width={200} height={200} />
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-xl font-semibold text-black">{Text}</p>
          {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
        </div>
      </div>
      {Actions && <div className="flex gap-4">{Actions}</div>}
    </div>
  );
}
