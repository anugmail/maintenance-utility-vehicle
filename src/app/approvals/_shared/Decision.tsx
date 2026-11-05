"use client";
/* ผลการพิจารณา (S2 · S7) — decisionSection() ใน screens.js · ปรับ 5 พ.ย. 2569 (รีวิวทีมออกแบบ)
   "Default จะยังไม่เลือกผลการพิจารณาให้ ต้องเลือกเอง · ย้ายตำแหน่งจากด้านล่างสุดไปไว้ด้านบนสุดให้เหมือนงานซ่อม"
   ตาม `Section label` + `Radio text card` ×2 + `Text area` ของไฟล์ Component + Incident detail ของ Flow การซ่อม (ไฟล์ Maintain-D: Section label + Radio text card ×2 ก่อนส่วนข้อมูล)
   ไม่มีใบที่เลือกไว้ก่อน · เลือกส่งกลับแก้ไข → Text area "เหตุผลที่ส่งกลับ" (บังคับ · ออกจากช่องโดยยังว่าง = "กรุณาระบุเหตุผลที่ส่งกลับ")
   ok = เลือกอนุมัติ หรือ ส่งกลับ + มีเหตุผล (ปุ่ม "ยืนยันผลการพิจารณา" Disabled จนกว่า ok) */
import { useState } from "react";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TextArea } from "@/components/vms/TextArea";

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
