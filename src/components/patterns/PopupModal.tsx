"use client";
/* popup เนื้อหาอิสระ (ตาราง · อัปโหลด · รายการ) ตาม popupModal() ใน screens.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
   Desktop: Background overlay + กล่อง white รัศมี 12 กว้าง 640 (หรือ 800 ตามที่จอระบุ · 1140 = Modal Size=xl ของไลบรารี สำหรับ popup เลือกยานพาหนะ TripCarPicker BACKLOG ข้อ 89) กลางจอ (ห่างขอบบนอย่างน้อย 40)
            Modal header Alignment=Left (Title + Supporting text · ปุ่มปิด · ไม่มี Featured icon) · เนื้อหา ขอบใน 0/24/24 ช่องไฟ 24
            Modal footer Alignment=Horizontal right: Secondary "ยกเลิก" + Primary ok (okDisabled = State Disabled)
   Mobile: Bottom sheet (Bottom sheet header หัวเรื่อง · เนื้อหา ขอบในข้าง 16 ช่องไฟ 16 · Bottom sheet footer ปุ่ม lg) */
import { useEffect, type ReactNode } from "react";
import { BackgroundOverlay } from "@/components/vms/BackgroundOverlay";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { ModalFooter } from "@/components/vms/ModalFooter";
import { ModalHeader } from "@/components/vms/ModalHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { cx } from "@/lib/cx";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface PopupModalProps {
  open: boolean;
  title: string;
  sub?: string;
  /** กว้าง 640 (ค่าเริ่ม) · 800 · 1140 (Modal Size=xl) */
  width?: 640 | 800 | 1140;
  children: ReactNode;
  ok?: string;
  cancel?: string;
  okDisabled?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  /** false = ไม่มีปุ่มหลัก (popup ดูอย่างเดียว) */
  showOk?: boolean;
}

export function PopupModal({ open, title, sub, width = 640, children, ok = "ยืนยัน", cancel = "ยกเลิก", okDisabled, onOk, onCancel, showOk = true }: PopupModalProps) {
  const mob = useBreakpoint() === "Mobile";
  useEffect(() => {
    if (!open || mob) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel?.(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, mob, onCancel]);
  if (!open) return null;
  const Ok = showOk ? <PrimaryButton Text={ok} Size={mob ? "lg" : "md"} State={okDisabled ? "Disabled" : "Default"} onClick={onOk} /> : undefined;
  const Cancel = <SecondaryButton Text={cancel} Size={mob ? "lg" : "md"} onClick={onCancel} />;
  if (mob) {
    return <BottomSheet open onClose={onCancel} Title={title} labelledBy="popup-title" Footer={<BottomSheetFooter SecondaryAction={Cancel} PrimaryAction={Ok} />}>{children}</BottomSheet>;
  }
  return (
    <>
      <BackgroundOverlay onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10" onClick={onCancel}>
        <div role="dialog" aria-modal="true" aria-labelledby="popup-title" onClick={(e) => e.stopPropagation()}
          className={cx("my-auto flex max-w-full flex-col rounded-lg bg-white animate-fade-in", width === 1140 ? "w-[1140px]" : width === 800 ? "w-[800px]" : "w-[640px]")}>
          <ModalHeader id="popup-title" Alignment="Left" FeaturedIcon={false} Title={title} SupportingText={sub} onClose={onCancel} />
          <div className="flex flex-col gap-6 px-6 pb-6">{children}</div>
          <ModalFooter Alignment="Horizontal right" SecondaryAction={Cancel} PrimaryAction={Ok} />
        </div>
      </div>
    </>
  );
}
