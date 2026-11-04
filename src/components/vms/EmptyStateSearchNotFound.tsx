/* Figma: "Empty state/Search not found" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Empty state_Search not found.json
   ใช้เมื่อค้นหา/กรองแล้วไม่พบ · ค่าเริ่มของไลบรารี: "ไม่พบข้อมูล" / "เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง" · Actions = Secondary button "ล้างตัวกรอง" (Primary button ซ่อน)
   ค่า: ขอบในบน/ล่าง 40 · ช่องไฟ 24 · พื้น white · Content กว้าง 360 ช่องไฟ 12 · หัวข้อ 24 SemiBold black · ข้อความ 16 Regular gray-600 ห่าง 8 · Actions ช่องไฟ 16
   ภาพ Graphic 200×200 (พื้นภาพ paint image) — ส่งออกจากดัมป์ UI Release#2 4 พ.ย. 2569 หน้า Contract list - Search not found (1-54) */
import type { ReactNode } from "react";
import { asset } from "@/lib/basePath";
import { cx } from "@/lib/cx";

export function EmptyStateSearchNotFound({ Text = "ไม่พบข้อมูล", SupportingText = "เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง", Actions, className }: { Text?: string; SupportingText?: string; Actions?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-6 bg-white py-10", className)}>
      <div className="flex w-full max-w-[360px] flex-col items-center gap-3 text-center">
        <img src={asset("/figma-img/empty-search.png")} alt="" aria-hidden="true" width={200} height={200} />
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-xl font-semibold text-black">{Text}</p>
          {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
        </div>
      </div>
      {Actions && <div className="flex gap-4">{Actions}</div>}
    </div>
  );
}
