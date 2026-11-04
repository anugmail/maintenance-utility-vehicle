"use client";
/* S23 V.1–V.2 · S11 J.1 J.5 J.9 · หน้า รายละเอียดแผนเดินทาง ของแผนจ้างดำเนินการ (/trips/hire/?trip=TV) — tripDetail({ trip: HIRE_T }) ใน screens.js
   Page header (ชื่อแผนเดินทาง · ป้าย "อนุมัติแล้ว") → รายละเอียดแผนเดินทาง (tripKv แผนจ้าง 9 ช่อง + ความคืบหน้า) → รถในแผนเดินทาง (n) Table TRIP_JOB_COLS
   ผู้รับจ้าง: เมนู "…" มีแค่ "ดูรายละเอียด" (เจ้าของงาน 4 พ.ย. 2569) · ไม่มีหน้ารายการแผนเดินทางของผู้รับจ้าง — เข้าจากการแจ้งเตือนมาที่หน้านี้ (Q48 ปิดแล้ว)
   กบค.: เมนูตามสถานะงาน (S10) ยังไม่เริ่ม = ดูรายละเอียด แก้ไข ลบ · อยู่ระหว่างบำรุงรักษา = ดูรายละเอียด แก้ไข · อื่นๆ = ดูรายละเอียด
   มือถือ: การ์ด Mobile table · ไอคอนดู แก้ไข ลบ กางบนการ์ด (CLAUDE.md ข้อ 14) · ป้ายผลน้ำมันเป็นแถวแยก "ผลตรวจน้ำมัน"
   อ้างอิง: Table · Mobile table · Dropdown menu · Modal (Form) ของไฟล์ Component + หน้า RP & MA Job ของ UI Release#2 (ผ่าน screens.js) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { FormModal } from "@/components/patterns/FormModal";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import type { CellAction } from "@/components/vms/TableCell";
import type { MenuEntry } from "@/components/vms/DropdownMenu";
import { MENU } from "@/lib/mock/data";
import {
  JOB_STATUS, OIL_TAG, TRIP_STATUS, applyHireSample, badgeOf, carOf, tripKv, tripLoc, tripPhone, tripProgress, updateTrip, useHire, type JobStatus,
} from "@/lib/mock/hire";
import { useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { MobileRows, jobHref, useSample } from "../../_c2/ui";

/* TRIP_JOB_COLS */
const COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 190, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "เบอร์ติดต่อ", width: 150 },
  { head: "สถานที่บำรุงรักษา", width: 260 }, { head: "สถานะงาน", width: 320, Style: "Badge" }, { head: "", width: 72, Style: "Action icons" },
];
/* JOB_MENU — จำนวนรายการเมนูตามสถานะงาน (กบค.) */
const MENU_N: Record<JobStatus, number> = { todo: 3, doing: 2, done: 1, cannot: 1, worked: 1, reported: 1, wait: 1, returned: 1 };
const SAMPLES = { S23: { role: "ผู้รับจ้าง" as const, apply: () => applyHireSample("S23") }, S11: { role: "กบค." as const, apply: () => applyHireSample("S11") } };

function HireTrip() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const role = useRole();
  const vendor = role === "ผู้รับจ้าง", kbk = role === "กบค.";
  const h = useHire();
  const t = h.trip;
  const [menu, setMenu] = useState<{ car: string; anchor: MenuAnchor } | null>(null);
  const [edit, setEdit] = useState<{ car: string; phone: string; loc: string } | null>(null);
  const [del, setDel] = useState<string | null>(null);

  if (pending) return null;
  if (sp.get("trip") !== "TV") return <EmptyStateSearchNotFound />;

  const status = (id: string): JobStatus => h.jobs[id]?.status ?? "todo";
  const items = (id: string): MenuEntry[] => {
    const n = vendor ? 1 : kbk ? MENU_N[status(id)] : 1;
    const run = [() => router.push(jobHref(id)), () => { const c = carOf(id)!; setEdit({ car: id, phone: tripPhone(t, c), loc: tripLoc(t, c) }); }, () => setDel(id)];
    return MENU.slice(0, n).map((m, i) => ({ ...m, onClick: run[i] }));
  };
  const cars = t.carIds.map((id) => carOf(id)!).filter(Boolean);
  const pillsOf = (id: string): [string, typeof JOB_STATUS.todo[1]][] => {
    const j = h.jobs[id], s = status(id);
    const p: [string, typeof JOB_STATUS.todo[1]][] = [[JOB_STATUS[s][0], JOB_STATUS[s][1]]];
    if (s === "done" && j?.oil) p.push([OIL_TAG[j.oil][0], OIL_TAG[j.oil][1]]);
    return p;
  };
  const icons = (id: string): CellAction[] => items(id).map((m) => ({ IconSwap: m.IconSwap ?? "", label: m.Text + " " + carOf(id)!.plate, onClick: m.onClick }));

  const rows: TableValue[][] = cars.map((c) => [
    { text: c.plate, sub: c.ownerUnit }, c.model,
    t.phones[c.id] ? { text: tripPhone(t, c), sub: "แก้จากเบอร์เจ้าของรถ" } : tripPhone(t, c),
    tripLoc(t, c), { pills: pillsOf(c.id) },
    { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setMenu({ car: c.id, anchor: anchorOf(e.currentTarget) }) }], mobileActions: icons(c.id) },
  ]);

  const crumbs = [
    { Text: "บำรุงรักษาตามวาระ", href: "/" },
    { Text: "แผน MR Z7000001", href: kbk ? "/plans/detail/?id=Z7000001" : undefined },
    { Text: "แผนเดินทาง ไตรมาส 1", href: kbk ? "/quarter/trips/?id=Z7000001&q=1" : undefined },
    { Text: t.name },
  ];
  const removeCar = (id: string) => {
    updateTrip((tt) => ({ ...tt, carIds: tt.carIds.filter((x) => x !== id) }));
    setDel(null);
  };

  return (
    <>
      <PageHeader Title={t.name} Badge={badgeOf(TRIP_STATUS.approved)} crumbs={crumbs} onBack={() => router.back()} />
      <div className="flex flex-col gap-8">
        <VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={[...tripKv(t), ["ความคืบหน้า", tripProgress(h)]]} />
        <section className="flex flex-col gap-4">
          <SectionLabel Title={"รถในแผนเดินทาง (" + cars.length + ")"} />
          {mob ? (
            <MobileRows rows={cars.map((c) => {
              const p = pillsOf(c.id);
              return {
                key: c.id,
                items: [
                  { Style: "Lead text", Header: "ทะเบียน", Text: c.plate, SupportingText: c.ownerUnit },
                  { Header: "ยี่ห้อ/รุ่น", Text: c.model },
                  t.phones[c.id] ? { Header: "เบอร์ติดต่อ", Text: tripPhone(t, c), SupportingText: "แก้จากเบอร์เจ้าของรถ" } : { Header: "เบอร์ติดต่อ", Text: tripPhone(t, c) },
                  { Header: "สถานที่บำรุงรักษา", Text: tripLoc(t, c) },
                  { Style: "Badge", Header: "สถานะงาน", Pill: p[0] },
                  ...(p[1] ? [{ Style: "Badge" as const, Header: "ผลตรวจน้ำมัน", Pill: p[1] }] : []),
                ],
                actions: icons(c.id),
              };
            })} />
          ) : (
            <Table columns={COLS} rows={rows} rowKey={(_, i) => cars[i].id} />
          )}
        </section>
      </div>
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? items(menu.car) : []} onClose={() => setMenu(null)} />
      <FormModal open={!!edit} title={"แก้ไขเบอร์ติดต่อและสถานที่ · " + (edit ? carOf(edit.car)!.plate : "")}
        fields={edit ? [{ label: "เบอร์ติดต่อ", value: edit.phone }, { label: "สถานที่บำรุงรักษา", value: edit.loc }] : []}
        onField={(i, v) => setEdit((e) => (e ? (i === 0 ? { ...e, phone: v } : { ...e, loc: v }) : e))}
        okDisabled={!edit?.phone.trim() || !edit?.loc.trim()}
        onCancel={() => setEdit(null)}
        onOk={() => {
          if (!edit) return;
          const c = carOf(edit.car)!;
          updateTrip((tt) => {
            const phones = { ...tt.phones }, locs = { ...tt.locs };
            if (edit.phone.trim() === (c.ownerPhone ?? "-")) delete phones[c.id]; else phones[c.id] = edit.phone.trim();
            if (edit.loc.trim() === "สำนักงาน " + c.ownerUnit) delete locs[c.id]; else locs[c.id] = edit.loc.trim();
            return { ...tt, phones, locs };
          });
          setEdit(null);
        }} />
      <ConfirmDialog spec={del ? { danger: true, title: "ยืนยันการเอารถออกจากแผนเดินทาง", sub: carOf(del)!.plate + " จะถูกเอาออกจากแผนเดินทางนี้ และเลือกเข้าแผนเดินทางใบอื่นของไตรมาสได้อีก", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onOk={() => del && removeCar(del)} onCancel={() => setDel(null)} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><HireTrip /></Suspense></AppFrame>;
}
