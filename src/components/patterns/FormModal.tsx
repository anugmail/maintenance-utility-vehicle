"use client";
/* popup แบบฟอร์ม ตาม formModal() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
   Desktop: Modal Type=Form Size=md (500) · Modal header Alignment=Left (ไม่มี Featured icon · ปุ่มปิด) · Form ขอบในข้าง 24 ช่องไฟ 12 = Card form row ละ 1 ช่อง
            (Text input · แถว area = Text area) · Modal footer Alignment=Horizontal right: Secondary "ยกเลิก" + Primary "บันทึก"
   Mobile: Bottom sheet หัวเรื่อง = ชื่อ popup · ช่องเรียงลง ช่องไฟ 16 · Bottom sheet footer ปุ่ม lg
   ใช้ fields (ช่องตามรูปแบบ formModal) หรือ children (วางช่องเอง — ห่อแต่ละแถวด้วย CardFormRow บน desktop) */
import type { ReactNode } from "react";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { CardFormRow } from "@/components/vms/CardFormRow";
import { Modal } from "@/components/vms/Modal";
import { ModalFooter } from "@/components/vms/ModalFooter";
import { ModalHeader } from "@/components/vms/ModalHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput } from "@/components/vms/TextInput";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface FormField { label: string; value?: string; placeholder?: string; area?: boolean; optional?: boolean; error?: string }

export interface FormModalProps {
  open: boolean;
  title: string;
  sub?: string;
  fields?: FormField[];
  onField?: (i: number, v: string) => void;
  children?: ReactNode;
  ok?: string;
  cancel?: string;
  okDisabled?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

export function FormModal({ open, title, sub, fields, onField, children, ok = "บันทึก", cancel = "ยกเลิก", okDisabled, onOk, onCancel }: FormModalProps) {
  const mob = useBreakpoint() === "Mobile";
  if (!open) return null;
  const input = (f: FormField, i: number) => {
    const p = { LabelText: f.label, Optional: f.optional, Text: f.value, Placeholder: f.placeholder, onChange: (v: string) => onField?.(i, v), State: f.error ? ("Error" as const) : undefined, HelperText: f.error };
    return f.area ? <TextArea key={i} {...p} /> : <TextInput key={i} {...p} />;
  };
  const Ok = <PrimaryButton Text={ok} Size={mob ? "lg" : "md"} State={okDisabled ? "Disabled" : "Default"} onClick={onOk} />;
  const Cancel = <SecondaryButton Text={cancel} Size={mob ? "lg" : "md"} onClick={onCancel} />;
  if (mob) {
    return (
      <BottomSheet open onClose={onCancel} Title={title} labelledBy="form-modal-title" Footer={<BottomSheetFooter SecondaryAction={Cancel} PrimaryAction={Ok} />}>
        {fields ? fields.map(input) : children}
      </BottomSheet>
    );
  }
  return (
    <Modal open onClose={onCancel} Type="Form" Size="md" labelledBy="form-modal-title"
      Header={<ModalHeader id="form-modal-title" Alignment="Left" FeaturedIcon={false} Title={title} SupportingText={sub} onClose={onCancel} />}
      Footer={<ModalFooter Alignment="Horizontal right" SecondaryAction={Cancel} PrimaryAction={Ok} />}>
      {fields ? fields.map((f, i) => <CardFormRow key={i} Input1={input(f, i)} />) : children}
    </Modal>
  );
}
