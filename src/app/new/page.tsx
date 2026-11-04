"use client";
/* S1 · หน้า สร้างแผนบำรุงรักษา (/new/) — planForm() ใน screens.js · เงื่อนไขตามตาราง Condition ของ Scenario 1 ในไฟล์ 14-บำรุงรักษา-userflow.md
   ตัวฟอร์มอยู่ PlanForm.tsx (ใช้ร่วมกับ S19 แก้ไขแผน /edit/) · ฟอร์มที่กรอกค้างเก็บใน mock.draft (ไป S21 /car-parts/?id=new แล้วกลับมาไม่หาย) */
import { AppFrame } from "@/components/shell/AppFrame";
import { PlanForm } from "./PlanForm";

export default function Page() {
  return <AppFrame><PlanForm mode="create" /></AppFrame>;
}
