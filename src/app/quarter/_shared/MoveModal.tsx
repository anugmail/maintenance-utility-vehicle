"use client";
import { useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { PopupModal } from "@/components/patterns/PopupModal";
import { ContentItemRow } from "@/components/vms/ContentItemRow";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { QUARTERS, typeOf } from "@/lib/mock/data";
import { qLabel, type CarPlanPart } from "@/lib/mock/moves";
import { QPART_COLS, qpartRow } from "@/lib/mock/plan";
import type { TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { DataTable } from "./ui";
import { useProtoForm } from "@/lib/protoForm";

export interface MoveTarget { car: TripCar; tripName: string; reason: string; parts: CarPlanPart[] }

export function MoveModal({ target, cur, counts, onCancel, onMove }: { target: MoveTarget | null; cur: number; counts: (k: number) => number; onCancel: () => void; onMove: (k: number) => void }) {
  const mob = useBreakpoint() === "Mobile";
  const [sel, setSel] = useState(0);
  const [ask, setAsk] = useState(false);
  useProtoForm(target && !ask && cur < 4 ? { fill: () => setSel(cur + 1), clear: () => setSel(0), dirty: sel !== 0 } : null);
  if (!target) return null;
  const { car } = target;
  const close = () => { setSel(0); setAsk(false); onCancel(); };
  return (
    <>
      <PopupModal open={!ask} title={"ย้ายไปไตรมาสอื่น · " + car.plate} sub="ยานพาหนะและอะไหล่ตามแผนของยานพาหนะคันนี้จะย้ายไปไตรมาสที่เลือก" width={800} ok="ย้ายยานพาหนะ" okDisabled={!sel}
        onCancel={close} onOk={() => sel && setAsk(true)}>
        <ContentItemRow perRow={mob ? 1 : 2} items={[["ทะเบียน", car.plate], ["ประเภทยานพาหนะ", typeOf(car.model)], ["หน่วยงานเจ้าของยานพาหนะ", car.owner], ["แผนเดินทาง", target.tripName], ...(target.reason ? [["สาเหตุที่บำรุงรักษาไม่ได้", target.reason] as [string, string]] : [])]} />
        <section className="flex flex-col gap-4">
          <SectionHeader Title="เลือกไตรมาสที่จะย้ายไป" />
          <div role="radiogroup" className="flex flex-col gap-3">
            {QUARTERS.map((t, i) => {
              const k = i + 1;
              return <RadioTextCard key={t} Text={t} Selected={sel === k} State={k <= cur ? "Disabled" : "Default"} onClick={() => k > cur && setSel(k)}
                SupportingText={k < cur ? "ไตรมาสก่อนหน้า" : k === cur ? "ไตรมาสปัจจุบัน" : "ยานพาหนะในไตรมาส " + counts(k) + " คัน"} />;
            })}
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <SectionHeader Title="อะไหล่ตามแผนที่ย้ายไปด้วย" Badge={target.parts.length || null} />
          <DataTable columns={QPART_COLS} rows={target.parts.map(qpartRow)} />
        </section>
      </PopupModal>
      <ConfirmDialog spec={ask && sel ? { title: "ยืนยันการย้ายยานพาหนะไป" + qLabel(sel), sub: car.plate + " จะออกจาก" + qLabel(cur) + " ไปอยู่" + qLabel(sel) + " ของแผนนี้ พร้อมอะไหล่ตามแผนของยานพาหนะคันนี้", cancel: "ยกเลิก", ok: "ยืนยัน" } : null}
        onCancel={() => setAsk(false)} onOk={() => { const k = sel; setSel(0); setAsk(false); onMove(k); }} />
    </>
  );
}
