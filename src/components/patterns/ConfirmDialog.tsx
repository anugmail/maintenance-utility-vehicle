"use client";
/* popup ยืนยัน ตาม confirm() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
   Desktop: Modal Type=Centered image (ซ่อนรูป) · danger = Type=Destructive centered image with input (ซ่อน Form) ปุ่มหลัก Primary danger button · Modal header Alignment=Center + Modal footer Horizontal fill
   Mobile: Bottom sheet (ไม่มีหัว) + Modal header Alignment=Center (ไม่มีปุ่มปิด) + Bottom sheet footer ปุ่ม Size=lg */
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { Modal } from "@/components/vms/Modal";
import { ModalFooter } from "@/components/vms/ModalFooter";
import { ModalHeader } from "@/components/vms/ModalHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { PrimaryDangerButton } from "@/components/vms/PrimaryDangerButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface ConfirmSpec { title: string; sub?: string; cancel?: string; ok?: string; danger?: boolean }

export function ConfirmDialog({ spec, onOk, onCancel }: { spec: ConfirmSpec | null; onOk: () => void; onCancel: () => void }) {
  const mob = useBreakpoint() === "Mobile";
  if (!spec) return null;
  const Ok = spec.danger ? PrimaryDangerButton : PrimaryButton;
  if (mob) {
    return (
      <BottomSheet open onClose={onCancel} flush labelledBy="confirm-title"
        Footer={<BottomSheetFooter SecondaryAction={<SecondaryButton Text={spec.cancel ?? "ยกเลิก"} Size="lg" onClick={onCancel} />} PrimaryAction={<Ok Text={spec.ok ?? "ยืนยัน"} Size="lg" onClick={onOk} />} />}>
        <ModalHeader id="confirm-title" Alignment="Center" Title={spec.title} SupportingText={spec.sub} />
      </BottomSheet>
    );
  }
  return (
    <Modal open onClose={onCancel} Type={spec.danger ? "Destructive centered image with input" : "Centered image"} labelledBy="confirm-title"
      Header={<ModalHeader id="confirm-title" Alignment="Center" Title={spec.title} SupportingText={spec.sub} onClose={onCancel} />}
      Footer={<ModalFooter SecondaryAction={<SecondaryButton Text={spec.cancel ?? "ยกเลิก"} onClick={onCancel} />} PrimaryAction={<Ok Text={spec.ok ?? "ยืนยัน"} onClick={onOk} />} />} />
  );
}
