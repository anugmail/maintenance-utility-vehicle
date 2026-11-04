"use client";
/* แผงแจ้งเตือนใต้กระดิ่ง ตาม notiPanel() ใน screens.js (S8) — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
   Desktop: Notification card ลอยมุมขวาบน ใต้ Header navigation (ห่างขอบขวา 24 · ใต้หัว 8) · แถว = _Notification item base (Status · Text · เวลา · ไม่มีปุ่ม)
   Mobile: Bottom sheet หัว "แจ้งเตือน (<ป้าย>)" · การ์ดไม่มีหัว/ท้าย · ปุ่มเดียว Primary "ลบข้อความแจ้งเตือนทั้งหมด" (ไม่มีปุ่มยกเลิก)
   กระดิ่ง = Nav button ที่มี Indicator ใน Header navigation (Indicator=true เมื่อมีแจ้งเตือนใหม่) */
import { useEffect } from "react";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { NotificationCard } from "@/components/vms/NotificationCard";
import { NotificationItemBase } from "@/components/vms/NotificationItemBase";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import type { StatusState } from "@/components/vms/Status";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface NotiItem { state: StatusState; text: string; time: string; onClick?: () => void }

export function NotificationPanel({ open, onClose, badge, items, onClearAll }: { open: boolean; onClose: () => void; badge: string; items: NotiItem[]; onClearAll?: () => void }) {
  const mob = useBreakpoint() === "Mobile";
  useEffect(() => {
    if (!open || mob) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, mob, onClose]);
  if (!open) return null;
  const rows = items.map((it, i) => <NotificationItemBase key={i} StatusState={it.state} Text={it.text} SupportingText={it.time} onClick={it.onClick} />);
  if (mob) {
    return (
      <BottomSheet open onClose={onClose} Title={`แจ้งเตือน (${badge})`} Footer={<BottomSheetFooter PrimaryAction={<PrimaryButton Text="ลบข้อความแจ้งเตือนทั้งหมด" Size="lg" onClick={onClearAll} />} />}>
        <NotificationCard Header={false} Footer={false} className="w-full shadow-none">{rows}</NotificationCard>
      </BottomSheet>
    );
  }
  return (
    <>
      {/* คลิกนอกแผง = ปิด (ไม่มีพื้นหลังทึบตามจอ Figma) */}
      <div aria-hidden="true" className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-18 right-6 z-50 animate-fade-in">
        <NotificationCard Badge={badge} onFooter={onClearAll}>{rows}</NotificationCard>
      </div>
    </>
  );
}
