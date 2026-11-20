"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { AppFrame } from "@/components/shell/AppFrame";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { Table, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { DISTRICTS, HQ_REGION, MENU, UNITS, unitOf } from "@/lib/mock/data";
import { PLAN_COLS, PLAN_COLS_ALL, menuCount, planDistricts, planRow } from "@/lib/mock/plan";
import { DELETE_CONFIRM, PLAN_ROLES, canManage, deletePlan, roleHome, planId, startEdit, useHydrated, visiblePlans } from "@/lib/mock/planFlow";
import { FilterShell } from "@/app/vehicles/_lib/ui";
import { useMock, useRole } from "@/lib/mock/store";
import type { Plan } from "@/lib/mock/data";
import { useBreakpoint } from "@/lib/useBreakpoint";

const PER = 10;
const mrKey = (r: TableValue[]) => { const v = r[0]; return v && typeof v === "object" && "text" in v ? v.text : String(v); };

export default function PlanList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const role = useRole();
  const plans = useMemo(() => visiblePlans(role, mock.plans), [role, mock.plans]);
  const creator = PLAN_ROLES.includes(role);
  const view = role === "กบค.";
  const hydrated = useHydrated();
  const home = hydrated ? roleHome(role, mock) : undefined;
  useEffect(() => { if (hydrated && home) router.replace(home); }, [hydrated, home, router]);
  const [del, setDel] = useState<Plan | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<{ mr: string; anchor: MenuAnchor } | null>(null);

  type F = { districts: string[]; units: string[] };
  const NONE: F = { districts: [], units: [] };
  const [applied, setApplied] = useState<F>(NONE);
  const [panel, setPanel] = useState(false);
  const [fd, setFd] = useState<F>(NONE);
  const [open, setOpen] = useState<"" | "district" | "unit">("");
  const flip = (k: keyof F, v: string) => setFd((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));
  const drop = (k: keyof F) => (v: string) => setFd((f) => ({ ...f, [k]: f[k].filter((x) => x !== v) }));
  const closePanel = () => { setOpen(""); setPanel(false); };
  const chips = [...applied.districts, ...applied.units];
  const removeChip = (c: string) => { setApplied((a) => ({ districts: a.districts.filter((x) => x !== c), units: a.units.filter((x) => x !== c) })); setPage(1); };

  const rows = useMemo(() => {
    const q = query.trim();
    return plans.filter((p) => (!q || p.mr.includes(q) || p.name.includes(q))
      && (!applied.districts.length || planDistricts(p).some((d) => applied.districts.includes(d)))
      && (!applied.units.length || applied.units.includes(unitOf(p.mr, p.unit))));
  }, [plans, query, applied]);
  const shown = rows.slice((page - 1) * PER, page * PER);
  const opened = plans.find((p) => p.mr === menu?.mr);
  const act = (p: Plan, i: number) => {
    if (i === 0) router.push("/detail/?id=" + planId(p));
    else if (i === 1) { startEdit(p); router.push("/edit/?id=" + planId(p)); }
    else setDel(p);
  };
  const nMenu = (p: Plan) => (canManage(role, p) ? menuCount(p) : 1);
  const items = opened ? MENU.slice(0, nMenu(opened)).map((m, i) => ({ ...m, onClick: () => act(opened, i) })) : [];

  const data = shown.map((p) => planRow(p, {
    actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + p.mr, onClick: (e) => setMenu({ mr: p.mr, anchor: anchorOf(e.currentTarget) }) }],
    mobileActions: MENU.slice(0, nMenu(p)).map((m, i) => ({ IconSwap: m.IconSwap, label: m.Text + " " + p.mr, onClick: () => act(p, i) })),
  }, view));
  const create = creator ? <PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/new/")} /> : undefined;

  return (
    <AppFrame>
      <PageHeader Title="บำรุงรักษาตามวาระ" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      {hydrated && !plans.length ? (
        <EmptyStateDataEmpty Text="ไม่มีแผนบำรุงรักษา" SupportingText="เมื่อสร้างแผนบำรุงรักษา รายการแผนจะแสดงที่นี่" Actions={create} />
      ) : (
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} Actions={create}
          onFilter={() => { setFd(applied); setOpen(""); setPanel(true); }} FilterCount={chips.length} Filters={chips} onRemoveFilter={removeChip} />
        {!rows.length ? (
          <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={() => { setQuery(""); setApplied(NONE); setPage(1); }} />} />
        ) : mob ? (
          <div className="flex flex-col gap-5">
            <MobileCards columns={view ? PLAN_COLS_ALL : PLAN_COLS} rows={data} rowKey={mrKey} />
            <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />
          </div>
        ) : (
          <Table columns={view ? PLAN_COLS_ALL : PLAN_COLS} rows={data} rowKey={mrKey} Pagination={<TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />} />
        )}
      </section>
      )}
      <RowMenu anchor={menu?.anchor ?? null} items={items} onClose={() => setMenu(null)} />
      <FilterShell open={panel} onClose={closePanel} onClear={() => setFd(NONE)} onApply={() => { setApplied(fd); setPage(1); closePanel(); }}>
        <InputDropdownWithBadges LabelText="เขต" Optional values={fd.districts} Placeholder="เลือกเขต" onRemove={drop("districts")} open={open === "district"} onOpenChange={(v) => setOpen(v ? "district" : "")}>
          <DropdownList>{Object.entries(DISTRICTS).filter(([r]) => r !== HQ_REGION).flatMap(([, d]) => d).map((x) => <DropdownListItem key={x} Text={x} State={fd.districts.includes(x) ? "Selected" : "Default"} onClick={() => flip("districts", x)} />)}</DropdownList>
        </InputDropdownWithBadges>
        <InputDropdownWithBadges LabelText="หน่วยงานหน้างาน" Optional values={fd.units} Placeholder="เลือกหน่วยงานหน้างาน" onRemove={drop("units")} open={open === "unit"} onOpenChange={(v) => setOpen(v ? "unit" : "")}>
          <DropdownList>{UNITS.map((u) => <DropdownListItem key={u} Text={u} State={fd.units.includes(u) ? "Selected" : "Default"} onClick={() => flip("units", u)} />)}</DropdownList>
        </InputDropdownWithBadges>
      </FilterShell>
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(null)} onOk={() => { const mr = del?.mr; setDel(null); if (mr) deletePlan(mr); }} />
    </AppFrame>
  );
}
