/* สีของกราฟแดชบอร์ด (แดชบอร์ดแบบ VMS+ · ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 · ใช้เฉพาะ S4 S24) — ทุกสีมาจาก token (src/styles/tokens.css) ไม่มี hex
   ลำดับสีตามหมวด (CATEGORICAL) ตรวจด้วย validate_palette.js ของสกิล dataviz แล้ว: ช่วงความสว่าง/ความอิ่มสีผ่าน · คู่ success-600/warning-600 ตาบอดสีแดง ΔE 6.5
   ⇒ ทุกกราฟมีป้ายชื่อ + ตารางคำอธิบาย + ช่องไฟ 2px คั่นทุกชิ้น (ไม่สื่อด้วยสีอย่างเดียว) · สีตามหมวดยึดตัวรายการ ไม่ยึดอันดับ (หน้ากำหนดลำดับจากข้อมูลทั้งหมดก่อนกรอง)
   สีสถานะ (ปกติ/ใกล้ครบ/เลยกำหนด/ไม่มีข้อมูล · ผ่าน/ไม่ผ่าน) ใช้ success/warning/error/gray ตรงความหมาย คู่ป้ายข้อความเสมอ */
export type Hue = "blue" | "green" | "orange" | "magenta" | "purple" | "red" | "navy" | "gray";

export const HUE: Record<Hue, { bg: string; stroke: string; text: string }> = {
  blue: { bg: "bg-info-600", stroke: "stroke-info-600", text: "text-info-600" },
  green: { bg: "bg-success-600", stroke: "stroke-success-600", text: "text-success-600" },
  orange: { bg: "bg-warning-600", stroke: "stroke-warning-600", text: "text-warning-600" },
  magenta: { bg: "bg-brand-800", stroke: "stroke-brand-800", text: "text-brand-800" },
  purple: { bg: "bg-purple-600", stroke: "stroke-purple-600", text: "text-purple-600" },
  red: { bg: "bg-error-500", stroke: "stroke-error-500", text: "text-error-500" },
  navy: { bg: "bg-secondary-700", stroke: "stroke-secondary-700", text: "text-secondary-700" },
  gray: { bg: "bg-gray-400", stroke: "stroke-gray-400", text: "text-gray-500" },
};

/** ลำดับสีตามหมวด — เกิน 6 รายการเป็นสีเทา ("อื่น ๆ") ไม่วนสีซ้ำ */
export const CATEGORICAL: Hue[] = ["blue", "green", "orange", "magenta", "purple", "red"];
export const hueAt = (i: number): Hue => CATEGORICAL[i] ?? "gray";
/** สีตามหมวดแบบยึดตัวรายการ: order = ลำดับรายการจากข้อมูลทั้งหมด (ก่อนกรอง) */
export const hueOf = (order: string[], key: string): Hue => hueAt(order.indexOf(key));

export const nf = (n: number) => n.toLocaleString("th-TH");
export const pct = (n: number, total: number) => (total ? ((n / total) * 100).toFixed(1) + "%" : "0.0%");
