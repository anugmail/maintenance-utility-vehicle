"use client";
/* ฐานร่วมของ ReceiptChecklist / InspectionChecklist (ไฟล์ Maintain-D) — ไม่ใช่ component ของไฟล์เอง
   ตาราง desktop ของสองตัวนี้เป็น Table header cell + Table cell วางเป็นคอลัมน์ (เกินขนาด Table ของไลบรารี 8×10)
   ค่า: หัว พื้น gray-100 ขอบใน 12/16 ตัวอักษร 14 SemiBold black (มุมซ้ายบน 12) · แถว สูง 56 ขอบใน 8/16 พื้นสลับ white / gray-50 ไม่มีเส้น (sws มีแต่ไม่มีสีเส้น)
   การ์ดมือถือ (ReceiptChecklistCard / InspectionChecklistCard): พื้น white ขอบ 1 gray-300 รัศมี 12 ขอบใน 16 ช่องไฟ 16 · Section label = ชื่อรายการ */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export const TH = "bg-gray-100 px-4 py-3 text-left align-middle text-sm font-semibold text-black";
export const td = (i: number, extra?: string) => cx("h-14 px-4 py-2 align-middle", i % 2 ? "bg-gray-50" : "bg-white", extra);

export function ChecklistCard({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4">{children}</div>;
}
