"use client";
/* S4 · กบค. ติดตามความคืบหน้าและเบิกอะไหล่ของไตรมาส (/quarter/parts/?id=Z7000001&q=1) — partsProgress() + partsSummary() ใน screens.js · spec S4.md
   Page header "ความคืบหน้าอะไหล่ · ไตรมาส 1" (ย้อนกลับ) → Content ช่องไฟ 32:
     Alert Info คลังรับทราบ · (Alert Error Smart Inventory ขัดข้อง) · (Alert Warning ผลไม่พอ) · (Alert Success เบิกครบ)
     Section label "อะไหล่ที่ต้องเบิกในไตรมาส 1 (n)" + Table (PROG_COLS) / Empty state/Data empty
     ปุ่ม ย้อนกลับ · เบิก/จองอะไหล่ (C.1 C.5 C.6) → สรุป (desktop SummaryRequestedParts ของไฟล์ Maintain-D · มือถือ ConfirmDialog) · ไปทำแผนเดินทาง (C.3 ปิด · C.4 → S6)
   ต้นแบบ: ?sim=down = Smart Inventory ขัดข้อง (C.5) · ?sim=empty = ไตรมาสไม่มีอะไหล่ (C.6) · ของที่รอจัดซื้อ "เข้าคลัง" เมื่อกลับมาเปิดหน้านี้ใหม่ (C.3 → C.4 ไม่มีจอ)
   ทางเข้า: ปุ่มจากหน้ารายละเอียดแผน (batch A · เจ้าของงาน 4 พ.ย. 2569) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { SummaryRequestedParts } from "@/components/maintain-d/SummaryRequestedParts";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { Alert } from "@/components/vms/Alert";
import { ContentItemRow } from "@/components/vms/ContentItemRow";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import { NOW_CARS, SAMPLE_NEED, SAMPLE_Q_NEED, WD, WH_ACK_AT, lackOf, mrOf, partsSummary, planOf, putQuarter, quarterOf, setPlanStatus, type NeedRow } from "@/lib/mock/closeout";
import { allocOf, carsIn, quarterRows } from "@/lib/mock/planFlow";
import { PARTS } from "@/lib/mock/data";
import { movedParts, partIndex } from "@/lib/mock/moves";
import { quarterCars } from "@/lib/mock/trips";
import { useSeed } from "@/lib/mock/seedB";
import { useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { BtnRow, Content, DataTable, MENU_HOME, Section, planDetailHref, quarterCrumbs, tripsHref, useBack } from "../_shared/ui";

const PROG_COLS: TableColumn[] = [
  { head: "รายการอะไหล่", Style: "Lead text" }, { head: "รหัส", width: 110 }, { head: "ต้องเบิก", width: 110 }, { head: "หน่วย", width: 90 },
  { head: "คงเหลือ Smart Inventory", width: 200 }, { head: "ไม่พอ", width: 100 }, { head: "สถานะการเบิก", width: 150, Style: "Badge" },
];

function PartsProgress() {
  useSeed();
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const kbk = useRole() === "กบค.";
  const id = sp.get("id") ?? "Z7000001", q = Number(sp.get("q") ?? 1);
  const sim = sp.get("sim");
  const down = sim === "down";
  const st = quarterOf(mock, id, q);
  const [confirm, setConfirm] = useState(false);
  const mount = useRef(Math.random().toString(36).slice(2));
  const back = useBack(planDetailHref(id));
  const nowQ = "ไตรมาส " + q;
  const plan = planOf(mock, id);
  /* แผนที่จัดรถรายคัน = ยอดรวมจากรถทีละคัน (ชุดเดียวกับฟอร์มแผนและหน้าคลัง S22 · BACKLOG ข้อ 11) · แผนตัวอย่าง = PARTS ของ screens.js */
  const alloc = plan?.alloc && Object.keys(plan.alloc).length ? allocOf(plan) : null;
  /* S25: รถที่ย้ายมา — อะไหล่ตามแผนของรถคันนั้นรวมอยู่ในยอด + บรรทัดรอง "รวม n หน่วย ของ {ทะเบียน} ที่ย้ายมา" (MOVE_Q2_SUBS) · แผนตัวอย่าง: ไตรมาสอื่นใช้ยอดรถเดิม SAMPLE_Q_NEED แล้วบวกของรถที่ย้ายมา */
  const nowQn = Number((plan?.nowQ ?? "ไตรมาส 1").replace(/\D/g, "")) || 1;
  const base: NeedRow[] = sim === "empty" ? [] : alloc ? quarterRows(alloc, q).map((r) => ({ key: r.key, pi: r.pi, name: r.name, code: r.code, unit: r.unit, qty: r.qty, stock: r.stock }))
    : q === nowQn ? SAMPLE_NEED : SAMPLE_NEED.map((r, i) => ({ ...r, qty: SAMPLE_Q_NEED[q]?.[i] ?? 0 }));
  const need: NeedRow[] = base.map((r) => ({ ...r }));
  if (sim !== "empty") movedParts(mock, id, q).forEach(({ move, parts }) => parts.forEach((p) => {
    let r = need.find((x) => x.name === p.name);
    if (!r) { const pi = partIndex(p.name); r = { key: "mv" + move.carId + p.name, pi: pi >= 0 ? pi : undefined, name: p.name, code: pi >= 0 ? PARTS[pi].code : "-", unit: p.unit, qty: 0, stock: pi >= 0 ? PARTS[pi].stock : undefined }; need.push(r); }
    if (!alloc) r.qty += p.qty;
    r.sub = (r.sub ? r.sub + " · " : "") + "รวม " + p.qty + " " + p.unit + " ของ " + move.plate + " ที่ย้ายมา";
  }));
  const shownNeed = need.filter((r) => r.qty > 0);
  const nCars = alloc ? carsIn(alloc, q).length : q === nowQn ? NOW_CARS : quarterCars(mock, id, q).length;

  /* C.3 → C.4: ของที่รอจัดซื้อเข้าคลังแล้ว เมื่อกลับมาเปิดหน้าใหม่ (หน้าที่กดยืนยันยังเห็นผล "ไม่พอ") */
  useEffect(() => {
    if (st.result === "short" && st.mount && st.mount !== mount.current) putQuarter(id, q, { result: "ok" });
  }, [st.result, st.mount, id, q]);

  const sum = partsSummary(shownNeed);
  const status = (r: NeedRow) => (st.result === "ok" ? WD.taken : st.result === "short" ? (lackOf(r) > 0 ? WD.buy : WD.reserved) : WD.wait);
  const rows = shownNeed.map((r) => [r.sub ? { text: r.name, sub: r.sub } : r.name, r.code, String(r.qty), r.unit, down || r.stock == null ? "-" : String(r.stock),
    down || st.result === "ok" || !lackOf(r) ? "-" : String(lackOf(r)), { pills: [status(r)] }]);
  const picked = shownNeed;

  const withdraw = () => {
    setConfirm(false);
    putQuarter(id, q, sum.short ? { result: "short", mount: mount.current } : { result: "ok" });
    if (plan?.status === "approved") setPlanStatus(id, "active");   // เริ่มเบิกอะไหล่ไตรมาสแรก = แผนเข้าสู่ "ดำเนินการ" (PST.active)
  };
  const primary = st.result === "ok"
    ? <PrimaryButton Text="ไปทำแผนเดินทาง" Size="lg" onClick={() => router.push(tripsHref(id, q))} />
    : st.result === "short"
      ? <PrimaryButton Text="ไปทำแผนเดินทาง" Size="lg" State="Disabled" />
      : <PrimaryButton Text="เบิก/จองอะไหล่" Size="lg" State={!picked.length || down || !kbk ? "Disabled" : "Default"} onClick={() => setConfirm(true)} />;

  return (
    <>
      <PageHeader Title={"ความคืบหน้าอะไหล่ · " + nowQ} onBack={back}
        crumbs={quarterCrumbs(id, plan?.name ?? "", q, "ความคืบหน้าอะไหล่")} />
      <Content>
        <Alert Color="Info" Text={"คลังรับทราบรายการอะไหล่" + nowQ + "แล้ว"} SupportingText={"รถ " + nCars + " คันของไตรมาสนี้ · คลังรับทราบ " + WH_ACK_AT} />
        {down && <Alert Color="Error" Text="เชื่อมต่อ Smart Inventory ไม่ได้" SupportingText="ยังดูคงเหลือและเบิก/จองไม่ได้ ลองใหม่อีกครั้ง" />}
        {st.result === "short" && <Alert Color="Warning" Text={"จองได้ " + sum.ok + " รายการ · คงเหลือไม่พอ " + sum.short + " รายการ"}
          SupportingText={shownNeed.filter((r) => lackOf(r)).map((r) => r.name + " ขาด " + lackOf(r) + " " + r.unit).join(" · ") + " — รอจัดซื้อแล้วเข้าคลัง"} />}
        {st.result === "ok" && <Alert Color="Success" Text="เบิกอะไหล่ครบแล้ว" SupportingText={"เบิกจาก Smart Inventory " + picked.length + " รายการ · ไปทำแผนเดินทางของไตรมาสได้"} />}
        <Section>
          <SectionLabel Title={"อะไหล่ที่ต้องเบิกใน" + nowQ + (picked.length ? " (" + picked.length + ")" : "")} />
          {picked.length
            ? <DataTable columns={PROG_COLS} rows={rows} />
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText="ไตรมาสนี้ยังไม่มีอะไหล่ในแผน เพิ่มอะไหล่ได้ที่แก้ไขแผน" />}
        </Section>
        <BtnRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          {primary}
        </BtnRow>
      </Content>
      {mob
        ? <ConfirmDialog spec={confirm ? { title: "ยืนยันการเบิก/จองอะไหล่", sub: "เบิกจากคลัง " + sum.ok + " รายการ · คงเหลือไม่พอรอจัดซื้อ " + sum.short + " รายการ", ok: "ยืนยันเบิก/จอง" } : null}
            onCancel={() => setConfirm(false)} onOk={withdraw} />
        : <SummaryRequestedParts open={confirm} Title="สรุปรายการเบิก/จองอะไหล่" cancel="ยกเลิก" ok="ยืนยันเบิก/จอง" onCancel={() => setConfirm(false)} onOk={withdraw}
            info={<ContentItemRow perRow={4} items={[["แผน", plan?.name ?? "-"], ["เลขที่ MR", mrOf(id)], ["ไตรมาส", nowQ], ["จำนวนรถ", nCars + " คัน"]]} />}
            groups={sum.groups} totals={sum.totals} />}
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><PartsProgress /></Suspense></AppFrame>;
}
