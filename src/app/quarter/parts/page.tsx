/* ที่อยู่เดิมของ S4 ความคืบหน้าอะไหล่รายไตรมาส (เทียบคงเหลือ Smart Inventory + เบิก/จอง) — เปลี่ยนเป็นแดชบอร์ด /parts/ 6 พ.ย. 2569
   (เจ้าของงาน "หน้าที่จาก smart inventory จะเปลี่ยนเป็นหน้าแดชบอร์ด" · partsDash() ใน screens.js) ⇒ หน้านี้พาไปแดชบอร์ด (ดู shell/MovedTo.tsx) */
import { MovedTo } from "@/components/shell/MovedTo";

export default function Page() {
  return <MovedTo href="/parts/" />;
}
