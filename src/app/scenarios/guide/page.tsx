"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import type { TableColumn } from "@/components/vms/Table";
import { cx } from "@/lib/cx";
import { casePages, guideOf, sheetPagesOf, sheetText } from "@/lib/guide/scenarios";
import { GUIDE_MENU, startHref } from "@/lib/guide/start";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS: TableColumn[] = [{ head: "เคส", Style: "Lead text" }, { head: "จำนวนขั้น" }, { head: "ชีตยืนยัน" }, { head: "", Style: "Action icons" }];

function Guide() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const g = guideOf(sp.get("s"));
  const from = sp.get("from");
  const back = from === "menu" ? GUIDE_MENU : "/scenarios/";
  useEffect(() => { if (!g) router.replace(back); }, [g, router, back]);
  if (!g) return null;
  return (
    <>
      <PageHeader Title={g.title} SupportingText={g.about} onBack={() => router.push(back)}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, ...(from === "menu" ? [{ Text: "พาดูทีละเรื่อง", href: GUIDE_MENU }] : []), { Text: g.title }]} />
      <DisplayBox pairs={[["ผู้ใช้งาน", g.who], ["ชีตยืนยัน", sheetText(sheetPagesOf(g))]]} perRow={2} />
      <section className="flex flex-col gap-4">
        <SectionHeader Title="เคสที่พาดู" Badge={g.cases.length + " เคส"} />
        <div className={cx("grid gap-4", !mob && "grid-cols-2")}>
          {g.cases.map((c) => (
            <MobileCards key={c.id} columns={COLS} rows={[[
              { text: c.name, sub: c.about }, c.steps.length + " ขั้น", sheetText(casePages(c)),
              { actions: [], mobileButtons: <SecondaryButton Text="เริ่มเคสนี้" LeadingIconSwap="play_arrow-24-300-round" Size="lg" aria-label={"เริ่มเคสนี้ " + c.name} onClick={() => router.push(startHref(c.id, from))} /> },
            ]]} />
          ))}
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Guide /></Suspense></AppFrame>;
}
