"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TabItem } from "@/components/vms/TabItem";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import type { CellAction } from "@/components/vms/TableCell";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { Tabs } from "@/components/vms/Tabs";
import { useMock, useRole } from "@/lib/mock/store";
import { EVAL_KINDS, KIND, PROVIDER_LABEL, SAT_EMPTY, SAT_EMPTY_BTN, SAT_SAMPLES, SAT_SEARCH, SAT_TABS, SAT_TITLE, SURVEY_MAX, average, canEvaluate, rowsFor, satFormHref, satResultHref, total, type EvalRow } from "@/lib/mock/survey";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "@/lib/useSample";
import { ALL, FilterShell } from "../vehicles/_lib/ui";

const PEND_COLS: TableColumn[] = [{ head: "เลขที่งาน", width: 170, Style: "Lead text" }, { head: "ประเภทงาน", width: 170, Style: "Badge" }, { head: "ทะเบียน", width: 200 }, { head: "งาน" },
  { head: PROVIDER_LABEL, width: 170 }, { head: "วันที่ปิดงาน", width: 130 }, { head: "ดำเนินการ", width: 104, Style: "Action icons" }];
const DONE_COLS: TableColumn[] = [{ head: "เลขที่งาน", width: 170, Style: "Lead text" }, { head: "ประเภทงาน", width: 170, Style: "Badge" }, { head: "ทะเบียน" }, { head: PROVIDER_LABEL, width: 170 },
  { head: "วันที่ประเมิน", width: 130 }, { head: "ผู้ประเมิน", width: 190 }, { head: "คะแนน (เต็ม " + SURVEY_MAX + ")", width: 190 }, { head: "", width: 60, Style: "Action icons" }];
const PER = 10;
const KIND_LABELS = EVAL_KINDS.map((k) => KIND[k][0]);

interface EFilter { kinds: string[]; units: string[] }
const NONE: EFilter = { kinds: [], units: [] };
const match = (r: EvalRow, f: EFilter) => (!f.kinds.length || f.kinds.includes(KIND[r.kind][0])) && (!f.units.length || f.units.includes(r.provider));
const chipsOf = (f: EFilter) => [...f.kinds, ...f.units];
const dropChip = (f: EFilter, v: string): EFilter => ({ kinds: f.kinds.filter((x) => x !== v), units: f.units.filter((x) => x !== v) });

function SatList() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(SAT_SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const role = useRole();
  const keeper = canEvaluate(role);
  const mock = useMock();
  const [tab, setTab] = useState(sp.get("tab") === "1" ? 1 : 0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EFilter>(NONE);
  const [draft, setDraft] = useState<EFilter>(NONE);
  const [panel, setPanel] = useState(false);
  const [open, setOpen] = useState("");
  const all = useMemo(() => rowsFor(mock, role), [mock, role]);
  if (pending) return null;

  const wait = all.filter((r) => !r.evaluated), done = all.filter((r) => r.evaluated);
  const base = tab ? done : wait;
  const q = query.trim().toLowerCase();
  const list = base.filter((r) => (!q || [r.no, r.plate, r.work, r.provider].some((s) => s.toLowerCase().includes(q))) && match(r, filter));
  const shown = list.slice((page - 1) * PER, page * PER);
  const rows: TableValue[][] = shown.map((r) => {
    const kind: TableValue = { pills: [[KIND[r.kind][0], KIND[r.kind][1]]] };
    const plate = { text: r.plate, sub: r.vtype };
    if (!tab) {
      const a: CellAction[] = keeper ? [{ IconSwap: "star-24-300-round", label: "ประเมิน " + r.no + " " + r.plate, onClick: () => router.push(satFormHref(r)) }] : [];
      return [r.no, kind, plate, r.work, r.provider, r.closedAt, { actions: a, mobileActions: a }];
    }
    const s = r.survey!;
    const a: CellAction[] = [{ IconSwap: "quick_reference_all-24-300-round", label: "ดูผลประเมิน " + r.no + " " + r.plate, onClick: () => router.push(satResultHref(r)) }];
    return [r.no, kind, plate, r.provider, (s.at ?? "").slice(0, 10) || "-", s.by ?? r.caretaker, total(s.answers) + " / " + SURVEY_MAX + " · เฉลี่ย " + average(s.answers), { actions: a, mobileActions: a }];
  });
  const cols = tab ? DONE_COLS : PEND_COLS;
  const pager = <TablePagination total={list.length} page={page} perPage={PER} onPage={setPage} />;
  const go = (t: number) => { setTab(t); setPage(1); };
  const put = (f: EFilter) => { setFilter(f); setPage(1); };
  const chips = chipsOf(filter);
  const units = [...new Set(all.map((r) => r.provider))];
  const toggle = (k: string) => (o: boolean) => setOpen(o ? k : "");
  const multi = (k: keyof EFilter, label: string, options: string[]) => (
    <InputDropdownWithBadges key={k} LabelText={label} Optional values={draft[k]} Placeholder={ALL} onRemove={(v) => setDraft({ ...draft, [k]: draft[k].filter((x) => x !== v) })} open={open === k} onOpenChange={toggle(k)}>
      <DropdownList>{options.map((o) => <DropdownListItem key={o} Text={o} State={draft[k].includes(o) ? "Selected" : "Default"}
        onClick={() => setDraft({ ...draft, [k]: draft[k].includes(o) ? draft[k].filter((x) => x !== o) : [...draft[k], o] })} />)}</DropdownList>
    </InputDropdownWithBadges>
  );
  const key = (i: number) => shown[i].id;

  return (
    <>
      <PageHeader Title={SAT_TITLE} crumbs={[{ Text: SAT_TITLE }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{SAT_TABS.map((t, i) => <TabItem key={t} Text={t} Badge={i === 0 ? wait.length : null} Active={tab === i} onClick={() => go(i)} />)}</Tabs>
        {!base.length ? (
          tab ? <EmptyStateDataEmpty Text="ยังไม่มีรายการที่ประเมินแล้ว" />
          : <EmptyStateDataEmpty Text={SAT_EMPTY[0]} SupportingText={SAT_EMPTY[1]} Actions={<SecondaryButton Text={SAT_EMPTY_BTN} Size={mob ? "lg" : "md"} onClick={() => go(1)} />} />
        ) : (
          <>
            <TableHeader Placeholder={SAT_SEARCH} query={query} onQuery={(v) => { setQuery(v); setPage(1); }} onFilter={() => { setDraft(filter); setOpen(""); setPanel(true); }}
              FilterCount={chips.length} Filters={chips} onRemoveFilter={(v) => put(dropChip(filter, v))} />
            {!list.length ? <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={() => { setQuery(""); put(NONE); }} />} />
              : mob ? <div className="flex flex-col gap-5"><MobileCards columns={cols} rows={rows} rowKey={(_, i) => key(i)} />{pager}</div>
              : <Table columns={cols} rows={rows} rowKey={(_, i) => key(i)} Pagination={pager} />}
          </>
        )}
      </section>
      <FilterShell open={panel} onClose={() => setPanel(false)} onClear={() => setDraft(NONE)} onApply={() => { put(draft); setPanel(false); }}>
        {multi("kinds", "ประเภทงาน", KIND_LABELS)}
        {multi("units", PROVIDER_LABEL, units)}
      </FilterShell>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SatList /></Suspense></AppFrame>;
}
