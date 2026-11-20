"use client";
import { useState } from "react";
import { FormModal } from "@/components/patterns/FormModal";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { TertiaryDangerButton } from "@/components/vms/TertiaryDangerButton";

const TEXT = { approve: "อนุมัติ", return: "ส่งกลับแก้ไข" } as const;

export function ReviewActions({ onApprove, onReturn }: { onApprove: () => void; onReturn: () => void }) {
  return <>
    <TertiaryDangerButton Text={TEXT.return} onClick={onReturn} />
    <PrimaryButton Text={TEXT.approve} onClick={onApprove} />
  </>;
}

export function ReturnModal({ open, sub, onCancel, onOk }: { open: boolean; sub: string; onCancel: () => void; onOk: (reason: string) => void }) {
  if (!open) return null;
  return <ReturnForm sub={sub} onCancel={onCancel} onOk={onOk} />;
}

function ReturnForm({ sub, onCancel, onOk }: { sub: string; onCancel: () => void; onOk: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [tried, setTried] = useState(false);
  const err = tried && !reason.trim();
  return <FormModal open danger title={TEXT.return} sub={sub} ok={TEXT.return} onCancel={onCancel}
    fields={[{ label: "เหตุผลที่ส่งกลับ", area: true, value: reason, placeholder: "ระบุเหตุผลที่ส่งกลับ", error: err ? "กรุณาระบุเหตุผลที่ส่งกลับ" : undefined }]}
    onField={(_, v) => setReason(v)} onOk={() => (reason.trim() ? onOk(reason.trim()) : setTried(true))} />;
}
