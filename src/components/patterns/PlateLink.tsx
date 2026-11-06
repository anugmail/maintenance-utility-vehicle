/* ลิงก์เลขทะเบียน (ประกอบเอง · figma-spec/COMPOSED.md หัวข้อ น.) — AFTER_SCREEN ใน screens.js 6 พ.ย. 2569
   เจ้าของงาน "อยากให้ กดที่ทะเบียน newtab ไปข้อมูลรถได้ อยากให้ปรับส่วนอื่นที่เป็นเลขทะเบียน ตอนนี้เพิ่มแค่ส่วนของบำรุงรักษาก่อน"
   ⇒ ข้อความที่เป็นเลขทะเบียนทั้งช่อง (PLATE_RE เดียวกับปลั๊กอิน) ในช่องตาราง · กล่องข้อมูล · การ์ดมือถือ · รายการติ๊กมือถือ กดแล้วเปิดแท็บใหม่ไปหน้าข้อมูลยานพาหนะของ Vehicle Management
   ช่องกรอก รายการตัวเลือก Badge Pill Breadcrumb Page header ไม่เป็นลิงก์ (PLATE_SKIP) — ชิ้นเหล่านั้นไม่เรียก linkPlate
   ไลบรารี Component ไม่มี Table cell แบบลิงก์ ⇒ สไตล์ตามค่าลิงก์ใน _Content item base ของ UI Release#2 หน้า Replacement Vehicle ("BRD005678"): สีลิงก์ (Color/text/info) ขีดเส้นใต้
   สีใช้ token info-700 (ใกล้สุด — tokens ยังไม่มีค่าสีลิงก์นี้ ดูแถว _Content item base Type=Attachment และลิงก์เลขทะเบียนใน COMPOSED.md ข.)
   ปลายทาง: ต้นแบบยังไม่มีหน้าข้อมูลยานพาหนะ (แท็บ "ข้อมูลยานพาหนะ" ของ Vehicle Management) ⇒ /soon/ (หน้าเร็วๆ นี้ของต้นแบบ) พร้อม ?car=<ทะเบียนไม่มีจังหวัด> */
import type { MouseEvent, ReactNode } from "react";
import { asset } from "@/lib/basePath";

export const PLATE_RE = /^\d{2}-\d{4} [฀-๿]+$/;
export const plateHref = (plate: string) => asset("/soon/?car=" + encodeURIComponent(plate.split(" ")[0]));

export function PlateLink({ plate }: { plate: string }) {
  return (
    <a href={plateHref(plate)} target="_blank" rel="noopener" data-plate-link className="text-info-700 underline underline-offset-2"
      onClick={(e: MouseEvent) => e.stopPropagation()}>{plate}</a>
  );
}

/** ข้อความเลขทะเบียนทั้งช่อง → ลิงก์ · อย่างอื่นคืนเดิม */
export function linkPlate(node: ReactNode): ReactNode {
  return typeof node === "string" && PLATE_RE.test(node) ? <PlateLink plate={node} /> : node;
}
