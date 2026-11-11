"use client";
/* S27 Y.1–Y.3 · หน้า ประเมินความพึงพอใจ (/satisfaction/) — satList() ใน screens.js · ยกโครงจาก listScreen() ของ contractor-eval-plugin (ประเมินผู้รับจ้าง)
   เจ้าของงาน 11 พ.ย. 2569 _"แบบประเมินความพอใจ … ทำเป็นอีก 1 view"_ + _"ย้ายออกจาก S13 ไปอยู่ view ใหม่"_ · 1 แถว = ยานพาหนะ 1 คันที่บำรุงรักษาเสร็จและผู้ดูแลยานพาหนะรับทราบแล้ว (S13)
   Page header (ไม่มีย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ) → Section ช่องไฟ 24: Tabs "ยังไม่ได้ประเมิน" (Badge จำนวน) · "ประเมินแล้ว" → Table + Table pagination
     ไม่มีช่องค้นหา/ตัวกรอง (ตาม listScreen ของประเมินผู้รับจ้าง · แบบหน้าประเมินพนักงานขับรถของ VMS+ เดิม) · คอลัมน์แรก #
   ยังไม่ได้ประเมิน: # · ทะเบียน (ประเภทยานพาหนะ) · เลขที่ MR · แผนเดินทาง · ผู้ดำเนินการ (หน่วยงาน) · วันที่รับทราบ · ดำเนินการ (ไอคอนดาว → ฟอร์มประเมิน · เฉพาะผู้ดูแลยานพาหนะ)
   ประเมินแล้ว: # · ทะเบียน · เลขที่ MR · แผนเดินทาง · วันที่ประเมิน · ผู้ประเมิน · คะแนน (เต็ม 55) "46 / 55 · เฉลี่ย 4.18" · ไอคอนดูผล
   ไม่มีรายการ = Empty state/Data empty "ไม่มีรายการที่ต้องประเมิน" + ปุ่ม "ดูรายการที่ประเมินแล้ว" · มือถือ = Mobile table
   ?tab=1 เปิดแท็บประเมินแล้ว (หลังบันทึกสำเร็จ) · อ้างอิง: Tabs · Tab item · Table · Table pagination · Mobile table · Empty state/Data empty ของไฟล์ Component + จอ Y.1–Y.3 */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TabItem } from "@/components/vms/TabItem";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TablePagination } from "@/components/vms/TablePagination";
import { Tabs } from "@/components/vms/Tabs";
import { useMock, useRole } from "@/lib/mock/store";
import { SAT_EMPTY, SAT_EMPTY_BTN, SAT_SAMPLES, SAT_TABS, SAT_TITLE, SURVEY_MAX, average, operatorOf, satFormHref, satResultHref, satRows, total } from "@/lib/mock/survey";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "@/lib/useSample";

const PEND_COLS: TableColumn[] = [{ head: "#", width: 64 }, { head: "ทะเบียน", Style: "Lead text" }, { head: "เลขที่ MR", width: 150 }, { head: "แผนเดินทาง", width: 260 },
  { head: "ผู้ดำเนินการ", width: 220 }, { head: "วันที่รับทราบ", width: 140 }, { head: "ดำเนินการ", width: 104, Style: "Action icons" }];
const DONE_COLS: TableColumn[] = [{ head: "#", width: 64 }, { head: "ทะเบียน", Style: "Lead text" }, { head: "เลขที่ MR", width: 150 }, { head: "แผนเดินทาง", width: 240 },
  { head: "วันที่ประเมิน", width: 140 }, { head: "ผู้ประเมิน", width: 200 }, { head: "คะแนน (เต็ม " + SURVEY_MAX + ")", width: 200 }, { head: "", width: 60, Style: "Action icons" }];
const PER = 10;

function SatList() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(SAT_SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const keeper = useRole() === "ผู้ดูแลยานพาหนะ";
  const mock = useMock();
  const [tab, setTab] = useState(sp.get("tab") === "1" ? 1 : 0);
  const [page, setPage] = useState(1);
  if (pending) return null;

  const all = satRows(mock);
  const wait = all.filter((r) => !r.evaluated), done = all.filter((r) => r.evaluated);
  const list = tab ? done : wait;
  const shown = list.slice((page - 1) * PER, page * PER);
  const rows: TableValue[][] = shown.map((r, k) => {
    const no = String((page - 1) * PER + k + 1);
    if (!tab) {
      const [name, unit] = operatorOf(r);
      return [no, { text: r.car.plate, sub: r.car.type }, r.mr, r.trip.name, unit ? { text: name, sub: unit } : name, (r.job.acceptedAt ?? "").slice(0, 10) || "-",
        { actions: keeper ? [{ IconSwap: "star-24-300-round", label: "ประเมิน " + r.car.plate, onClick: () => router.push(satFormHref(r)) }] : [] }];
    }
    const a = r.survey!.answers;
    return [no, { text: r.car.plate, sub: r.car.type }, r.mr, r.trip.name, (r.survey!.at ?? "").slice(0, 10) || "-", r.survey!.by ?? r.caretaker,
      total(a) + " / " + SURVEY_MAX + " · เฉลี่ย " + average(a),
      { actions: [{ IconSwap: "quick_reference_all-24-300-round", label: "ดูผลประเมิน " + r.car.plate, onClick: () => router.push(satResultHref(r)) }] }];
  });
  const cols = tab ? DONE_COLS : PEND_COLS;
  const pager = <TablePagination total={list.length} page={page} perPage={PER} onPage={setPage} />;
  const go = (t: number) => { setTab(t); setPage(1); };

  return (
    <>
      <PageHeader Title={SAT_TITLE} crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{SAT_TABS.map((t, i) => <TabItem key={t} Text={t} Badge={i === 0 ? wait.length : null} Active={tab === i} onClick={() => go(i)} />)}</Tabs>
        {!list.length ? (
          tab ? <EmptyStateDataEmpty Text="ยังไม่มีรายการที่ประเมินแล้ว" />   /* แท็บประเมินแล้วว่าง (เสนอ · ไม่มีจอในประเมินผู้รับจ้าง) */
          : <EmptyStateDataEmpty Text={SAT_EMPTY[0]} SupportingText={SAT_EMPTY[1]} Actions={<SecondaryButton Text={SAT_EMPTY_BTN} onClick={() => go(1)} />} />
        ) : mob ? (
          <div className="flex flex-col gap-5"><MobileCards columns={cols} rows={rows} rowKey={(_, i) => shown[i].trip.id + ":" + shown[i].car.id} />{pager}</div>
        ) : (
          <Table columns={cols} rows={rows} rowKey={(_, i) => shown[i].trip.id + ":" + shown[i].car.id} Pagination={pager} />
        )}
      </section>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SatList /></Suspense></AppFrame>;
}
