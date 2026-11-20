"use client";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { guideByCode } from "@/lib/guide/scenarios";
import { scenarioHref } from "@/lib/guide/start";
import { ACTIVE_SCENARIOS, CUT_SCENARIOS, TOPIC_SCENARIOS, type Scenario } from "@/lib/scenarios";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS: TableColumn[] = [
  { head: "scenario", width: 110, Style: "Lead text" },
  { head: "ชื่อ", Style: "Text" },
  { head: "ช่วงงาน", width: 220 },
  { head: "บทบาท", width: 200 },
  { head: "สถานะ", width: 130, Style: "Badge" },
  { head: "", width: 112, Style: "Action icons" },
];

const CUT_COLS: TableColumn[] = [{ head: "scenario", width: 110, Style: "Lead text" }, { head: "ชื่อ", Style: "Text" }, { head: "เหตุผลที่ตัดออก", width: 420 }];

export default function Scenarios() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const guideAction = (id: string) => { const g = guideByCode(id); return g ? [{ IconSwap: "school-24-300-round", label: "ดูเคส " + id, onClick: () => router.push(scenarioHref(g.key)) }] : []; };
  const rowOf = (s: Scenario): TableValue[] => [
    s.id, s.name, s.phase, s.role,
    { pills: [s.href ? ["พร้อมใช้", "Success"] : ["เร็วๆ นี้", "Gray"]] },
    { actions: [{ IconSwap: "quick_reference_all-24-300-round", label: "เปิด " + s.id, onClick: () => router.push(s.href ?? "/soon/?s=" + s.id) }, ...guideAction(s.id)] },
  ];
  const rows = ACTIVE_SCENARIOS().map(rowOf);
  const topics = [...new Set(TOPIC_SCENARIOS().map((s) => s.topic!))].map((t) => ({ t, rows: TOPIC_SCENARIOS().filter((s) => s.topic === t).map(rowOf) }));
  const cut = CUT_SCENARIOS();
  const cutRows: TableValue[][] = cut.map((s) => [s.id, s.name, s.cut ?? "-"]);
  return (
    <AppFrame>
      <PageHeader Title="ต้นแบบบำรุงรักษาตามวาระ" SupportingText={"ต้นแบบหน้าจอตาม scenario ที่เคาะแล้ว " + rows.length + " scenario เรียงตามลำดับงาน"} crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "รายการ scenario" }]}
        Actions={<SecondaryButton Text="ชุด component" LeadingIconSwap="description-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/kit/")} />} />
      <div className="flex flex-col gap-8">
        {mob ? <MobileCards columns={COLS} rows={rows} /> : <Table columns={COLS} rows={rows} />}
        {topics.map(({ t, rows: tr }) => (
          <section key={t} className="flex flex-col gap-4" data-topic={t}>
            <SectionLabel Title={"เรื่องแยก: " + t + " (" + tr.length + ")"} />
            {mob ? <MobileCards columns={COLS} rows={tr} /> : <Table columns={COLS} rows={tr} />}
          </section>
        ))}
        <section className="flex flex-col gap-4">
          <SectionLabel Title={"Scenario ที่ตัดออกแล้ว (" + cut.length + ")"} />
          {mob ? <MobileCards columns={CUT_COLS} rows={cutRows} /> : <Table columns={CUT_COLS} rows={cutRows} />}
        </section>
      </div>
    </AppFrame>
  );
}
