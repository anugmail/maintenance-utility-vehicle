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
