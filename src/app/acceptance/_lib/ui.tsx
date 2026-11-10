"use client";
/* ปุ่ม "รับทราบ" ของ S13 (ackRow ใน screens.js · Figma 9607c3b · R89) — Primary button ของไฟล์ Component ที่พื้นผูกตัวแปร Color/surface/success (= token success-600)
   + ไอคอนนำ check-24-300-round · ตามปุ่ม "ตรวจแล้ว" / "ขึ้น SAP แล้ว" ของหน้า 5.14 - 5.15 Cost & Expense Check ของ UI Release#2 (เจ้าของงาน "อยากใช้คำกลางๆ แล้วเปลี่ยนสี เป็นสีเขียว")
   ไม่ใช่ component ใหม่ — instance override สีพื้นของ Primary button: ใช้ ButtonBase ของ Primary button ตัวเดิม (ขนาด ขอบใน ตัวอักษร ไอคอน วงโฟกัส) เปลี่ยนแค่พื้น
   State=Disabled (ยังไม่ประเมิน) = Disabled ของไลบรารี ไม่ทาเขียว · Hover คงสีเขียว (จอ Figma มีแต่ Default) — COMPOSED.md หัวข้อ "ปุ่มรับทราบ" */
import { ButtonBase, type ButtonProps, type Look } from "@/components/vms/_button";

const ACK_LOOK: Look = { base: "bg-success-600 text-white", hover: "bg-success-600 text-white", hoverCls: "hover:bg-success-600", disabled: "bg-gray-100 text-gray-400", ring: "brand" };

export function AckButton(props: ButtonProps) {
  return <ButtonBase look={ACK_LOOK} Text="รับทราบ" LeadingIconSwap="check-24-300-round" {...props} />;
}
