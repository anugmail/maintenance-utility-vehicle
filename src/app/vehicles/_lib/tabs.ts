/* แท็บของหน้ารายละเอียดยานพาหนะ (S24 · 12 พ.ย. 2569 BACKLOG ข้อ 85) — ?tab=<ชื่อ> ไม่ใช้ลำดับ (ลำดับแท็บเปลี่ยนแล้ว 2 ครั้ง)
   ที่อยู่เดิม ?tab=0–4 (5 แท็บเดิม ข้อมูลยานพาหนะ · ตารางบำรุงรักษา · ประวัติการซ่อมบำรุง · การรับประกัน · Overhaul) ยังเปิดได้:
     0 → info · 1 → schedule · 2 → machine (มุมมองเริ่มเดิม "บำรุงรักษาเครื่องจักร") หรือ history ถ้ามี &view=repair (มุมมองเดิม "ซ่อมเครื่องจักร")
     · 3 การรับประกัน → info (ส่วนการรับประกันย้ายมาแท็บข้อมูลยานพาหนะ) · 4 Overhaul → history (งาน Overhaul อยู่ในประวัติการซ่อมบำรุง ป้าย Overhaul) */
export const TAB_KEYS = ["info", "schedule", "machine", "engine", "history"] as const;
export type TabKey = (typeof TAB_KEYS)[number];
export const TAB_TITLES: Record<TabKey, string> = {
  info: "ข้อมูลยานพาหนะ", schedule: "ตารางบำรุงรักษา", machine: "ประวัติการบำรุงรักษาเครื่องจักร", engine: "ประวัติการบำรุงรักษาเครื่องยนต์", history: "ประวัติการซ่อมบำรุง",
};
const LEGACY: Record<string, TabKey> = { "0": "info", "1": "schedule", "2": "machine", "3": "info", "4": "history" };
export function tabOf(tab: string | null, view?: string | null): TabKey {
  if (!tab) return "info";
  if ((TAB_KEYS as readonly string[]).includes(tab)) return tab as TabKey;
  if (tab === "2" && view === "repair") return "history";
  return LEGACY[tab] ?? "info";
}
export const tabHref = (carId: string, tab: TabKey) => "/vehicles/detail/?car=" + carId + "&tab=" + tab;
