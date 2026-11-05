"use client";
/* หน้าของต้นแบบ (ไม่ใช่จอของระบบ): หน้าเรื่องของโหมดพาดูทีละเรื่อง /scenarios/guide/?s=<เรื่อง> — เปิดจากปุ่ม "ดูเคส" ในหน้า /scenarios/
   ลูกค้าเห็นหน้านี้ตอนยืนยันงาน ⇒ ข้อความภาษาคนพูด ไม่มีรหัส scenario (lib/guide/types.ts)
   ประกอบจากชิ้นไลบรารี (ไม่มีจอใน UI Release#2 — COMPOSED.md หัวข้อ ด.):
     `Page header` (ชื่อเรื่อง + สิ่งที่เรื่องนี้ทำได้) → กล่องแสดงข้อมูล (patterns/DisplayBox: ผู้ใช้งาน · ชีตยืนยัน ทุกหน้าที่เคสของเรื่องใช้ SHEET_PAGE)
     → `Section header` "เคสที่พาดู" + Badge จำนวนเคส → การ์ด `Mobile table` 1 เคส = 1 การ์ด (Lead text ชื่อเคส + บรรทัดรอง · จำนวนขั้น · ชีตยืนยันหน้าของเคส · Action buttons "เริ่มเคสนี้")
     desktop การ์ดเรียง 2 คอลัมน์ (Table ของไลบรารีไม่มีช่องปุ่มข้อความ) */
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
import { startHref } from "@/lib/guide/start";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS: TableColumn[] = [{ head: "เคส", Style: "Lead text" }, { head: "จำนวนขั้น" }, { head: "ชีตยืนยัน" }, { head: "", Style: "Action icons" }];

function Guide() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const g = guideOf(sp.get("s"));
  useEffect(() => { if (!g) router.replace("/scenarios/"); }, [g, router]);
  if (!g) return null;
  return (
    <>
      <PageHeader Title={g.title} SupportingText={g.about} onBack={() => router.push("/scenarios/")}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: g.title }]} />
      <DisplayBox pairs={[["ผู้ใช้งาน", g.who], ["ชีตยืนยัน", sheetText(sheetPagesOf(g))]]} perRow={2} />
      <section className="flex flex-col gap-4">
        <SectionHeader Title="เคสที่พาดู" Badge={g.cases.length + " เคส"} />
        <div className={cx("grid gap-4", !mob && "grid-cols-2")}>
          {g.cases.map((c) => (
            <MobileCards key={c.id} columns={COLS} rows={[[
              { text: c.name, sub: c.about }, c.steps.length + " ขั้น", sheetText(casePages(c)),
              { actions: [], mobileButtons: <SecondaryButton Text="เริ่มเคสนี้" LeadingIconSwap="play_arrow-24-300-round" Size="lg" aria-label={"เริ่มเคสนี้ " + c.name} onClick={() => router.push(startHref(c.id))} /> },
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
