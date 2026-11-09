/* ที่อยู่เดิมของ S4 ความคืบหน้าอะไหล่รายไตรมาส (/quarter/parts/?id=…&q=n · เทียบคงเหลือ Smart Inventory + เบิก/จอง) — เลิกใช้ 6 พ.ย. 2569
   ภาพรวมอะไหล่ทุกแผนเป็นแดชบอร์ด /parts/ (เข้าจากเมนู · partsDash() ใน screens.js) ส่วนอะไหล่ของไตรมาสย้ายไปหัวข้อ "อะไหล่ในไตรมาส n" ของหน้าไตรมาส
   (screens.js tripList · เจ้าของงาน "หน้าที่ รวมรถในไตรมาส จะเป็นรวมแยกตามรายการ ไม่ต้องมีจาก smart inventory" · บล็อก C ของ SCENARIOS "อะไหล่รายไตรมาสย้ายไปหัวข้ออะไหล่ในไตรมาส n ของหน้าไตรมาส (S6)")
   ⇒ ที่อยู่นี้ระบุแผนและไตรมาส จึงพาไปหน้าไตรมาสเดียวกัน (/quarter/trips/ คงค่า id q ใน query · ดู shell/MovedTo.tsx) — 9 พ.ย. 2569 เดิมพาไป /parts/ */
import { MovedTo } from "@/components/shell/MovedTo";

export default function Page() {
  return <MovedTo href="/quarter/trips/" />;
}
