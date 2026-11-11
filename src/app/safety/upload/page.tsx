"use client";
/* ที่อยู่เดิมของหน้าอัปโหลดเอกสาร S26 (รอบแรก 11 พ.ย. 2569) → หน้ารายการ /safety/ (รอบ 4 popup บนหน้ารายการ) · คง ?car= ⇒ เปิด popup ของคันนั้น */
import { MovedTo } from "@/components/shell/MovedTo";

export default function Page() {
  return <MovedTo href="/safety/" />;
}
