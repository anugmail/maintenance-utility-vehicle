"use client";
/* ที่อยู่เดิมของหน้ารายละเอียด S26 (รอบ 2–3 · 11 พ.ย. 2569) → หน้ารายการ /safety/ (รอบ 4 เจ้าของงาน "ไม่อยากให้ต้องเปิดหน้าใหม่ แต่เป็นหน้าลิสต์แล้วพอเลือก upload ก็แสดง pop up")
   คง ?car= ⇒ หน้ารายการเปิด popup ผลการตรวจ ปจ.2 ของคันนั้น */
import { MovedTo } from "@/components/shell/MovedTo";

export default function Page() {
  return <MovedTo href="/safety/" />;
}
