"use client";
import { useState } from "react";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TextArea } from "@/components/vms/TextArea";
import { FormModal } from "@/components/patterns/FormModal";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { TertiaryDangerButton } from "@/components/vms/TertiaryDangerButton";

export type Decision = "" | "approve" | "return";
const TEXT = { approve: "อนุมัติ", return: "ส่งกลับแก้ไข" } as const;

export function useDecision() {
  const [decision, setDecision] = useState<Decision>("");
  const [reason, setReason] = useState("");
  const ok = decision === "approve" || (decision === "return" && !!reason.trim());
  return { decision, setDecision, reason, setReason, ok };
}

export function DecisionSection({ approveSub, returnSub, decision, setDecision, reason, setReason }: {
  approveSub: string; returnSub: string; decision: Decision; setDecision: (d: Decision) => void; reason: string; setReason: (r: string) => void;
}) {
  const [touched, setTouched] = useState(false);
  const err = touched && !reason.trim();
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel Title="ผลการพิจารณา" />
      <RadioTextCards options={[{ Text: TEXT.approve, SupportingText: approveSub }, { Text: TEXT.return, SupportingText: returnSub }]}
        value={decision ? TEXT[decision] : null} onChange={(v) => { setDecision(v === TEXT.approve ? "approve" : "return"); setTouched(false); }} />
      {decision === "return" && <TextArea LabelText="เหตุผลที่ส่งกลับ" Text={reason} Placeholder="ระบุเหตุผลที่ส่งกลับ" onChange={setReason} onBlur={() => setTouched(true)}
        State={err ? "Error" : undefined} HelperText={err ? "กรุณาระบุเหตุผลที่ส่งกลับ" : undefined} />}
    </section>
  );
}

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
